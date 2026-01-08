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
        if (!payload.users) {
            return res.json({ error: 'Missing required field: users' }, 400);
        }

        // 3.5. Update User Face Embedding (Zero-Image Architecture)
        if (payload.face_embedding && payload.users && payload.users.length > 0) {
            const userPromises = payload.users.map(userId =>
                databases.updateDocument(
                    process.env.DATABASE_ID,
                    'users',
                    userId,
                    {
                        face_value: JSON.stringify(payload.face_embedding)
                    }
                ).catch(err => {
                    // Log error but don't fail the main presence log
                    error(`Failed to update face_value for user ${userId}: ${err.message}`);
                })
            );
            await Promise.all(userPromises);
        }

        // 4. Save to Database
        const result = await databases.createDocument(
            process.env.DATABASE_ID,
            'presence_logs',
            ID.unique(),
            {
                users: payload.users,
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