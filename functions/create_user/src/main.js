import { Client, Databases, ID } from 'node-appwrite';

// Environment variables
// APPWRITE_FUNCTION_PROJECT_ID is auto-injected by Appwrite
// DATABASE_ID must be set in your Appwrite Function variables
// API_KEY must be set in your Appwrite Function variables

export default async ({ req, res, log, error }) => {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.API_KEY); // Ensure this API Key has write access to 'users' collection

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
        const payload = JSON.parse(req.body);
        log('Processing create_user payload:', JSON.stringify(payload));

        const { name, face_embedding } = payload;

        if (!name || !face_embedding) {
            return res.json({ error: 'Missing required fields: name, face_embedding' }, 400);
        }

        if (!Array.isArray(face_embedding)) {
            return res.json({ error: 'face_embedding must be an array' }, 400);
        }

        // Create the user document
        const document = await databases.createDocument(
            process.env.DATABASE_ID,
            'users',
            ID.unique(),
            {
                name: name,
                face_value: JSON.stringify(face_embedding), // Store embedding as JSON string
                // Add default values for other fields if necessary
                zero_image_plan: true // Assuming all new web-registered users are Zero-Image compliant
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
