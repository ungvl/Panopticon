# Panopticon - Appwrite Function

An Appwrite function that receives POST requests and stores data in an Appwrite database.

## 🔒 Security - API Keys

**IMPORTANT:** This project is designed to be safely committed to GitHub without exposing any secrets!

### How It Works

1. **Environment variables are NOT in the code** - The function uses `process.env` to read configuration
2. **`.gitignore` prevents committing secrets** - The `.env` file is excluded from Git
3. **Appwrite manages secrets securely** - You configure environment variables in the Appwrite Console

### Setting Up Environment Variables

#### In Appwrite Console:
1. Go to your Appwrite Console
2. Navigate to **Functions** → Your Function → **Settings** → **Environment Variables**
3. Add these variables:
   - `APPWRITE_API_KEY` - Your API key (create one with database write permissions)
   - `DATABASE_ID` - Your database ID
   - `COLLECTION_ID` - Your collection ID

#### For Local Development (Optional):
If you want to test locally, create a `.env` file (already in `.gitignore`):
```bash
cp .env.example .env
# Edit .env with your actual values (NEVER commit this file!)
```

## 📦 Deployment

### Using Appwrite CLI

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Deploy the function
appwrite deploy function
```

### Using Appwrite Console

1. Create a new function in your Appwrite project
2. Connect this GitHub repository
3. Set the environment variables in Function Settings
4. Deploy!

## 🚀 Usage

Send POST requests to your function endpoint:

```bash
curl -X POST https://[YOUR-APPWRITE-ENDPOINT]/v1/functions/[FUNCTION-ID]/executions \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: [PROJECT-ID]" \
  -d '{
    "data": "your data here",
    "timestamp": "2024-01-01T00:00:00Z"
  }'
```

### Response Format

**Success (200):**
```json
{
  "success": true,
  "message": "Data stored successfully",
  "documentId": "unique-document-id",
  "data": { ... }
}
```

**Error (400/405/500):**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# The function will be executed by Appwrite runtime
# No local server needed - deploy to Appwrite to test
```

## 📝 What Gets Committed to GitHub

✅ **Safe to commit:**
- `index.js` - Function code (no secrets!)
- `package.json` - Dependencies
- `.env.example` - Template (no real values)
- `.gitignore` - Protects secrets
- `README.md` - Documentation

❌ **Never committed (protected by .gitignore):**
- `.env` - Real environment variables
- `node_modules/` - Dependencies
- Any files with actual API keys

## 🔐 Security Best Practices

1. ✅ **Never hardcode API keys** in the code
2. ✅ **Always use environment variables** via `process.env`
3. ✅ **Keep `.env` in `.gitignore`**
4. ✅ **Use `.env.example`** as a template for others
5. ✅ **Configure secrets in Appwrite Console** for production
6. ✅ **Use API keys with minimal required permissions**

## 📚 Learn More

- [Appwrite Functions Documentation](https://appwrite.io/docs/functions)
- [Appwrite Node.js SDK](https://appwrite.io/docs/sdks#server)
- [Environment Variables in Appwrite](https://appwrite.io/docs/functions#environment-variables)