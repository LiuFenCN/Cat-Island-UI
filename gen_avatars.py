#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os

OUT = r"F:/缓存/软件缓存/workboddy/2026-07-23-14-54-24/Cat-Island-UI/assets/avatars"

def cat(fur, bg, ear_in="#ff9ab0", blush="#ff9ab0"):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="58" fill="{bg}"/>
  <polygon points="26,46 18,14 48,32" fill="{fur}"/>
  <polygon points="94,46 102,14 72,32" fill="{fur}"/>
  <polygon points="28,42 24,24 42,34" fill="{ear_in}"/>
  <polygon points="92,42 96,24 78,34" fill="{ear_in}"/>
  <circle cx="60" cy="66" r="34" fill="{fur}"/>
  <ellipse cx="40" cy="76" rx="8" ry="5" fill="{blush}" opacity="0.55"/>
  <ellipse cx="80" cy="76" rx="8" ry="5" fill="{blush}" opacity="0.55"/>
  <ellipse cx="47" cy="62" rx="5.5" ry="7.5" fill="#3a2e25"/>
  <ellipse cx="73" cy="62" rx="5.5" ry="7.5" fill="#3a2e25"/>
  <circle cx="49" cy="59" r="2" fill="#fff"/>
  <circle cx="75" cy="59" r="2" fill="#fff"/>
  <polygon points="60,70 56,75 64,75" fill="#e07a8b"/>
  <path d="M54 80 Q60 86 66 80" stroke="#3a2e25" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <g stroke="#b79b86" stroke-width="1.6" stroke-linecap="round" opacity="0.7">
    <line x1="20" y1="68" x2="38" y2="70"/>
    <line x1="20" y1="76" x2="38" y2="76"/>
    <line x1="100" y1="68" x2="82" y2="70"/>
    <line x1="100" y1="76" x2="82" y2="76"/>
  </g>
</svg>'''

def robot(body, bg, accent="#fff"):
    dark = "#1c2733"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="58" fill="{bg}"/>
  <line x1="60" y1="34" x2="60" y2="20" stroke="{body}" stroke-width="3"/>
  <circle cx="60" cy="17" r="5" fill="{accent}"/>
  <rect x="28" y="34" width="64" height="54" rx="16" fill="{body}"/>
  <circle cx="24" cy="61" r="4.5" fill="{body}"/>
  <circle cx="96" cy="61" r="4.5" fill="{body}"/>
  <rect x="40" y="50" width="14" height="16" rx="7" fill="{dark}"/>
  <rect x="66" y="50" width="14" height="16" rx="7" fill="{dark}"/>
  <circle cx="47" cy="56" r="3" fill="{accent}" opacity="0.9"/>
  <circle cx="73" cy="56" r="3" fill="{accent}" opacity="0.9"/>
  <rect x="46" y="76" width="28" height="7" rx="3.5" fill="{dark}"/>
  <line x1="40" y1="88" x2="80" y2="88" stroke="{body}" stroke-width="3" stroke-linecap="round"/>
</svg>'''

# (filename, svg)
specs = [
    # robots (callai / a / b / c)
    ("avatar-callai.svg", robot("#18c2b3", "#d6f4f0", "#fff")),
    ("avatar-a.svg",      robot("#ffb454", "#fff0d6", "#fff")),
    ("avatar-b.svg",      robot("#6cc6ef", "#d9eefb", "#fff")),
    ("avatar-c.svg",      robot("#b08bf8", "#ece2fb", "#fff")),
    # cats (sister / lazy / sporty / me)
    ("avatar-sister.svg", cat("#ff8fab", "#f8bbd9")),
    ("avatar-lazy.svg",   cat("#f4c879", "#fff1b8", "#ff9a6c", "#ffb27a")),
    ("avatar-sporty.svg", cat("#f0a06a", "#ffc8a8", "#ff7a5c", "#ff9472")),
    ("avatar-user.svg",   cat("#a9d4f0", "#d4ecff", "#7ab8e0", "#8fc8e8")),
    # cats for former pravatar slots
    ("avatar-p1.svg",     cat("#7bd88f", "#dcf5e2", "#5cc47a", "#7ad98e")),
    ("avatar-p2.svg",     cat("#ff9aa8", "#ffe0e4", "#ff7a8c", "#ff97a6")),
    ("avatar-p3.svg",     cat("#b08bf8", "#ece2fb", "#9a6cf0", "#b18cf8")),
    ("avatar-p4.svg",     cat("#b6e36b", "#eef8d6", "#9bd14a", "#aede5e")),
]

os.makedirs(OUT, exist_ok=True)
for name, svg in specs:
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(svg.strip() + "\n")
print("generated", len(specs), "avatars")
for name, _ in specs:
    print(" -", name)
