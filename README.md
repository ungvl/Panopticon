# Panopticon - Appwrite Functions Monorepo

This repository contains multiple Appwrite functions for the Panopticon project.

## 📂 Project Structure

```
my-repo/
├── functions/
│   ├── activity_logger/       # Logs user activity (formerly index.js)
│   │   ├── src/main.js
│   │   └── package.json
│   │
│   └── face_event_receiver/   # Handles face detection events from Raspberry Pi
│       ├── src/main.js
│       └── package.json
```

## 🚀 Functions

### 1. Activity Logger (`functions/activity_logger`)
- **Purpose**: Logs general user activity.
- **Trigger**: POST request.
- **Collection**: `activity_logs`

### 2. Face Event Receiver (`functions/face_event_receiver`)
- **Purpose**: Receives face detection events from Raspberry Pi.
- **Trigger**: POST request with `{ "user_id": "...", "status": "..." }`.
- **Collection**: `attendance_logs`

## 🔒 Security

**IMPORTANT:** API keys are managed via Appwrite Console environment variables.

- `APPWRITE_API_KEY`
- `DATABASE_ID`
- `COLLECTION_ID` (for Activity Logger)

## 📦 Deployment

Deploy individual functions using the Appwrite CLI:

```bash
# Deploy all functions
appwrite deploy function

# Deploy specific function
appwrite deploy function --functionId=[FUNCTION_ID]
```