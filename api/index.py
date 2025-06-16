def handler(request):
    try:
        with open('index.html', 'r') as file:
            html = file.read()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache'
            },
            'body': html
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f"Error loading page: {str(e)}"
        }