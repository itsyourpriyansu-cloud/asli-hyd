# Colourise a monochrome print with Zhang et al.'s colourisation model (OpenCV DNN),
# cropped/sized exactly like the sepia art file so the WebGL reveal lines up.
# usage: colorize.py <src> <model_dir> <dst> <trim l,t,r,b> <W> <H> [chroma]
import sys, os
import numpy as np
import cv2

src, mdir, dst, trim, W, H = sys.argv[1:7]
chroma = float(sys.argv[7]) if len(sys.argv) > 7 else 1.35
W, H = int(W), int(H)
l, t, r, b = [float(x) for x in trim.split(',')]

img = cv2.imread(src, cv2.IMREAD_COLOR)
h, w = img.shape[:2]
img = img[int(h * t):int(h * (1 - b)), int(w * l):int(w * (1 - r))]
img = cv2.resize(img, (W, H), interpolation=cv2.INTER_AREA)

# Drop the sepia cast: work from luminance only.
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gray = cv2.createCLAHE(clipLimit=1.6, tileGridSize=(8, 8)).apply(gray)
rgb = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR).astype(np.float32) / 255.0
lab = cv2.cvtColor(rgb, cv2.COLOR_BGR2LAB)
L = lab[:, :, 0]

net = cv2.dnn.readNetFromCaffe(os.path.join(mdir, 'colorization_deploy_v2.prototxt'),
                               os.path.join(mdir, 'colorization_release_v2.caffemodel'))
pts = np.load(os.path.join(mdir, 'pts_in_hull.npy')).transpose().reshape(2, 313, 1, 1)
net.getLayer(net.getLayerId('class8_ab')).blobs = [pts.astype(np.float32)]
net.getLayer(net.getLayerId('conv8_313_rh')).blobs = [np.full([1, 313], 2.606, dtype=np.float32)]

small = cv2.resize(rgb, (224, 224))
Ls = cv2.cvtColor(small, cv2.COLOR_BGR2LAB)[:, :, 0] - 50
net.setInput(cv2.dnn.blobFromImage(Ls))
ab = net.forward()[0].transpose((1, 2, 0))
ab = cv2.resize(ab, (W, H), interpolation=cv2.INTER_CUBIC)
ab = cv2.GaussianBlur(ab, (0, 0), 2.0)
ab *= chroma                                   # the model is conservative; lift colour
mode = sys.argv[8] if len(sys.argv) > 8 else 'street'

# Local texture (std of L): sky is smooth, carved stone is busy.
mean = cv2.blur(L, (11, 11)); sq = cv2.blur(L * L, (11, 11))
tex = np.sqrt(np.maximum(sq - mean * mean, 0))
tex = cv2.GaussianBlur(tex, (0, 0), 3)

if mode == 'street':
    # Sky blue leaking onto minarets/domes: on textured pixels, turn blue (b<0) into warm limestone.
    blue = np.clip(-ab[:, :, 1] / 8.0, 0, 1)
    busy = np.clip((tex - 1.2) / 2.5, 0, 1)
    # Below the skyline nothing should be sky-blue.
    yy = np.linspace(0, 1, H)[:, None] * np.ones((1, W))
    low = np.clip((yy - .38) / .08, 0, 1)
    # Ignore dust specks on the old print: an opening drops marks smaller than ~15px, then soften the edges.
    busy = cv2.morphologyEx(busy.astype(np.float32), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    busy = cv2.GaussianBlur(busy, (0, 0), 4)
    k = (blue * np.maximum(busy, low))[:, :, None]
    stone = np.zeros_like(ab); stone[:, :, 0] = 4.0; stone[:, :, 1] = 16.0
    ab = ab * (1 - k) + stone * k
else:
    # Palace interior: clean white walls, gold on the carved/gilded detail, crimson velvet in the shadows.
    t = np.clip(L / 100.0, 0, 1)
    dark = np.clip((.42 - t) / .22, 0, 1)                  # curtains, carpet, deep shadow
    light = np.clip((t - .72) / .18, 0, 1)                 # plaster walls, ceiling
    gild = np.clip((tex - 3.0) / 5.0, 0, 1) * (1 - dark) * np.clip((t - .35) / .2, 0, 1)
    a = 34 * dark + 5 * gild - 1.0 * light
    bb = 16 * dark + 34 * gild + (-3.0) * light * (1 - gild)
    ab = np.dstack([a, bb]).astype(np.float32) + ab * .15

out = np.concatenate((L[:, :, None], ab), axis=2).astype(np.float32)
out = cv2.cvtColor(out, cv2.COLOR_LAB2BGR)
out = np.clip(out, 0, 1)
out = (out * 255).astype(np.uint8)
cv2.imwrite(dst, out, [cv2.IMWRITE_JPEG_QUALITY, 82, cv2.IMWRITE_JPEG_PROGRESSIVE, 1, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
print(os.path.basename(dst), out.shape[1], 'x', out.shape[0], os.path.getsize(dst) // 1024, 'KB')
