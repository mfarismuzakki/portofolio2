"""Tiny SVG toolkit for the case-study architecture diagrams.

Icons are embedded as data URIs so each SVG stays self-contained when it is loaded through an <img> tag
(SVG images cannot fetch external files).
"""
from __future__ import annotations

import base64
from html import escape
from pathlib import Path

ICONS = Path(__file__).resolve().parent.parent / "assets" / "icons"
FONT = "'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif"
MONO = "'Cascadia Mono', 'JetBrains Mono', Consolas, monospace"

ZONES = {
    "users": ("#f4f6fa", "#d5dce7", "#334155"),
    "ms": ("#eef4ff", "#c4d7fb", "#1f4fd1"),
    "aws": ("#fff8f0", "#f6d3a6", "#b4540a"),
    "data": ("#f6f3ff", "#d9cffb", "#6b3fd6"),
    "ai": ("#effbf6", "#b9e8d3", "#0f7a53"),
    "sub": ("#ffffff", "#efc993", "#a35c12"),
    "gov": ("#f8fafc", "#d9e1ec", "#475569"),
}


def icon_uri(name: str) -> str:
    for ext, mime in ((".svg", "image/svg+xml"), (".png", "image/png")):
        p = ICONS / f"{name}{ext}"
        if p.exists():
            return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()
    raise FileNotFoundError(name)


def t(s: str) -> str:
    return escape(s, quote=False)


class Diagram:
    def __init__(self, w: int, h: int, eyebrow: str, title: str, subtitle: str):
        self.w, self.h = w, h
        self.back: list[str] = []
        self.mid: list[str] = []
        self.front: list[str] = []
        self.uris: dict[str, str] = {}
        self.header = (eyebrow, title, subtitle)

    def _icon(self, name: str) -> str:
        if name not in self.uris:
            self.uris[name] = icon_uri(name)
        return f"#ic-{name}"

    def _use(self, name: str, x: float, y: float, size: float) -> str:
        self._icon(name)
        return f'<use href="#ic-{name}" x="{x}" y="{y}" width="{size}" height="{size}"/>'

    # zones -------------------------------------------------------------------------------------------------
    def zone(self, x, y, w, h, label, kind, icon=None, tag=None, dashed=False):
        fill, stroke, ink = ZONES[kind]
        dash = ' stroke-dasharray="6 5"' if dashed else ""
        self.back.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" fill="{fill}" stroke="{stroke}"'
                         f' stroke-width="1.2"{dash}/>')
        tx = x + 18
        if icon:
            self.back.append(self._use(icon, x + 16, y + 13, 22))
            tx = x + 46
        self.back.append(f'<text x="{tx}" y="{y + 30}" font-size="12.5" font-weight="700" letter-spacing="1.3"'
                         f' fill="{ink}">{t(label.upper())}</text>')
        if tag:
            self.back.append(f'<text x="{x + w - 18}" y="{y + 30}" font-size="11.5" text-anchor="end" fill="{ink}"'
                             f' opacity=".75" font-family="{MONO}">{t(tag)}</text>')

    # nodes -------------------------------------------------------------------------------------------------
    def card(self, cx, cy, icon, title, sub="", w=176, h=108, accent=None):
        x, y = cx - w / 2, cy - h / 2
        stroke = accent or "#dfe5ee"
        sw = 2 if accent else 1.1
        self.front.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="#fff" stroke="{stroke}"'
                          f' stroke-width="{sw}" filter="url(#sh)"/>')
        self.front.append(self._use(icon, cx - 20, y + 14, 40))
        self.front.append(f'<text x="{cx}" y="{y + 74}" font-size="14" font-weight="700" fill="#0f172a"'
                          f' text-anchor="middle">{t(title)}</text>')
        if sub:
            self.front.append(f'<text x="{cx}" y="{y + 92}" font-size="11.5" fill="#64748b" text-anchor="middle">'
                              f'{t(sub)}</text>')
        return {"l": (x, cy), "r": (x + w, cy), "t": (cx, y), "b": (cx, y + h)}

    def row(self, x, cy, icon, title, sub="", w=264, h=70, accent=None):
        y = cy - h / 2
        stroke = accent or "#dfe5ee"
        sw = 2 if accent else 1.1
        self.front.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="#fff" stroke="{stroke}"'
                          f' stroke-width="{sw}" filter="url(#sh)"/>')
        self.front.append(self._use(icon, x + 14, cy - 19, 38))
        ty = cy - 3 if sub else cy + 5
        self.front.append(f'<text x="{x + 64}" y="{ty}" font-size="14" font-weight="700" fill="#0f172a">{t(title)}</text>')
        if sub:
            self.front.append(f'<text x="{x + 64}" y="{cy + 15}" font-size="11.5" fill="#64748b">{t(sub)}</text>')
        return {"l": (x, cy), "r": (x + w, cy), "t": (x + w / 2, y), "b": (x + w / 2, y + h)}

    def box(self, x, y, w, h, title, lines, accent="#0f7a53", icon=None):
        self.front.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="#fff" stroke="{accent}"'
                          f' stroke-width="2" filter="url(#sh)"/>')
        tx = x + 20
        if icon:
            self.front.append(self._use(icon, x + 18, y + 16, 42))
            tx = x + 72
        self.front.append(f'<text x="{tx}" y="{y + 36}" font-size="16" font-weight="700" fill="#0f172a">{t(title[0])}</text>')
        if len(title) > 1:
            self.front.append(f'<text x="{tx}" y="{y + 55}" font-size="12" fill="#64748b">{t(title[1])}</text>')
        ly = y + (84 if icon or len(title) > 1 else 64)
        for line in lines:
            self.front.append(f'<circle cx="{x + 26}" cy="{ly - 4}" r="3" fill="{accent}"/>'
                              f'<text x="{x + 38}" y="{ly}" font-size="12.5" fill="#334155">{t(line)}</text>')
            ly += 22
        return {"l": (x, y + h / 2), "r": (x + w, y + h / 2), "t": (x + w / 2, y), "b": (x + w / 2, y + h)}

    def chip(self, x, y, text, fill="#f1f5f9", ink="#334155", stroke="#dbe2ea"):
        w = 16 + len(text) * 6.6
        self.front.append(f'<rect x="{x}" y="{y}" width="{w:.0f}" height="26" rx="13" fill="{fill}" stroke="{stroke}"/>'
                          f'<text x="{x + w / 2:.0f}" y="{y + 17}" font-size="11.5" font-weight="600" fill="{ink}"'
                          f' text-anchor="middle">{t(text)}</text>')
        return w

    # edges -------------------------------------------------------------------------------------------------
    def edge(self, pts, label=None, at=None, dashed=False, step=None, color=None, both=False, lpos=0.5):
        col = color or ("#16a34a" if dashed else "#475569")
        mk = "ag" if dashed else "ad"
        d = " ".join(f"{px},{py}" for px, py in pts)
        dash = ' stroke-dasharray="6 5"' if dashed else ""
        start = f' marker-start="url(#{mk}s)"' if both else ""
        self.mid.append(f'<polyline points="{d}" fill="none" stroke="{col}" stroke-width="1.7"{dash}'
                        f' stroke-linejoin="round"{start} marker-end="url(#{mk})"/>')
        if label or step:
            if at is None:
                # midpoint of the longest segment
                segs = list(zip(pts, pts[1:]))
                (x1, y1), (x2, y2) = max(segs, key=lambda s: abs(s[1][0] - s[0][0]) + abs(s[1][1] - s[0][1]))
                at = (x1 + (x2 - x1) * lpos, y1 + (y2 - y1) * lpos)
            ax, ay = at
            if label:
                w = 14 + len(label) * 6.3
                self.front.append(f'<rect x="{ax - w / 2:.0f}" y="{ay - 12}" width="{w:.0f}" height="22" rx="11"'
                                  f' fill="#fff" stroke="#dbe2ea"/>'
                                  f'<text x="{ax:.0f}" y="{ay + 3}" font-size="11" fill="#334155" text-anchor="middle">'
                                  f'{t(label)}</text>')
            if step:
                sx = ax - (14 + len(label or "") * 6.3) / 2 - 14 if label else ax
                self.front.append(f'<circle cx="{sx:.0f}" cy="{ay - 1}" r="11" fill="#0f172a"/>'
                                  f'<text x="{sx:.0f}" y="{ay + 3}" font-size="11" font-weight="700" fill="#fff"'
                                  f' text-anchor="middle">{step}</text>')

    def legend(self, x, y, items):
        cx = x
        for kind, text in items:
            if kind == "solid":
                self.front.append(f'<line x1="{cx}" y1="{y}" x2="{cx + 34}" y2="{y}" stroke="#475569" stroke-width="1.7"'
                                  f' marker-end="url(#ad)"/>')
            elif kind == "dashed":
                self.front.append(f'<line x1="{cx}" y1="{y}" x2="{cx + 34}" y2="{y}" stroke="#16a34a" stroke-width="1.7"'
                                  f' stroke-dasharray="6 5" marker-end="url(#ag)"/>')
            else:
                self.front.append(f'<circle cx="{cx + 12}" cy="{y}" r="10" fill="#0f172a"/>'
                                  f'<text x="{cx + 12}" y="{y + 4}" font-size="10.5" font-weight="700" fill="#fff"'
                                  f' text-anchor="middle">1</text>')
            self.front.append(f'<text x="{cx + 44}" y="{y + 4}" font-size="12" fill="#475569">{t(text)}</text>')
            cx += 60 + len(text) * 6.6

    def note(self, x, y, text, size=12, ink="#64748b", anchor="start", weight=400):
        self.front.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{ink}" text-anchor="{anchor}"'
                          f' font-weight="{weight}">{t(text)}</text>')

    # output ------------------------------------------------------------------------------------------------
    def svg(self) -> str:
        eyebrow, title, subtitle = self.header
        defs = "".join(f'<symbol id="ic-{k}" viewBox="0 0 48 48"><image href="{v}" width="48" height="48"'
                       f' preserveAspectRatio="xMidYMid meet"/></symbol>' for k, v in self.uris.items())
        markers = ""
        for mid, col in (("ad", "#475569"), ("ag", "#16a34a")):
            markers += (f'<marker id="{mid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7"'
                        f' orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{col}"/></marker>'
                        f'<marker id="{mid}s" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7"'
                        f' orient="auto"><path d="M10,0 L0,5 L10,10 z" fill="{col}"/></marker>')
        head = (f'<text x="40" y="44" font-size="12" font-weight="700" letter-spacing="2.4" fill="#0f7a53"'
                f' font-family="{MONO}">{t(eyebrow.upper())}</text>'
                f'<text x="40" y="78" font-size="27" font-weight="700" fill="#0b1220" letter-spacing="-.4">{t(title)}</text>'
                f'<text x="40" y="104" font-size="14.5" fill="#5b6b80">{t(subtitle)}</text>')
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}"'
                f' height="{self.h}" role="img" aria-label="{t(title)}" font-family="{FONT}">'
                f'<title>{t(title)}</title><desc>{t(subtitle)}</desc>'
                f'<defs>{defs}{markers}<filter id="sh" x="-10%" y="-10%" width="120%" height="140%">'
                f'<feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0f172a" flood-opacity=".07"/></filter>'
                f'<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">'
                f'<circle cx="1" cy="1" r="1" fill="#e6ebf2"/></pattern></defs>'
                f'<rect width="{self.w}" height="{self.h}" fill="#fbfcfe"/>'
                f'<rect width="{self.w}" height="{self.h}" fill="url(#dots)"/>'
                f'{head}{"".join(self.back)}{"".join(self.mid)}{"".join(self.front)}</svg>')

    def save(self, path: Path):
        path.write_text(self.svg(), encoding="utf-8")
        print("wrote", path, f"{path.stat().st_size // 1024} KB")
