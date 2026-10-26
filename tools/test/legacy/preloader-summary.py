import json, sys
d = json.load(sys.stdin); runs = {}
for s in d['samples']: runs.setdefault(s['run'], []).append(s)
for r, ss in runs.items():
    pre = [s for s in ss if s['pre']]; post = [s for s in ss if not s['pre']]
    last = post[-1] if post else {}
    print(f"run {r}: loader seen={bool(pre)} | first y={ss[0]['y']} | maxY during loader={max([s['y'] for s in pre], default=None)} | ended by ~{post[0]['ms'] if post else None}ms | loaderGone={not last.get('loader', True)} videoPlaying={not last.get('vPaused', True)} header={last.get('headerOp')}")
print('logs', d['logs'])
