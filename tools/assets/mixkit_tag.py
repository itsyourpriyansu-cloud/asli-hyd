import sys, re, urllib.request, html
sys.stdout.reconfigure(encoding='utf-8')
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
for slug in sys.argv[1:]:
    try:
        s = urllib.request.urlopen(urllib.request.Request(f'https://mixkit.co/free-stock-video/{slug}/', headers=UA), timeout=40).read().decode('utf-8', 'replace')
    except Exception as e:
        print('==', slug, 'ERR', e); continue
    items = re.findall(r'<a[^>]+href="/free-stock-video/([a-z0-9-]+-(\d+))/"[^>]*>', s)
    seen = []
    for full, vid in items:
        if vid not in [v for v, _ in seen]: seen.append((vid, full))
    print(f'== {slug} ({len(seen)})')
    for vid, full in seen[:24]:
        print(f'  {vid} | {full.rsplit("-",1)[0].replace("-"," ")}')
