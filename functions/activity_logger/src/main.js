import { Client, Databases, ID } from 'node-appwrite';

/**
 * Appwrite Function to receive POST requests and store data in database
 * 
 * @param {Object} context - The Appwrite function context
 * @param {Object} context.req - The request object
 * @param {Object} context.res - The response object
 * @param {Function} context.log - Logging function
 * @param {Function} context.error - Error logging function
 */
export default async ({ req, res, log, error }) => {
    // Initialize Appwrite client
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    try {
        // 1. Validate Request Method
        if (req.method !== 'POST') {
            return res.json({
                success: false,
                message: 'Method not allowed. Please use POST.'
            }, 405);
        }

        // 2. Parse Request Body
        let payload;
        try {
            // Appwrite passes body as string or object depending on content-type
            payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        } catch (err) {
            error('JSON Parse Error:', err);
            return res.json({
                success: false,
                message: 'Invalid JSON body'
            }, 400);
        }

        // 3. Validate Payload & Match Schema
        if (!payload) {
            return res.json({
                success: false,
                message: 'Empty payload'
            }, 400);
        }

        log('Processing payload:', JSON.stringify(payload));

        // Required fields based on your schema
        const { start_time, duration, app_used, users } = payload;

        // Validation
        if (start_time === undefined || duration === undefined || !app_used) {
            return res.json({
                success: false,
                message: 'Missing required fields: start_time, duration, app_used'
            }, 400);
        }

        // 4. Prepare Database Info
        const DATABASE_ID = process.env.DATABASE_ID;
        const COLLECTION_ID = process.env.COLLECTION_ID;

        if (!DATABASE_ID || !COLLECTION_ID) {
            throw new Error('Missing DATABASE_ID or COLLECTION_ID environment variables');
        }

        // 5. Create Document
        // Mapping payload to exact schema structure
        //comment to have a new branch
        const documentData = {
            start_time: parseInt(start_time), // Ensure integer
            duration: parseInt(duration),     // Ensure integer
            app_used: String(app_used),       // Ensure string
            // Optional: Link to user if users relationship ID is provided
            ...(users && { users: users })
        };

        const document = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            documentData
        );

        log(`Document created: ${document.$id}`);

        // 6. Return Success
        return res.json({
            success: true,
            message: 'Activity logged successfully',
            documentId: document.$id,
            data: document
        });

    } catch (err) {
        error('Execution Error:', err);
        return res.json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        }, 500);
    }
};
