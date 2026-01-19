import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.API_KEY);

    const users = new Users(client);

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
        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        log('Processing login payload:', JSON.stringify(payload));

        const { user_id } = payload;

        if (!user_id) {
            return res.json({ error: 'Missing required field: user_id' }, 400);
        }

        // Logic placeholder: Generate a session or token for the user
        // Assuming the client has already verified the identity via face recognition

        // Example: Create an Email Token (Magic URL) - requires email
        // Or create a generic session if supported by specific flow

        // For now, let's just create a Token which the client can use with account.createSession()
        const { email, password } = payload;

        if (!email || !password) {
            return res.json({ error: 'Missing required fields: email, password' }, 400);
        }

        // [WARNING]: The Appwrite Server SDK (Users API) DOES NOT support checking passwords.
        // You cannot "Login" a user with email/password from a Server Function using an API Key.
        // This flow is designed to be handled by the Client SDK (account.createEmailPasswordSession)
        // directly on your website.

        // If you intended to REGISTER (Create) a user here, we can use users.create().
        // If you intended to Login, you must move this logic to the frontend.

        return res.json({
            error: 'Server-side email/password login is not supported by Appwrite API. Use client SDK.'
        }, 501);

        return res.json({
            success: true,
            user_id: user_id,
            secret: token.secret
        });

    } catch (err) {
        error('Error in login function: ' + err.message);
        return res.json({ error: 'Internal Server Error', details: err.message }, 500);
    }
};
