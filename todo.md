# Panopticon — TODO

## `coffee_event_receiver` — Appwrite Setup

### 1. Create Collection: `coffee_logs`

Set this collection's ID as the `COLLECTION_ID` env var on the function.

| Attribute | Type          | Required | Notes                                                    |
|-----------|---------------|----------|----------------------------------------------------------|
| `event`   | String (32)   | ✅ Yes   | `coffee_detected`, `coffee_drinking`, or `coffee_done`   |
| `timestamp` | Integer     | ✅ Yes   | Unix epoch seconds                                       |
| `day`     | DateTime      | No       | ISO 8601 string, e.g. `2026-04-27T21:00:00+00:00`       |
| `weight`  | Float         | No       | Grams, e.g. `280.5`                                      |
| `users`   | Relationship  | No       | Many-to-One → `users` collection, Two-way, On Delete: Set Null |

### 2. Add Index

For efficient queries (coffees per day per user):

| Index Name    | Type | Attributes    |
|---------------|------|---------------|
| `idx_user_day` | Key | `users`, `day` |

### 3. Set Function Environment Variables

In the Appwrite Console, set these on the `coffee_event_receiver` function:

| Variable                          | Value                                    |
|-----------------------------------|------------------------------------------|
| `APPWRITE_FUNCTION_API_ENDPOINT`  | e.g. `https://cloud.appwrite.io/v1`      |
| `APPWRITE_FUNCTION_PROJECT_ID`    | Your project ID                          |
| `APPWRITE_API_KEY`                | API key with `databases.write` scope     |
| `DATABASE_ID`                     | Your database ID                         |
| `COLLECTION_ID`                   | ID of the `coffee_logs` collection       |

### 4. API Surface

The function uses a single Appwrite API call:

```
POST /databases/{databaseId}/collections/{collectionId}/documents
```

### 5. Deploy

```bash
appwrite deploy function --functionId coffee_event_receiver
```
