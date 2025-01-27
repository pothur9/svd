import admin from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { tokens, notification } = await request.json();

  try {
    const promises = tokens.map((token: string) => {
      return admin.messaging().send({
        token,
        notification,
      });
    });

    // Await all notifications to be sent
    await Promise.all(promises);

    return NextResponse.json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
