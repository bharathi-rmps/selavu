const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
// Service account key will be provided via environment variable
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
} else {
  console.error('❌ FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
  process.exit(1);
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FCM Notification Server is running',
    timestamp: new Date().toISOString()
  });
});

// Send FCM notification endpoint
app.post('/send-notification', async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    // Validate required fields
    if (!token || !title || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: token, title, body'
      });
    }

    console.log('📤 Sending notification:', { token: token.substring(0, 20) + '...', title, body });

    // Prepare FCM message
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        // Convert all data values to strings (FCM requirement)
        ...Object.keys(data || {}).reduce((acc, key) => {
          acc[key] = String(data[key]);
          return acc;
        }, {}),
      },
      token: token,
      android: {
        priority: 'high',
        notification: {
          channelId: 'high_importance_channel',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    // Send notification using FCM HTTP v1 API
    const response = await admin.messaging().send(message);
    
    console.log('✅ Notification sent successfully:', response);

    return res.json({
      success: true,
      messageId: response,
    });
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    
    // Handle invalid token
    if (error.code === 'messaging/invalid-registration-token' || 
        error.code === 'messaging/registration-token-not-registered') {
      console.log('⚠️ Invalid token detected');
      return res.status(400).json({
        success: false,
        error: 'Invalid registration token',
        code: error.code
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send notification',
      code: error.code
    });
  }
});

// Send group invitation notification (convenience endpoint)
app.post('/send-group-invitation', async (req, res) => {
  try {
    const { toUserId, fromUserDisplayName, groupName, groupId, requestId, fcmToken } = req.body;

    if (!fcmToken || !toUserId || !fromUserDisplayName || !groupName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const title = 'Group Invitation';
    const body = `${fromUserDisplayName} invited you to join "${groupName}"`;

    const data = {
      type: 'group_invitation',
      screen: 'requests',
      groupId: groupId || '',
      groupName: groupName,
      requestId: requestId || '',
      fromUserDisplayName: fromUserDisplayName,
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
    };

    // Use the main send-notification endpoint logic
    const message = {
      notification: { title, body },
      data: Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {}),
      token: fcmToken,
      android: {
        priority: 'high',
        notification: {
          channelId: 'high_importance_channel',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Group invitation notification sent:', response);

    return res.json({
      success: true,
      messageId: response,
    });
  } catch (error) {
    console.error('❌ Error sending group invitation:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send notification',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FCM Notification Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/`);
  console.log(`📤 Send notification: POST http://localhost:${PORT}/send-notification`);
});

