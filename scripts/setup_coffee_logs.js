/**
 * setup_coffee_logs.js
 * ─────────────────────
 * Run once to provision the `coffee_logs` collection in Appwrite.
 *
 * Usage:
 *   node scripts/setup_coffee_logs.js
 *
 * Required env vars (set in your shell or a .env file):
 *   APPWRITE_ENDPOINT        – e.g. https://cloud.appwrite.io/v1
 *   APPWRITE_PROJECT_ID      – your project ID
 *   APPWRITE_API_KEY         – API key with databases.write + databases.read scope
 *   DATABASE_ID              – existing database ID to create the collection in
 *   COLLECTION_ID            – desired collection ID (default: "coffee_logs")
 */

const { Client, Databases, IndexType } = require('node-appwrite');

// ── Config ────────────────────────────────────────────────────────────────────
const ENDPOINT      = process.env.APPWRITE_ENDPOINT     || 'https://cloud.appwrite.io/v1';
const PROJECT_ID    = process.env.APPWRITE_PROJECT_ID;
const API_KEY       = process.env.APPWRITE_API_KEY;
const DATABASE_ID   = process.env.DATABASE_ID;
const COLLECTION_ID = process.env.COLLECTION_ID         || 'coffee_logs';

const REQUIRED = { APPWRITE_PROJECT_ID: PROJECT_ID, APPWRITE_API_KEY: API_KEY, DATABASE_ID };
for (const [k, v] of Object.entries(REQUIRED)) {
    if (!v) { console.error(`❌  Missing env var: ${k}`); process.exit(1); }
}

// ── Client ────────────────────────────────────────────────────────────────────
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const db = new Databases(client);

// ── Helpers ───────────────────────────────────────────────────────────────────
async function step(label, fn) {
    process.stdout.write(`  ${label} … `);
    try {
        const result = await fn();
        console.log('✅');
        return result;
    } catch (err) {
        if (err && err.code === 409) {
            console.log('⚠️  already exists, skipping');
        } else {
            console.log(`❌  ${err.message}`);
            throw err;
        }
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n🔧  Panopticon — coffee_logs setup\n');

    // 1. Create collection
    await step(`Create collection "${COLLECTION_ID}"`, function () {
        return db.createCollection(DATABASE_ID, COLLECTION_ID, 'coffee_logs');
    });

    // 2. Attributes
    console.log('\n📋  Creating attributes…');

    await step('event   (string, required)', function () {
        return db.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'event', 32, true);
    });

    await step('timestamp (integer, required)', function () {
        return db.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'timestamp', true);
    });

    await step('day     (string, optional)', function () {
        return db.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'day', 64, false);
    });

    await step('weight  (float, optional)', function () {
        return db.createFloatAttribute(DATABASE_ID, COLLECTION_ID, 'weight', false);
    });

    // Relationship: coffee_logs → users (Many-to-One)
    await step('users   (relationship → users, Many-to-One)', function () {
        return db.createRelationshipAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'users',        // related collection ID
            'manyToOne',    // relationship type
            true,           // two-way
            'users',        // this-side key
            'coffee_logs',  // other-side key (label on users collection)
            'setNull'       // on-delete behaviour
        );
    });

    // 3. Index — small wait for attributes to finish processing
    console.log('\n🗂️   Creating index…');
    await new Promise(function (r) { setTimeout(r, 3000); });

    await step('idx_user_day  (users + day)', function () {
        return db.createIndex(
            DATABASE_ID,
            COLLECTION_ID,
            'idx_user_day',
            IndexType.Key,
            ['users', 'day'],
            ['ASC', 'ASC']
        );
    });

    console.log('\n✅  Done! Collection ready.\n');
    console.log('   Database:   ' + DATABASE_ID);
    console.log('   Collection: ' + COLLECTION_ID + '\n');
}

main().catch(function (err) {
    console.error('\n💥  Setup failed:', err.message);
    process.exit(1);
});
