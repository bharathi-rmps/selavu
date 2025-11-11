# Quick Deploy to Railway

## 📦 Files to Upload

Upload these 3 files from the `server/` folder to Railway:

1. ✅ `server.js` - Main server file
2. ✅ `package.json` - Dependencies
3. ✅ `.gitignore` - Git ignore (optional)

## 🚀 Quick Steps

### 1. Get Firebase Service Account Key

1. Go to: https://console.firebase.google.com/project/expense-tracker-fa4c6/settings/serviceaccounts/adminsdk
2. Click **Generate New Private Key**
3. Download JSON file
4. **Copy entire JSON content** (you'll paste it in Railway)

### 2. Deploy to Railway

1. Go to: https://railway.app/
2. Click **New Project** → **Empty Project**
3. Click **+ New** → **GitHub Repo** (or **Empty Service**)
4. If using GitHub:
   - Connect repo
   - Set **Root Directory**: `server`
5. If using Empty Service:
   - Upload `server.js` and `package.json`
   - Or use Railway CLI

### 3. Set Environment Variable

1. In Railway project → **Variables** tab
2. Click **+ New Variable**
3. Name: `FIREBASE_SERVICE_ACCOUNT_KEY`
4. Value: Paste entire JSON from serviceAccountKey.json
5. Click **Add**

### 4. Get Server URL

1. Railway will auto-deploy
2. Go to **Settings** → **Domains**
3. Copy the URL (e.g., `https://your-app.railway.app`)

### 5. Update Flutter App

1. Open: `lib/config/server_config.dart`
2. Replace: `'https://your-app-name.railway.app'` with your Railway URL
3. Save file

### 6. Test

```bash
# Test health check
curl https://your-app.railway.app/

# Should return: {"status":"ok",...}
```

## ✅ Done!

Your server is now live and ready to send notifications!

