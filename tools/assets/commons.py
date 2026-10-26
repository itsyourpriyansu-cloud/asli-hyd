# Wikimedia Commons: find openly licensed photos and fetch them with their credit.
#
# Search (thumbnails + meta.json + a labelled contact sheet to look at):
#   python -I tools/assets/commons.py search <outDir> <minShortSide> "query one" "query two" ...
#   -> <outDir>/c001.jpg ..., <outDir>/meta.json, <outDir>/grid.jpg
#
# Fetch one file at a working size and print its credit as JSON (paste into assets/img/SOURCES.md):
#   python -I tools/assets/commons.py get "File:Some photo.jpg" <dst.jpg> [width=2400]
#
# Only licences without NC/ND are kept (CC0, PD, CC BY, CC BY-SA). CC BY / BY-SA need a visible credit
# on the site, so always record the JSON this prints. Set COMMONS_UA to include your contact details
# (Wikimedia asks API clients to identify themselves).
import sys, os, json, re, html, time, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding='utf-8')
UA = {'User-Agent': os.environ.get('COMMONS_UA', 'AsliHydSiteBuild/1.0 (local asset script)')}
API = 'https://commons.wikimedia.org/w/api.php?'


def api(params):
    return json.load(urllib.request.urlopen(urllib.request.Request(API + urllib.parse.urlencode(params), headers=UA), timeout=60))


def clean(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', '', s or ''))).strip()


def search(out, minside, queries):
    os.makedirs(out, exist_ok=True)
    meta, n = {}, 0
    for q in queries:
        d = api({'action': 'query', 'generator': 'search', 'gsrsearch': q + ' filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': 20,
                 'prop': 'imageinfo', 'iiprop': 'size|url|extmetadata', 'iiurlwidth': 320, 'format': 'json'})
        pages = sorted((d.get('query', {}).get('pages', {}) or {}).values(), key=lambda p: p.get('index', 0))
        kept = 0
        for p in pages:
            ii = p['imageinfo'][0]
            lic = ii.get('extmetadata', {}).get('LicenseShortName', {}).get('value', '')
            if min(ii['width'], ii['height']) < minside or not lic or 'NC' in lic or 'ND' in lic:
                continue
            if any(m['title'] == p['title'] for m in meta.values()):
                continue
            n += 1; kept += 1
            fn = f'c{n:03d}.jpg'
            open(os.path.join(out, fn), 'wb').write(urllib.request.urlopen(urllib.request.Request(ii['thumburl'], headers=UA), timeout=60).read())
            meta[fn] = {'query': q, 'title': p['title'], 'w': ii['width'], 'h': ii['height'], 'license': lic}
            time.sleep(.2)
        print(f'{q}: {kept}')
    json.dump(meta, open(os.path.join(out, 'meta.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    try:
        from PIL import Image, ImageDraw
        T, C = 220, 8
        files = sorted(meta)
        if files:
            sheet = Image.new('RGB', (T * C, (T + 14) * ((len(files) + C - 1) // C)), 'white')
            draw = ImageDraw.Draw(sheet)
            for i, f in enumerate(files):
                im = Image.open(os.path.join(out, f)).convert('RGB'); im.thumbnail((T, T))
                x, y = (i % C) * T, (i // C) * (T + 14)
                sheet.paste(im, (x, y)); draw.text((x + 3, y + T + 1), f, fill='black')
            sheet.save(os.path.join(out, 'grid.jpg'), quality=80)
            print('contact sheet:', os.path.join(out, 'grid.jpg'))
    except ImportError:
        print('(install Pillow for the contact sheet)')


def get(title, dst, width=2400):
    if not title.startswith('File:'):
        title = 'File:' + title
    d = api({'action': 'query', 'titles': title, 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': width, 'format': 'json'})
    ii = list(d['query']['pages'].values())[0]['imageinfo'][0]
    src = ii['thumburl'] if ii['width'] > width else ii['url']
    os.makedirs(os.path.dirname(os.path.abspath(dst)), exist_ok=True)
    open(dst, 'wb').write(urllib.request.urlopen(urllib.request.Request(src, headers=UA), timeout=120).read())
    m = ii['extmetadata']
    print(json.dumps({'file': os.path.basename(dst), 'title': title[5:], 'page': ii['descriptionurl'], 'artist': clean(m.get('Artist', {}).get('value')),
                      'license': m.get('LicenseShortName', {}).get('value'), 'licenseUrl': m.get('LicenseUrl', {}).get('value', ''),
                      'original': f"{ii['width']}x{ii['height']}"}, ensure_ascii=False))


if __name__ == '__main__':
    if len(sys.argv) >= 5 and sys.argv[1] == 'search':
        search(sys.argv[2], int(sys.argv[3]), sys.argv[4:])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'get':
        get(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 2400)
    else:
        print(__doc__ or 'see the header of this file for usage')
