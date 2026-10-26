# Natural colourisation with DDColor (Qualcomm AI Hub ONNX export, Apache-2.0).
# Same crop/size as the sepia art file so the WebGL bubble lines up exactly.
# usage: ddcolor.py <model.onnx> <src> <dst> <trim l,t,r,b> <W> <H> [chroma]
import sys, os
import numpy as np
import cv2
import onnxruntime as ort

model, src, dst, trim, W, H = sys.argv[1:7]
chroma = float(sys.argv[7]) if len(sys.argv) > 7 else 1.0
W, H = int(W), int(H)
l, t, r, b = [float(x) for x in trim.split(',')]

img = cv2.imread(src, cv2.IMREAD_COLOR)
h, w = img.shape[:2]
img = img[int(h * t):int(h * (1 - b)), int(w * l):int(w * (1 - r))]
img = cv2.resize(img, (W, H), interpolation=cv2.INTER_AREA)

# Neutral grey start: drop the sepia cast, gently even out the faded print.
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gray = cv2.createCLAHE(clipLimit=1.4, tileGridSize=(8, 8)).apply(gray)
bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR).astype(np.float32) / 255.0
orig_l = cv2.cvtColor(bgr, cv2.COLOR_BGR2Lab)[:, :, :1]

sess = ort.InferenceSession(model, providers=['CPUExecutionProvider'])
S = sess.get_inputs()[0].shape[2]

def predict(im):
    small = cv2.resize(im, (S, S), interpolation=cv2.INTER_AREA)
    sl = cv2.cvtColor(small, cv2.COLOR_BGR2Lab)[:, :, :1]
    gray_lab = np.concatenate([sl, np.zeros_like(sl), np.zeros_like(sl)], axis=-1)
    gray_rgb = cv2.cvtColor(gray_lab, cv2.COLOR_LAB2RGB)
    x = gray_rgb.transpose(2, 0, 1)[None].astype(np.float32)
    ab = sess.run(None, {sess.get_inputs()[0].name: x})[0][0].transpose(1, 2, 0)
    return ab

# Average the prediction with its mirror for steadier colour.
ab = (predict(bgr) + predict(bgr[:, ::-1].copy())[:, ::-1]) / 2
ab = cv2.resize(ab, (W, H), interpolation=cv2.INTER_CUBIC)

# White balance: the room's walls/ceiling are white, so the average colour of the
# brightest third should be neutral. Remove that cast everywhere (kills the gold tint).
Lc = orig_l[:, :, 0]
bright = Lc > np.percentile(Lc, 66)
ab = ab - np.median(ab[bright], axis=0)

# Highlights stay near-neutral (plaster, crystal, marble); colour lives in the mid/dark tones.
w = np.clip((92 - Lc) / 30.0, 0.25, 1.0)[:, :, None]
ab = ab * w * chroma

# Crystal: fine, high-contrast detail in the mid/bright tones is clear glass, so keep it nearly neutral.
mean = cv2.blur(Lc, (9, 9)); sq = cv2.blur(Lc * Lc, (9, 9))
tex = cv2.GaussianBlur(np.sqrt(np.maximum(sq - mean * mean, 0)), (0, 0), 3)
crystal = np.clip((tex - 6.0) / 6.0, 0, 1) * np.clip((Lc - 40) / 20.0, 0, 1)
ab = ab * (1 - 0.85 * crystal)[:, :, None]
# Painted plaster above mid-grey is white/ivory in the real hall: keep only a faint warm ivory.
plaster = np.clip((Lc - 48) / 14.0, 0, 1)[:, :, None]
ivory = np.zeros_like(ab); ivory[:, :, 0] = 1.0; ivory[:, :, 1] = 5.0
ab = ab * (1 - 0.75 * plaster) + ivory * plaster * 0.75

# Cap chroma so chandelier crystals don't turn into rainbow speckle.
mag = np.linalg.norm(ab, axis=2, keepdims=True)
ab = ab * np.minimum(1.0, 42.0 / np.maximum(mag, 1e-6))
ab = cv2.GaussianBlur(ab, (0, 0), 1.2)

out = np.concatenate([orig_l, ab.astype(np.float32)], axis=-1)
out = np.clip(cv2.cvtColor(out, cv2.COLOR_Lab2BGR), 0, 1)
out = (out * 255).round().astype(np.uint8)
cv2.imwrite(dst, out, [cv2.IMWRITE_JPEG_QUALITY, 82, cv2.IMWRITE_JPEG_PROGRESSIVE, 1, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
hsv = cv2.cvtColor(out, cv2.COLOR_BGR2HSV)
print(os.path.basename(dst), W, 'x', H, os.path.getsize(dst) // 1024, 'KB | mean sat', int(hsv[:, :, 1].mean()), 'hue', int(hsv[:, :, 0].mean()))
