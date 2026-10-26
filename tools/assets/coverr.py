# Coverr (free licence: commercial use OK, no attribution needed, no AI training / competing stock service).
# Lists free clips for search terms and checks which renditions really exist.
#
#   python -I tools/assets/coverr.py "india" "chai" "night market"
#   -> per term: <best rendition> | <clip id>     e.g.  1080p | coverr-making-chai-tea-in-india-8095
#
# Download:  https://cdn.coverr.co/videos/<clip id>/<1080p|720p|360p>.mp4   (curl -L; the CDN redirects)
# Preview fast with the 360p file before pulling 1080p. Skip ids containing "premium" (paid) or "temp"
# / "ai-generat" (uploads / AI clips). Pexels and Pixabay block scripted access (403), Coverr does not.
import sys, re, urllib.request, urllib.parse, urllib.error, concurrent.futures as cf
sys.stdout.reconfigure(encoding='utf-8')
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}


def page(q):
    try:
        return urllib.request.urlopen(urllib.request.Request('https://coverr.co/s?q=' + urllib.parse.quote(q), headers=UA), timeout=60).read().decode('utf-8', 'replace')
    except Exception:
        return ''


def exists(clip, q):
    # A ranged GET: the real file answers 206 with video/mp4, a missing one 404s after the redirect.
    req = urllib.request.Request(f'https://cdn.coverr.co/videos/{clip}/{q}.mp4', headers={**UA, 'Range': 'bytes=0-1'})
    try:
        r = urllib.request.urlopen(req, timeout=30)
        return r.status in (200, 206) and 'video' in (r.headers.get('Content-Type') or '')
    except urllib.error.HTTPError:
        return False
    except Exception:
        return False


def best(clip):
    for q in ('2160p', '1080p', '720p'):
        if exists(clip, q):
            return q
    return None


seen = set()
for term in sys.argv[1:]:
    clips = []
    for c in re.findall(r'https://cdn\.coverr\.co/videos/(coverr-[a-z0-9-]+)/360p\.mp4', page(term)):
        if c not in clips and c not in seen and 'premium' not in c and '-temp-' not in c and 'ai-generat' not in c:
            clips.append(c)
    with cf.ThreadPoolExecutor(10) as ex:
        res = dict(zip(clips, ex.map(best, clips)))
    print(f'== {term} ({len(clips)})')
    for c in clips:
        seen.add(c)
        print(f'  {res[c] or "-":6} | {c}')
