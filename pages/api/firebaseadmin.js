import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Initialize Firebase Admin SDK if it's not already initialized
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Use your credentials here
    databaseURL: process.env.FIREBASE_DATABASE_URL, // optional, if using Realtime Database
  });
} else {
  admin.app(); // If already initialized, use existing instance
}

export default async function handler(req, res) {
  try {
    // Example of getting a list of users from Firebase Authentication
    const users = [];
    
    // Fetch users with pagination (max 1000 users per request)
    const listUsersResult = await admin.auth().listUsers(1000); // Adjust number as needed

    // Extract users into a simple array
    listUsersResult.users.forEach(userRecord => {
      users.push(userRecord.toJSON());
    });

    // Return users as a response
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
