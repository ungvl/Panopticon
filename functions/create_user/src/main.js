import { Client, Databases, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.API_KEY);

    const databases = new Databases(client);

    if (req.method === 'OPTIONS') {
        return res.send('', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
    }

    if (req.method !== 'POST') {
        return res.json({ error: 'Method not allowed' }, 405);
    }

    try {
        // Handle both parsed object and string body
        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        log('Processing create_user payload:', JSON.stringify(payload));

        // Destructure fields matching Schema
        const { name, face_embedding, face_id } = payload;

        if (!name || !face_embedding || !face_id) {
            return res.json({ error: 'Missing required fields: name, face_embedding, face_id' }, 400);
        }

        if (!Array.isArray(face_embedding)) {
            return res.json({ error: 'face_embedding must be an array' }, 400);
        }
        //random comment
        // Create the user document
        const document = await databases.createDocument(
            process.env.DATABASE_ID,
            'users',
            ID.unique(),
            {
                name: name,
                face_id: face_id,
                role: 'test',
                face_value: JSON.stringify(face_embedding),
                // coffee_count is optional (nullable)
                // zero_image_plan removed as it is not in schema
            }
        );

        log(`Created user ${name} with ID ${document.$id}`);

        return res.json({
            success: true,
            user_id: document.$id,
            message: 'User created successfully'
        });

    } catch (err) {
        error('Error in create_user function: ' + err.message);
        return res.json({ error: 'Internal Server Error', details: err.message }, 500);
    }
};
