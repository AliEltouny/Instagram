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
        print(f"Error: {str(e)}")  # This will appear in Vercel logs
        return {
            'statusCode': 500,
            'body': "Error loading page"
        }