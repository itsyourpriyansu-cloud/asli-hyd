"""
Generates every placeholder image and video used by index.html.

Each file is written to the exact path the page references, so replacing a
placeholder is just dropping a real file in with the same name.

    python tools/make_placeholders.py            # all assets
    python tools/make_placeholders.py --no-video # images only

Requires Pillow; videos also need ffmpeg on PATH.
"""
import math
import os
import random
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
VID = os.path.join(ROOT, "assets", "video")
LABELS = True  # small file-name tag in the corner of each image

# Colourways: background, two petal tones, leaf, thread highlight.
WAYS = {
    "saffron":  ("#efe6d6", "#e2a54b", "#f3d9a4", "#6f7f52", "#fff6e3"),
    "moss":     ("#e4e6d8", "#8c9a5b", "#d9c27a", "#4f5e3b", "#f6f3e4"),
    "amber":    ("#ead9c6", "#c7743a", "#e9b67b", "#5c6b48", "#fff1df"),
    "cobalt":   ("#1f2d4a", "#3b5fa8", "#e7c66b", "#5d7d6a", "#f2e8cf"),
    "coral":    ("#f1ddd3", "#d9684f", "#f2b19b", "#6b7d5a", "#fff0e8"),
    "rose":     ("#efdfdc", "#c9798a", "#a9c29a", "#5a7752", "#fff3f1"),
    "sage":     ("#dfe4dc", "#8ea596", "#c9cfc8", "#53675c", "#f7f8f3"),
    "ochre":    ("#ece2c8", "#c49a35", "#e6d08e", "#6d6b3f", "#fff8e0"),
    "lavender": ("#e3e0ec", "#8f88bd", "#cfc6e6", "#5f7266", "#f7f4ff"),
    "blush":    ("#f2e3df", "#d39a8e", "#d8b56a", "#6e7a5c", "#fff6ef"),
    "petal":    ("#f4e1e4", "#e08ea0", "#f6c2cc", "#6f8a66", "#fff5f7"),
    "jade":     ("#d9e8e1", "#5d9c86", "#b9dccd", "#3f5e52", "#f2fbf7"),
    "ink":      ("#2e3937", "#56706a", "#c9a96e", "#7d8f7a", "#efe6d6"),
    "cream":    ("#f4eee4", "#d7b98c", "#e9d6bd", "#7c8b72", "#ffffff"),
    "dusk":     ("#3a3440", "#a3667a", "#d9a46b", "#6f7d68", "#f3e6d9"),
}


def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(w, h, c1, c2, angle=90):
    """Linear gradient from c1 to c2; angle in degrees (90 = top to bottom)."""
    # Rotate an oversized gradient and keep only the centre so no empty corners show.
    base = Image.linear_gradient("L").resize((768, 768), Image.BICUBIC)
    base = base.rotate(-(angle - 90), resample=Image.BICUBIC).crop((192, 192, 576, 576))
    mask = base.resize((w, h), Image.BICUBIC)
    return Image.composite(Image.new("RGB", (w, h), c2), Image.new("RGB", (w, h), c1), mask)


def grain(img, amount=10):
    noise = Image.effect_noise(img.size, 40).convert("RGB")
    return Image.blend(img, noise, amount / 255)


def ellipse_pts(cx, cy, rx, ry, rot, n=36):
    c, s = math.cos(rot), math.sin(rot)
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        x, y = rx * math.cos(t), ry * math.sin(t)
        pts.append((cx + x * c - y * s, cy + x * s + y * c))
    return pts


def stitch(draw, pts, fill, width, closed=True, dash=2):
    seq = pts + ([pts[0]] if closed else [])
    for i in range(0, len(seq) - 1, dash):
        draw.line([seq[i], seq[i + 1]], fill=fill, width=width)


def flower(draw, cx, cy, r, way, rng):
    bg, p1, p2, leaf, hi = (hex2rgb(c) for c in way)
    petals = rng.choice([5, 6, 7, 8])
    rot0 = rng.random() * math.pi
    sw = max(1, int(r / 22))
    for i in range(petals):
        a = rot0 + 2 * math.pi * i / petals
        px, py = cx + math.cos(a) * r * 0.55, cy + math.sin(a) * r * 0.55
        pts = ellipse_pts(px, py, r * 0.55, r * 0.28, a)
        draw.polygon(pts, fill=mix(p1, p2, rng.random() * 0.6))
        stitch(draw, pts, hi, sw)
        # inner thread lines on each petal
        for k in (0.35, 0.7):
            x0, y0 = cx + math.cos(a) * r * 0.2, cy + math.sin(a) * r * 0.2
            x1 = cx + math.cos(a) * r * (0.6 + k * 0.4)
            y1 = cy + math.sin(a) * r * (0.6 + k * 0.4)
            draw.line([(x0, y0), (x1, y1)], fill=mix(p1, hi, 0.5), width=sw)
    core = r * 0.22
    draw.ellipse([cx - core, cy - core, cx + core, cy + core], fill=mix(p2, hi, 0.3))
    for i in range(14):
        a = 2 * math.pi * i / 14
        d = core * 0.65
        dot = max(1.5, core * 0.12)
        draw.ellipse([cx + math.cos(a) * d - dot, cy + math.sin(a) * d - dot,
                      cx + math.cos(a) * d + dot, cy + math.sin(a) * d + dot], fill=mix(p1, bg, 0.2))


def leaf(draw, cx, cy, r, way, rng):
    leafc, hi = hex2rgb(way[3]), hex2rgb(way[4])
    a = rng.random() * 2 * math.pi
    pts = ellipse_pts(cx, cy, r, r * 0.33, a)
    draw.polygon(pts, fill=mix(leafc, hex2rgb(way[0]), rng.random() * 0.25))
    sw = max(1, int(r / 18))
    draw.line([(cx - math.cos(a) * r, cy - math.sin(a) * r), (cx + math.cos(a) * r, cy + math.sin(a) * r)],
              fill=mix(leafc, hi, 0.45), width=sw)


def vine(draw, w, h, way, rng):
    leafc = hex2rgb(way[3])
    x, y = rng.random() * w, rng.random() * h
    a = rng.random() * 2 * math.pi
    pts = [(x, y)]
    for _ in range(60):
        a += (rng.random() - 0.5) * 0.5
        x += math.cos(a) * w * 0.012
        y += math.sin(a) * w * 0.012
        pts.append((x, y))
    stitch(draw, pts, leafc, max(1, int(w / 500)), closed=False)


def pattern_layer(w, h, way, rng, density=1.0, scale=1.0, transparent_bg=True):
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    unit = min(w, h) * 0.11 * scale
    for _ in range(int(14 * density)):
        vine(d, w, h, way, rng)
    for _ in range(int(26 * density)):
        leaf(d, rng.random() * w, rng.random() * h, unit * (0.35 + rng.random() * 0.4), way, rng)
    for _ in range(int(16 * density)):
        flower(d, rng.random() * w, rng.random() * h, unit * (0.6 + rng.random() * 0.8), way, rng)
    return layer


def label(img, text):
    if not LABELS:
        return img
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", max(11, img.width // 90))
    except OSError:
        font = ImageFont.load_default()
    tw = d.textlength(text, font=font)
    pad = max(6, img.width // 160)
    x, y = img.width - tw - pad * 2, img.height - pad * 2 - font.size
    d.text((x, y), text, fill=(255, 255, 255), font=font, stroke_width=1, stroke_fill=(0, 0, 0))
    return img


def scene(w, h, way, seed, kind="editorial"):
    """Soft, layered embroidery composition used for big editorial images."""
    rng = random.Random(seed)
    bg = hex2rgb(way[0])
    img = gradient(w, h, mix(bg, (255, 255, 255), 0.18), mix(bg, (0, 0, 0), 0.22), angle=70 + rng.random() * 40)
    far = pattern_layer(w, h, way, rng, density=0.8, scale=1.6).filter(ImageFilter.GaussianBlur(w / 90))
    img.paste(far, (0, 0), far)
    if kind == "editorial":
        mid = pattern_layer(w, h, way, rng, density=0.45, scale=1.1).filter(ImageFilter.GaussianBlur(w / 400))
        img.paste(mid, (0, 0), mid)
    # vignette
    vig = Image.new("L", (w, h), 0)
    ImageDraw.Draw(vig).ellipse([-w * 0.25, -h * 0.25, w * 1.25, h * 1.25], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(w / 8))
    img = Image.composite(img, Image.new("RGB", (w, h), mix(bg, (0, 0, 0), 0.45)), vig)
    return grain(img, 9)


def bag_mask(w, h, cx, cy, bw, bh):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2], radius=bh * 0.18, fill=255)
    return m


def bag(w, h, way, seed, bg_hex="#f0eee9", turn=1.0, back=False, size=1.0, cy_frac=0.56, strap=0.85, noise=6):
    """Studio shot of an embroidered bag. `turn` squeezes width to fake rotation."""
    rng = random.Random(seed)
    bgc = hex2rgb(bg_hex)
    img = gradient(w, h, mix(bgc, (255, 255, 255), 0.25), mix(bgc, (0, 0, 0), 0.06), 90)
    cx, cy = w / 2, h * cy_frac
    bw0 = min(w * 0.62, h * 0.62 * 1.25) * size
    bh = bw0 * 0.72
    bw = max(bw0 * abs(turn), bw0 * 0.1)
    # chain strap
    d = ImageDraw.Draw(img)
    chain = mix(hex2rgb("#c9a96e"), (255, 255, 255), 0.1)
    for i in range(48):
        t = math.pi * i / 47
        x = cx + math.cos(t) * bw * 0.42
        y = cy - bh / 2 - math.sin(t) * bh * strap
        d.ellipse([x - bh * 0.018, y - bh * 0.012, x + bh * 0.018, y + bh * 0.012], outline=chain, width=2)
    # shadow
    sh = Image.new("L", (w, h), 0)
    ImageDraw.Draw(sh).ellipse([cx - bw * 0.55, cy + bh * 0.42, cx + bw * 0.55, cy + bh * 0.6], fill=90)
    sh = sh.filter(ImageFilter.GaussianBlur(h / 40))
    img = Image.composite(Image.new("RGB", (w, h), mix(bgc, (0, 0, 0), 0.35)), img, sh)
    # body
    base = hex2rgb(way[0])
    body = gradient(w, h, mix(base, (255, 255, 255), 0.12), mix(base, (0, 0, 0), 0.12), 100)
    if not back:
        pat = pattern_layer(w, h, way, random.Random(seed * 7 + 1), density=2.2, scale=0.38)
        if abs(turn) < 0.999:
            pat = pat.resize((max(1, int(w * abs(turn))), h)).crop((0, 0, max(1, int(w * abs(turn))), h))
            canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
            canvas.paste(pat, (int(cx - w * abs(turn) / 2), 0))
            pat = canvas
        body.paste(pat, (0, 0), pat)
    shade = gradient(w, h, (255, 255, 255), (0, 0, 0), 0).convert("L")
    body = Image.blend(body, Image.composite(body, Image.new("RGB", (w, h), (0, 0, 0)), shade), 0.18 * (1 - abs(turn)) + 0.06)
    img = Image.composite(body, img, bag_mask(w, h, cx, cy, bw, bh))
    # flap seam + clasp
    d = ImageDraw.Draw(img)
    seam = hex2rgb(way[4])
    stitch(d, [(cx - bw / 2 + bh * 0.08 + i * (bw - bh * 0.16) / 40, cy - bh * 0.12) for i in range(41)], seam, 2, closed=False)
    cl = bh * 0.07
    d.ellipse([cx - cl * abs(turn), cy - bh * 0.12 - cl, cx + cl * abs(turn), cy - bh * 0.12 + cl], fill=hex2rgb("#c9a96e"))
    return grain(img, noise) if noise else img


def detail(w, h, way, seed):
    rng = random.Random(seed)
    img = Image.new("RGB", (w, h), hex2rgb(way[0]))
    pat = pattern_layer(w, h, way, rng, density=1.4, scale=1.5)
    img.paste(pat, (0, 0), pat)
    return grain(img, 8)


def save(img, rel, q=82):
    path = os.path.join(IMG, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    label(img, f"{rel}  {img.width}×{img.height}")
    img.save(path, "JPEG", quality=q, optimize=True, progressive=True)
    return path


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def drift_video(src, out, w, h, seconds=8, fps=25):
    """Seamless slow push-in/out loop from a still."""
    frames = seconds * fps
    vf = (f"scale={w * 3}:-2,zoompan=z='1.05+0.04*sin(2*PI*on/{frames})':"
          f"x='iw/2-(iw/zoom/2)+sin(2*PI*on/{frames})*iw*0.01':y='ih/2-(ih/zoom/2)':"
          f"d={frames}:s={w}x{h}:fps={fps},format=yuv420p")
    ffmpeg("-loop", "1", "-i", src, "-vf", vf, "-frames:v", str(frames), "-c:v", "libx264",
           "-preset", "slow", "-crf", "28", "-movflags", "+faststart", "-an", out)


def spin_video(way, seed, out, w=1280, h=720, frames=72, fps=24):
    """A bag turning a full revolution, so drag-scrubbing reads as rotation."""
    tmp = tempfile.mkdtemp()
    try:
        for i in range(frames):
            t = math.cos(2 * math.pi * i / frames)
            # No grain here: per-frame noise turns into blotches once compressed.
            frame = bag(w, h, way, seed, bg_hex="#d9d7d6", turn=t, back=t < 0,
                        size=0.72, cy_frac=0.62, strap=0.6, noise=0)
            frame.save(os.path.join(tmp, f"{i:03d}.png"))
        ffmpeg("-framerate", str(fps), "-i", os.path.join(tmp, "%03d.png"), "-c:v", "libx264",
               "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-g", "6",
               "-movflags", "+faststart", "-an", out)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


SPIN_WAYS = ["moss", "amber", "saffron", "cobalt", "jade", "ochre"]


def main():
    videos = "--no-video" not in sys.argv and shutil.which("ffmpeg")
    os.makedirs(IMG, exist_ok=True)
    os.makedirs(VID, exist_ok=True)

    if "--spinner-only" in sys.argv:
        for i, wname in enumerate(SPIN_WAYS, 1):
            spin_video(WAYS[wname], 800 + i, os.path.join(VID, f"spinner-{i}.mp4"))
        print("Spinner videos done.")
        return

    hero = save(scene(1920, 1080, WAYS["ink"], 1), "hero.jpg")

    save(bag(1200, 1600, WAYS["saffron"], 11, bg_hex="#d8cfc0"), "category-handbags.jpg")
    save(bag(1200, 1400, WAYS["rose"], 12, bg_hex="#efe6dc"), "category-small-goods.jpg")

    a_ways = ["saffron", "moss", "amber", "cobalt", "coral", "rose"]
    b_ways = ["sage", "ochre", "lavender", "blush", "petal", "jade"]
    for prefix, ways, base in (("collection-a", a_ways, 100), ("collection-b", b_ways, 200)):
        for i, wname in enumerate(ways, 1):
            save(bag(720, 840, WAYS[wname], base + i), f"{prefix}/product-{i}.jpg")
            save(detail(720, 840, WAYS[wname], base + i), f"{prefix}/product-{i}-detail.jpg")
        for i in range(1, 6):
            save(scene(900, 1400, WAYS[ways[i - 1]], base + 50 + i), f"{prefix}/promo-{i}.jpg")

    for i, wname in enumerate(["dusk", "amber", "cobalt", "moss"], 1):
        save(scene(1920, 1280, WAYS[wname], 300 + i), f"commission-{i}.jpg")

    save(scene(2400, 1350, WAYS["ink"], 401), "collector.jpg")
    save(scene(1200, 1800, WAYS["cream"], 402), "city.jpg")
    save(scene(2400, 1350, WAYS["jade"], 403), "materials.jpg")
    save(scene(1920, 1440, WAYS["dusk"], 404), "heritage.jpg")

    world_paths = []
    for i, wname in enumerate(["coral", "jade", "ochre"], 1):
        world_paths.append(save(scene(900, 1350, WAYS[wname], 500 + i), f"world-{i}.jpg"))

    social = ["saffron", "cobalt", "rose", "moss", "lavender", "amber", "petal", "sage", "coral", "jade"]
    for i, wname in enumerate(social, 1):
        img = bag(900, 1350, WAYS[wname], 600 + i, bg_hex="#e9e2d6") if i % 2 else scene(900, 1350, WAYS[wname], 600 + i)
        save(img, f"social-{i}.jpg")

    for i, wname in enumerate(SPIN_WAYS, 1):
        save(detail(240, 240, WAYS[wname], 700 + i).filter(ImageFilter.GaussianBlur(0.4)), f"swatch-{i}.jpg")

    if not videos:
        print("Images done (videos skipped).")
        return

    drift_video(hero, os.path.join(VID, "hero.mp4"), 1920, 1080, seconds=10)
    drift_video(os.path.join(IMG, "collection-a", "promo-1.jpg"), os.path.join(VID, "collection-a.mp4"), 720, 1120)
    drift_video(os.path.join(IMG, "collection-b", "promo-1.jpg"), os.path.join(VID, "collection-b.mp4"), 720, 1120)
    for i, p in enumerate(world_paths, 1):
        drift_video(p, os.path.join(VID, f"world-{i}.mp4"), 720, 1080)
    for i, wname in enumerate(SPIN_WAYS, 1):
        spin_video(WAYS[wname], 800 + i, os.path.join(VID, f"spinner-{i}.mp4"))
    print("Images and videos done.")


if __name__ == "__main__":
    main()
