import urllib.request
import urllib.error

buckets = [
    "artdrop-vault.firebasestorage.app",
    "artdrop-vault.appspot.com",
    "artdrop-vault"
]

for b in buckets:
    url = f"https://firebasestorage.googleapis.com/v0/b/{b}/o"
    try:
        req = urllib.request.urlopen(url)
        print(f"Bucket {b}: HTTP {req.status}")
    except urllib.error.HTTPError as e:
        print(f"Bucket {b}: HTTP {e.code} - {e.read().decode()[:100]}")
    except Exception as e:
        print(f"Bucket {b}: Exception {e}")
