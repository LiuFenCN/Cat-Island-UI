import os
from PIL import Image, ImageDraw, ImageFilter
import math, random

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'static')
os.makedirs(OUT, exist_ok=True)

W, H = 480, 180
DUR = 55

def make_star():
    random.seed(7)
    stars = []
    for _ in range(70):
        stars.append((random.randint(0, W), random.randint(0, H), random.choice([1, 1, 1, 2]),
                      random.uniform(0, math.tau), random.uniform(0.5, 2.2)))
    nebula = [(120, 60), (360, 120), (240, 40)]
    colmap = [(138, 43, 226), (65, 105, 225), (155, 60, 255)]
    frames = []
    for f in range(24):
        t = f / 24.0
        img = Image.new('RGB', (W, H), (8, 4, 20))
        layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        off = math.sin(t * math.tau) * 22
        for i, (cx, cy) in enumerate(nebula):
            nx = int(cx + off * math.cos(t * math.tau + i))
            ny = int(cy + math.sin(t * math.tau * 1.3 + i) * 12)
            for rr in (95, 72, 52):
                ld.ellipse([nx - rr, ny - rr, nx + rr, ny + rr], fill=colmap[i] + (38,))
        layer = layer.filter(ImageFilter.GaussianBlur(38))
        img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
        d = ImageDraw.Draw(img)
        for (x, y, r, ph, sp) in stars:
            a = 0.35 + 0.65 * (0.5 + 0.5 * math.sin(ph + t * math.tau * sp))
            c = int(255 * a)
            d.ellipse([x - r, y - r, x + r, y + r], fill=(c, c, min(255, c + 28)))
        frames.append(img)
    p = os.path.join(OUT, 'namecard-star.gif')
    frames[0].save(p, save_all=True, append_images=frames[1:], duration=DUR, loop=0, optimize=True)
    print('star', os.path.getsize(p))

def make_sakura():
    random.seed(11)
    petals = []
    for _ in range(24):
        petals.append([random.randint(0, W), random.randint(-H, H), random.randint(4, 9),
                       random.uniform(0.7, 1.8), random.uniform(10, 30), random.uniform(0, math.tau)])
    frames = []
    for f in range(24):
        t = f / 24.0
        img = Image.new('RGB', (W, H))
        d0 = ImageDraw.Draw(img)
        for yy in range(H):
            k = yy / H
            d0.line([(0, yy), (W, yy)], fill=(255, int(245 - 53 * k), int(247 - 44 * k)))
        d = ImageDraw.Draw(img)
        for p in petals:
            p[1] += p[3]
            if p[1] > H + 12:
                p[1] = -12
                p[0] = random.randint(0, W)
            x = int(p[0] + math.sin(t * math.tau + p[5]) * p[4])
            y = int(p[1])
            r = p[2]
            d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 183, 197))
            d.ellipse([x - int(r * 0.5), y - int(r * 1.2), x + int(r * 0.5), y - int(r * 0.2)], fill=(255, 150, 175))
        frames.append(img)
    p = os.path.join(OUT, 'namecard-sakura.gif')
    frames[0].save(p, save_all=True, append_images=frames[1:], duration=DUR, loop=0, optimize=True)
    print('sakura', os.path.getsize(p))

if __name__ == '__main__':
    make_star()
    make_sakura()
    print('done')
