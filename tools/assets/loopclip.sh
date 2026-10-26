#!/usr/bin/env bash
# Cut a seamless loop from a source clip, the way every panel/card video on this site is made.
#
#   bash tools/assets/loopclip.sh <src.mp4> <start-seconds> <dst.mp4> [duration=9] [crf=26]
#
# Takes duration+1 s from <start>, plays from second 1 and crossfades the last second into the
# first, so the end flows back into the start with no visible jump. 1920 wide, 30 fps, H.264 High,
# yuv420p (needed after xfade), no audio, +faststart. Also writes a poster (<dst>.jpg at 0.5 s).
# -nostdin matters: inside a `while read` loop ffmpeg would otherwise swallow the loop's input.
set -euo pipefail
src=$1; start=$2; dst=$3; D=${4:-9}; crf=${5:-26}
ffmpeg -nostdin -v error -y -ss "$start" -t $((D+1)) -i "$src" -filter_complex \
  "[0:v]scale=1920:-2:flags=lanczos,fps=30,setpts=PTS-STARTPTS,split[a][b];[a]trim=1:$((D+1)),setpts=PTS-STARTPTS[m];[b]trim=0:1,setpts=PTS-STARTPTS[h];[m][h]xfade=transition=fade:duration=1:offset=$((D-1)),format=yuv420p[v]" \
  -map "[v]" -an -c:v libx264 -profile:v high -preset slow -crf "$crf" -movflags +faststart "$dst"
ffmpeg -nostdin -v error -y -ss 0.5 -i "$dst" -frames:v 1 -q:v 3 "${dst%.mp4}.jpg"
echo "$dst  $(du -k "$dst" | cut -f1) KB  $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$dst")s"
