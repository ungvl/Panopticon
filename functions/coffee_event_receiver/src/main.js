import { Client, Databases, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    // 1. Initialize Client
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // 2. Only allow POST requests
    if (req.method !== 'POST') {
        return res.json({ error: 'Method not allowed' }, 405);
    }

    try {
        // 3. Parse and Validate Body
        const payload = req.body; // Appwrite automatically parses JSON body

        // Validate required fields
        if (!payload.event || typeof payload.event !== 'string') {
            return res.json({ error: 'Missing required field: event' }, 400);
        }
        if (payload.timestamp === undefined || payload.timestamp === null) {
            return res.json({ error: 'Missing required field: timestamp' }, 400);
        }

        // Validate allowed event types
        const validEvents = ['coffee_detected', 'coffee_drinking', 'coffee_done'];
        if (!validEvents.includes(payload.event)) {
            return res.json({ error: `Invalid event type. Must be one of: ${validEvents.join(', ')}` }, 400);
        }

        log(`Coffee event received: ${payload.event} at ${payload.timestamp}`);

        // 4. Build document data — only include optional fields if present
        const documentData = {
            event: payload.event,
            timestamp: payload.timestamp,
        };

        if (payload.day !== undefined && payload.day !== null) {
            documentData.day = payload.day;
        }
        if (payload.weight !== undefined && payload.weight !== null) {
            documentData.weight = payload.weight;
        }
        // users is a Many-to-One relationship — pass as a plain string ID
        if (payload.users !== undefined && payload.users !== null) {
            documentData.users = payload.users;
        }

        // 5. Save to Database
        const result = await databases.createDocument(
            process.env.DATABASE_ID,
            process.env.COLLECTION_ID,
            ID.unique(),
            documentData
        );

        return res.json({ success: true, id: result.$id });

    } catch (err) {
        error(err.message);
        return res.json({ error: 'Internal Server Error' }, 500);
    }
};
