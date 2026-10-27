import urllib.request

images = [
    'sidhu-moose-wala.jpg',
    'honey-singh-glory.jpg',
    'karan-aujla.jpg',
    'allstar-smile.jpg'
]

for img in images:
    url = f"http://127.0.0.1:8000/images/uploads/{img}"
    try:
        req = urllib.request.urlopen(url)
        print(f"{img}: STATUS {req.status}, Content-Length: {req.headers.get('Content-Length')}")
    except Exception as e:
        print(f"{img}: ERROR {e}")
