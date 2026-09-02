"""
cathi-ui.min.css 构建脚本（纯 Python，零依赖）。

用法：
    python tools/minify.py              # 压缩 cathi-ui.css -> cathi-ui.min.css
    python tools/minify.py --check      # 仅校验 min.css 与源码同步
"""
from __future__ import annotations
import io
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC  = ROOT / "cathi-ui.css"
DEST = ROOT / "cathi-ui.min.css"

BANNER = (
    "/*! cathi-ui v4 | CC BY-NC 4.0 (non-commercial) | "
    "minified from cathi-ui.css by tools/minify.py */\n"
)


def strip_comments(src: str) -> str:
    """保留首个 /*! … */ 许可证注释，其余删除。"""
    out, i, n = [], 0, len(src)
    while i < n:
        if src[i:i + 2] == "/*":
            j = src.find("*/", i + 2)
            if j == -1:
                break
            block = src[i:j + 2]
            if i == 0 and block.startswith("/*!") and not out:
                out.append(block)
            i = j + 2
        else:
            out.append(src[i])
            i += 1
    return "".join(out)


_WS_RUN = re.compile(r"\s+")


def collapse_ws(s: str) -> str:
    """把任意连续空白压成单空格（在 token 之间是安全的）。"""
    return _WS_RUN.sub(" ", s)


def minify(src: str) -> str:
    s = strip_comments(src)
    # 规范化行尾
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    # 去掉 /* 注释残留的安全保障
    s = re.sub(r"/\*[\s\S]*?\*/", "", s)
    # 去掉每行首尾空白
    lines = [line.strip() for line in s.split("\n")]
    s = "\n".join(lines)
    # 把选择器体内多空白压成 1
    s = collapse_ws(s)
    # 去掉 `;` 与 `}` 之间的空格
    s = re.sub(r"\s*;\s*}", "}", s)
    # 去掉 `:` 后的多余空格（但保留 1 个）
    s = re.sub(r"\s*:\s*", ":", s)
    # 去掉 `{` 前后的多余空格
    s = re.sub(r"\s*\{\s*", "{", s)
    # 去掉最后一个 `}` 后的分号
    s = re.sub(r";}", "}", s)
    # 压缩：去除空行
    s = re.sub(r"\n+", "\n", s)
    # 末尾单换行
    return s.strip() + "\n"


def main() -> int:
    args = sys.argv[1:]
    if "--check" in args:
        if not DEST.exists():
            print("FAIL: cathi-ui.min.css missing, run without --check first")
            return 1
        src_min = minify(SRC.read_text(encoding="utf-8"))
        if DEST.read_text(encoding="utf-8") != BANNER + src_min:
            print("FAIL: cathi-ui.min.css is out of sync with cathi-ui.css")
            return 1
        print("OK: cathi-ui.min.css is in sync")
        return 0

    if not SRC.exists():
        print(f"FAIL: {SRC} not found", file=sys.stderr)
        return 1

    src_text = SRC.read_text(encoding="utf-8")
    out = BANNER + minify(src_text)
    DEST.write_text(out, encoding="utf-8", newline="\n")

    src_size = len(src_text.encode())
    min_size = len(out.encode())
    ratio = (1 - min_size / src_size) * 100 if src_size else 0
    print(f"wrote {DEST.relative_to(ROOT)}: {min_size:,} bytes "
          f"(src {src_size:,} bytes, saved {ratio:.1f}%)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
