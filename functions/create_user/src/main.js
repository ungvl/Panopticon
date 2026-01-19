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
        let { name, face_embedding, face_id, user_id } = payload;

        // 1. Input Validation & Sanitization
        if (!name || !face_embedding || !face_id || !user_id) {
            return res.json({ error: 'Missing required fields: name, face_embedding, face_id, user_id' }, 400);
        }

        // Sanitize strings
        if (typeof name !== 'string' || typeof face_id !== 'string' || typeof user_id !== 'string') {
            return res.json({ error: 'Invalid data types: name, face_id, and user_id must be strings' }, 400);
        }

        name = name.trim().slice(0, 100);    // Max 100 chars
        face_id = face_id.trim().slice(0, 64); // Max 64 chars (Appwrite ID limit is usually 36, but schema says 64)
        user_id = user_id.trim().slice(0, 36); // Appwrite ID limit

        // Validate Embedding
        if (!Array.isArray(face_embedding) || face_embedding.length !== 512) {
            return res.json({ error: 'face_embedding must be an array of 512 numbers (InsightFace)' }, 400);
        }

        // Create the user document
        const document = await databases.createDocument(
            process.env.DATABASE_ID,
            'users',
            user_id,
            {
                name: name,
                face_id: face_id,
                role: 'test',
                face_value: JSON.stringify(face_embedding),
            }
        );

        log(`Created user ${name} with ID ${document.$id}`);

        return res.json({
            success: true,
            user_id: document.$id,
            message: 'User created successfully'
        });

    } catch (err) {
        // Log full error internally
        error('Error in create_user function: ' + err.message);
        // Return generic error to user to prevent info leakage
        return res.json({ error: 'Internal Server Error' }, 500);
    }
};
