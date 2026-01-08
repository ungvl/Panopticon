import fetch from 'node-fetch'; // Ensure node-fetch is installed or use Node 18+

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'; // Or your local endpoint
const PROJECT_ID = 'YOUR_PROJECT_ID';
const API_KEY = 'YOUR_API_KEY'; // API Key with execution rights

// Function IDs (Replace with actual IDs)
const FACE_RECEIVER_ID = 'face_event_receiver';
const ACTIVITY_LOGGER_ID = 'activity_logger';

async function testFaceReceiver() {
    console.log('Testing Face Event Receiver (Zero-Image)...');
    const payload = {
        users: ['TEST_USER_ID'], // Replace with a valid user ID
        start_time: Date.now(),
        end_time: Date.now() + 1000,
        day: 'Monday',
        face_embedding: [0.1, 0.2, 0.3, 0.4, 0.5] // Example embedding
    };

    try {
        // Simulate function execution (if testing locally via Appwrite CLI)
        // Or if testing the deployed function:
        /*
        const response = await fetch(`${APPWRITE_ENDPOINT}/functions/${FACE_RECEIVER_ID}/executions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Appwrite-Project': PROJECT_ID,
                'X-Appwrite-Key': API_KEY
            },
            body: JSON.stringify({ data: JSON.stringify(payload) })
        });
        const result = await response.json();
        console.log('Face Receiver Result:', result);
        */
        console.log('Payload to send:', JSON.stringify(payload, null, 2));
        console.log('Check if "users" table is updated with "face_value".');
    } catch (error) {
        console.error('Error testing Face Receiver:', error);
    }
}

async function testActivityLogger() {
    console.log('\nTesting Activity Logger (App Activity)...');
    const payload = {
        start_time: Date.now(),
        duration: 60,
        app_used: 'VS Code',
        app_activity: 'Writing code in main.js'
    };

    try {
        console.log('Payload to send:', JSON.stringify(payload, null, 2));
        console.log('Check if "activity_logs" table has "app_activity" populated.');
    } catch (error) {
        console.error('Error testing Activity Logger:', error);
    }
}

async function main() {
    await testFaceReceiver();
    await testActivityLogger();
}

main();
