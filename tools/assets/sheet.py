import sys,os,glob
from PIL import Image,ImageDraw
d=sys.argv[1]; pref=sys.argv[2:]; 
for p in pref:
    fs=sorted(glob.glob(os.path.join(d,p+'*.jpg')))
    if not fs: continue
    T=260; sheet=Image.new('RGB',(T*len(fs),T+18),'white'); dr=ImageDraw.Draw(sheet)
    for i,f in enumerate(fs):
        im=Image.open(f).convert('RGB'); im.thumbnail((T,T)); sheet.paste(im,(i*T,0)); dr.text((i*T+4,T+3),os.path.basename(f),fill='black')
    sheet.save(os.path.join(d,'..','sheet_'+p+'.jpg'),quality=80)
