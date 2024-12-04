import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import l1cal from '@/models/l1cal';
import l2User from '@/models/l2';  // Ensure your user model is imported
import admin from 'firebase-admin';
import FIREBASE_SERVICE_ACCOUNT from '../../../../config/serviceAccountKey.json';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
  });
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { date, title, description, username } = await request.json();
    if (!date || !title || !description || !username) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Save the event
    const newEvent = new l1cal({ date, title, description, username });
    await newEvent.save();

    // Fetch users with matching peeta value
    const users = await l2User.find({ peeta: username }).select('fcmToken');

    // Send notifications to matching users
    const tokens = users.map((user: any) => user.fcmToken).filter((token: string) => token);

    if (tokens.length > 0) {
      const promises = tokens.map((token) => {
        const message = {
          notification: {
            title: `New Event: ${title}`,
            body: description,
          },
          token,  // Send to individual token
        };
        return admin.messaging().send(message);  // Send notification to each token
      });

      // Await all send requests
      await Promise.all(promises);
    }

    return NextResponse.json({ message: 'Event added and notifications sent successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding event or sending notifications:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
