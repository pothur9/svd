import admin from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { tokens, notification } = await request.json();

  try {
    // Send a notification using Firebase Admin
    await admin.messaging().sendMulticast({
      tokens,
      notification, // e.g., { title: 'New Event', body: 'Event details...' }
    });

    return NextResponse.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
