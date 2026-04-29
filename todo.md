# Panopticon — TODO

## `coffee_event_receiver` — Appwrite Setup

### ✅ Done
- [x] `functions/coffee_event_receiver/src/main.js` — function written
- [x] `functions/coffee_event_receiver/package.json` — package config
- [x] `appwrite.json` — function registered
- [x] `scripts/setup_coffee_logs.mjs` — provisioning script written

---

### ⏳ Remaining: Run the Setup Script

The script creates the `coffee_logs` collection, all attributes, and the index automatically.

```powershell
# From the project root — fill in your real values
$env:APPWRITE_ENDPOINT    = "https://cloud.appwrite.io/v1"
$env:APPWRITE_PROJECT_ID  = "your_project_id"
$env:APPWRITE_API_KEY     = "your_api_key"
$env:DATABASE_ID          = "your_database_id"
$env:COLLECTION_ID        = "coffee_logs"

node scripts/setup_coffee_logs.mjs
```

> API key needs `databases.write` + `databases.read` scope.

---

### ⏳ Remaining: Set Env Vars on the Function

In **Appwrite Console → Functions → coffee_event_receiver → Settings → Environment Variables**:

| Variable                          | Value                                      |
|-----------------------------------|--------------------------------------------|
| `APPWRITE_FUNCTION_API_ENDPOINT`  | e.g. `https://cloud.appwrite.io/v1`        |
| `APPWRITE_FUNCTION_PROJECT_ID`    | Your project ID                            |
| `APPWRITE_API_KEY`                | API key with `databases.write` scope       |
| `DATABASE_ID`                     | Your database ID                           |
| `COLLECTION_ID`                   | `coffee_logs`                              |

---

### ⏳ Remaining: Deploy the Function

```powershell
appwrite deploy function --functionId coffee_event_receiver
```

---

### Reference — Collection Schema

| Attribute   | Type         | Required | Notes                                                  |
|-------------|--------------|----------|--------------------------------------------------------|
| `event`     | String (32)  | ✅ Yes   | `coffee_detected`, `coffee_drinking`, `coffee_done`    |
| `timestamp` | Integer      | ✅ Yes   | Unix epoch seconds                                     |
| `day`       | String (64)  | No       | ISO 8601, e.g. `2026-04-27T21:00:00+00:00`            |
| `weight`    | Float        | No       | Grams, e.g. `280.5`                                    |
| `users`     | Relationship | No       | Many-to-One → `users`, Two-way, On Delete: Set Null    |

**Index:** `idx_user_day` — Key on `[users, day]`

**API surface:** single call — `POST /databases/{db}/collections/{col}/documents`
