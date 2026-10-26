import sys, re, json, urllib.request, concurrent.futures as cf
sys.stdout.reconfigure(encoding='utf-8')
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
def page(slug):
    try: return urllib.request.urlopen(urllib.request.Request(f'https://mixkit.co/free-stock-video/{slug}/', headers=UA), timeout=40).read().decode('utf-8','replace')
    except Exception: return ''
def best(vid):
    for q in (2160, 1080):
        try:
            r = urllib.request.urlopen(urllib.request.Request(f'https://assets.mixkit.co/videos/{vid}/{vid}-{q}.mp4', headers=UA, method='HEAD'), timeout=20)
            if r.status == 200: return q
        except Exception: pass
    return None
groups = json.loads(sys.argv[1])
out = {}
for theme, slugs in groups.items():
    cands = {}
    for slug in slugs:
        for full, vid in re.findall(r'href="/free-stock-video/([a-z0-9-]+-(\d+))/"', page(slug)):
            cands.setdefault(vid, full.rsplit('-',1)[0].replace('-',' '))
    with cf.ThreadPoolExecutor(12) as ex:
        res = dict(zip(cands, ex.map(best, cands)))
    hd = [(v, cands[v], res[v]) for v in cands if res[v]]
    print(f'== {theme}: {len(hd)} HD of {len(cands)}')
    for v, t, q in hd: print(f'  {v} {q} | {t}')
