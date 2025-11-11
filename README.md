# FCM Notification Server

Node.js server for sending FCM push notifications. Deploy this on Railway (or any Node.js hosting service).

## Setup Instructions

### 1. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **expense-tracker-fa4c6**
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file (e.g., `serviceAccountKey.json`)
6. **IMPORTANT**: Keep this file secure! Never commit it to Git.

### 2. Deploy to Railway

#### Option A: Using Railway CLI

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize project:
   ```bash
   cd server
   railway init
   ```

4. Set environment variable:
   ```bash
   # Copy the entire content of serviceAccountKey.json
   railway variables set FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```
   
   Or use Railway dashboard to set the variable.

5. Deploy:
   ```bash
   railway up
   ```

#### Option B: Using Railway Dashboard

1. Go to [Railway.app](https://railway.app/)
2. Click **New Project** → **Deploy from GitHub repo** (or **Empty Project**)
3. If using GitHub:
   - Connect your repository
   - Set root directory to: `server`
4. Add environment variable:
   - Go to **Variables** tab
   - Add variable: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - Value: Copy entire JSON content from `serviceAccountKey.json`
5. Deploy automatically happens on push

### 3. Get Server URL

After deployment, Railway will provide a URL like:
- `https://your-app-name.railway.app`

Save this URL - you'll need it in the Flutter app.

## API Endpoints

### Health Check
```
GET /
```
Returns server status.

### Send Notification
```
POST /send-notification
Content-Type: application/json

{
  "token": "fcm_token_string",
  "title": "Notification Title",
  "body": "Notification Body",
  "data": {
    "type": "group_invitation",
    "screen": "requests",
    "groupId": "...",
    "groupName": "..."
  }
}
```

### Send Group Invitation (Convenience)
```
POST /send-group-invitation
Content-Type: application/json

{
  "fcmToken": "fcm_token_string",
  "toUserId": "user_id",
  "fromUserDisplayName": "John Doe",
  "groupName": "Roommates",
  "groupId": "group123",
  "requestId": "req456"
}
```

## Environment Variables

- `PORT` - Server port (Railway sets this automatically)
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase service account JSON (as string)

## Testing

Test the server locally:

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Set environment variable:
   ```bash
   export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```

3. Run server:
   ```bash
   npm start
   ```

4. Test endpoint:
   ```bash
   curl -X POST http://localhost:3000/send-notification \
     -H "Content-Type: application/json" \
     -d '{
       "token": "your_fcm_token",
       "title": "Test",
       "body": "Test notification"
     }'
   ```

## Security Notes

- ✅ Service account key is stored as environment variable (secure)
- ✅ Server uses CORS for cross-origin requests
- ✅ Input validation on all endpoints
- ⚠️ Consider adding authentication token for production

