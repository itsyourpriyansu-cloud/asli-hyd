# Cover-crop a photo to 720x840 (card ratio) around a focal point, JPEG q80.
import sys, os
from PIL import Image, ImageOps
src, dst, fx, fy = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
W, H = 720, 840
im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
w, h = im.size
r = W / H
if w / h > r: cw, ch = int(h * r), h
else: cw, ch = w, int(w / r)
x = min(max(int(fx * w - cw / 2), 0), w - cw); y = min(max(int(fy * h - ch / 2), 0), h - ch)
im = im.crop((x, y, x + cw, y + ch)).resize((W, H), Image.LANCZOS)
im.save(dst, quality=80, optimize=True, progressive=True)
print(os.path.basename(dst), f'from {w}x{h}', os.path.getsize(dst)//1024, 'KB')
