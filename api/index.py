def handler(request):
    with open('index.html', 'r') as file:
        html = file.read()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'text/html'},
        'body': html
    }