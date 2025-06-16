def handler(request):
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html = f.read()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
            },
            'body': html
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f"Error loading page: {str(e)}"
        }