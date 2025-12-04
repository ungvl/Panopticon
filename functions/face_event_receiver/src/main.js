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

        // Validate required fields (we can check for more if needed)
        if (!payload.user_id || !payload.status) {
            return res.json({ error: 'Missing user_id or status' }, 400);
        }

        // 4. Save to Database
        const result = await databases.createDocument(
            process.env.DATABASE_ID,
            'presence_logs', // <--- CORRECTED: Matches your collection name
            ID.unique(),
            {
                user_id: payload.user_id,
                status: payload.status,
                // Pass through the fields sent by the Python client
                start_time: payload.start_time,
                end_time: payload.end_time,
                day: payload.day
            }
        );

        return res.json({ success: true, id: result.$id });

    } catch (err) {
        error(err.message);
        return res.json({ error: 'Internal Server Error' }, 500);
    }
};