"""Generate css/components/sakinah-theme.css from the dark (classic) component styles.

The classic theme stays untouched. Every colour-bearing declaration is re-emitted under
html[data-theme="sakinah"] with neon/dark colours mapped onto the Sakinah palette
(cream paper, forest green, quiet gold). Run after editing component CSS:

    python islamhub/tools/build_sakinah_theme.py
"""
import colorsys, re
from pathlib import Path
import tinycss2

ROOT = Path(__file__).resolve().parent.parent / "css" / "components"
OUT = ROOT / "sakinah-theme.css"
SCOPE = 'html[data-theme="sakinah"]'
# Already light, hand-tuned components are left alone.
SKIP = {"arena.css", "manasik-game.css", "simulations.css", "sakinah.css", "sakinah-theme.css", "variables.css"}

INK, INK2, MUTED = (31, 61, 51), (74, 91, 81), (87, 100, 90)
CARD, PAGE = (255, 253, 247), (246, 243, 234)
ACCENTS = {  # hue family -> (text variant, fill variant)
    "green": ((36, 88, 69), (47, 114, 88)),
    "teal": ((36, 88, 69), (47, 114, 88)),
    "plum": ((91, 74, 150), (107, 90, 166)),
    "red": ((160, 70, 50), (181, 84, 63)),
    "amber": ((135, 82, 22), (168, 98, 30)),
    "gold": ((120, 90, 32), (138, 102, 36)),
    "blue": ((38, 92, 128), (47, 111, 138)),
}
COLOR_PROPS = ("color", "background", "background-color", "background-image", "border", "border-color",
               "border-top", "border-bottom", "border-left", "border-right", "border-top-color",
               "border-bottom-color", "border-left-color", "border-right-color", "box-shadow", "text-shadow",
               "outline", "outline-color", "fill", "stroke", "caret-color", "-webkit-text-fill-color",
               "text-decoration-color", "column-rule", "accent-color", "filter")
NAMED = {"white": (255, 255, 255, 1), "black": (0, 0, 0, 1), "cyan": (0, 255, 255, 1), "aqua": (0, 255, 255, 1),
         "gold": (255, 215, 0, 1), "red": (255, 0, 0, 1), "lime": (0, 255, 0, 1), "magenta": (255, 0, 255, 1),
         "yellow": (255, 255, 0, 1), "orange": (255, 165, 0, 1), "gray": (128, 128, 128, 1), "grey": (128, 128, 128, 1),
         "silver": (192, 192, 192, 1)}
COLOR_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:" + "|".join(NAMED) + r")\b")
# Theme variables that resolve to an accent fill in both themes.
ACCENT_VARS = re.compile(r"var\(--(primary-cyan|cyan|purple|neon-purple|primary-purple|electric-blue|matrix-green|secondary-pink|pink|accent-pink|islamic-gold|islamic-emerald|gradient-(primary|secondary|accent|gold))\b")
OVERLAY_SEL = re.compile(r"overlay|backdrop|modal(?!-content|-body|-header)|lightbox", re.I)
FONT_RE = re.compile(r"['\"]?(Orbitron|Rajdhani)['\"]?", re.I)


def parse(tok):
    t = tok.lower()
    if t in NAMED:
        return NAMED[t]
    if t.startswith("#"):
        h = t[1:]
        if len(h) in (3, 4):
            h = "".join(c * 2 for c in h)
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1
        return r, g, b, a
    nums = re.findall(r"[\d.]+%?", t)
    if len(nums) < 3:
        return None
    vals = [float(n.rstrip("%")) * (2.55 if n.endswith("%") else 1) for n in nums[:3]]
    a = float(nums[3].rstrip("%")) / (100 if nums[3].endswith("%") else 1) if len(nums) > 3 else 1
    return int(vals[0]), int(vals[1]), int(vals[2]), a


def fmt(rgb, a):
    a = max(0, min(1, a))
    return f"rgb({rgb[0]}, {rgb[1]}, {rgb[2]})" if a >= 0.995 else f"rgba({rgb[0]}, {rgb[1]}, {rgb[2]}, {round(a, 3)})"


def family(r, g, b):
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    if s < 0.35 or v < 0.35:
        return None
    deg = h * 360
    if 45 <= deg < 70 or (35 <= deg < 45 and s < 0.75):
        return "gold"
    if 20 <= deg < 45:
        return "amber"
    if 70 <= deg < 160:
        return "green"
    if 160 <= deg < 195:
        return "teal"
    if 195 <= deg < 230:
        return "blue"
    if 230 <= deg < 300:
        return "plum"
    return "red"


def map_color(c, kind, overlay=False):
    """kind: text | bg | border | shadow"""
    r, g, b, a = c
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    fam = family(r, g, b)
    if fam:
        text, fill = ACCENTS[fam]
        if kind == "text":
            return fmt(text, max(a, 0.85) if a > 0.4 else a + 0.3)
        if kind == "shadow":
            return fmt(INK, min(0.12, a * 0.3))
        if kind == "border":
            return fmt(fill, min(0.55, a + 0.1))
        return fmt(fill, a)
    if luma > 200:  # white-ish
        if kind == "text":
            return fmt(INK, 1) if a >= 0.85 else fmt(INK2, 1) if a >= 0.55 else fmt(MUTED, min(1, a + 0.35))
        if kind == "border":
            return fmt(INK, min(0.16, 0.06 + a * 0.5))
        if kind == "shadow":
            return fmt(INK, min(0.08, a * 0.3))
        return fmt(CARD, 1 if a >= 0.12 else 0.55 + a * 3.5)
    if luma < 45:  # near-black / dark navy
        if kind == "text":
            return fmt(INK, a)
        if kind == "shadow":
            return fmt(INK, min(0.14, a * 0.22))
        if kind == "border":
            return fmt(INK, 0.1)
        if overlay and r < 8 and g < 8 and b < 8 and 0.3 <= a < 0.95:  # modal backdrops
            return fmt((20, 36, 30), a * 0.55)
        return fmt(PAGE if a >= 0.95 else CARD, 1 if a >= 0.95 else max(0.92, a))
    # mid greys
    if kind == "text":
        return fmt(MUTED if luma > 120 else INK2, max(a, 0.9))
    if kind == "border":
        return fmt(INK, 0.12)
    if kind == "shadow":
        return fmt(INK, min(0.1, a * 0.25))
    return fmt((236, 233, 220), a)


def kind_for(prop):
    if prop in ("color", "fill", "stroke", "caret-color", "-webkit-text-fill-color", "text-decoration-color", "accent-color"):
        return "text"
    if "shadow" in prop or prop == "filter":
        return "shadow"
    if prop.startswith("border") or prop.startswith("outline") or prop == "column-rule":
        return "border"
    return "bg"


def accent_bg(decls):
    """True when the rule paints a solid accent background (buttons, chips)."""
    for prop, val in decls:
        if prop in ("background", "background-color", "background-image"):
            if ACCENT_VARS.search(val):
                return True
            bare = re.sub(r"--[\w-]+", "", val)
            cols = [parse(m.group(0)) for m in COLOR_RE.finditer(bare)]
            cols = [c for c in cols if c]
            if cols and all(family(*c[:3]) and c[3] >= 0.6 for c in cols):
                return True
    return False


def transform_value(prop, val, rule_accent, overlay=False):
    if prop == "text-shadow":
        return "none" if COLOR_RE.search(val) else None
    kind = kind_for(prop)
    changed = False

    def sub(m):
        nonlocal changed
        c = parse(m.group(0))
        if not c:
            return m.group(0)
        changed = True
        if kind == "text" and rule_accent:
            luma = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]
            if luma > 200 or luma < 60:  # keep text readable on accent fills
                return fmt((255, 255, 255), max(c[3], 0.92))
        return map_color(c, kind, overlay)
    out = mask_vars(val, lambda v: COLOR_RE.sub(sub, v))
    return out if changed else None


def mask_vars(val, fn):
    """Apply fn to val while custom property names (var(--primary-cyan)) stay untouched;
    they are themed through the variable overrides. Fallback values are still processed."""
    held = []
    masked = re.sub(r"--[\w-]+", lambda m: held.append(m.group(0)) or f"\x00{len(held) - 1}\x00", val)
    return re.sub(r"\x00(\d+)\x00", lambda m: held[int(m.group(1))], fn(masked))


def decl_list(content):
    out = []
    for d in tinycss2.parse_declaration_list(content, skip_comments=True, skip_whitespace=True):
        if d.type == "declaration":
            out.append((d.lower_name, tinycss2.serialize(d.value).strip(), d.important))
    return out


def scope_selector(sel):
    parts = []
    for s in sel.split(","):
        s = s.strip()
        if not s:
            continue
        if s.startswith(":root"):
            parts.append(SCOPE + s[5:])
        elif re.match(r"^html\b", s):
            parts.append(SCOPE + s[4:])
        else:
            parts.append(f"{SCOPE} {s}")
    return ", ".join(parts)


def process_rules(rules, keyframes_colored, out, indent=""):
    for r in rules:
        if r.type == "qualified-rule":
            sel = tinycss2.serialize(r.prelude).strip()
            decls = decl_list(r.content)
            plain = [(p, v) for p, v, _ in decls]
            acc = accent_bg(plain)
            lines = []
            for prop, val, imp in decls:
                new = None
                if prop.startswith("--"):
                    new = None  # custom properties handled via :root overrides
                elif prop in COLOR_PROPS or prop.startswith("border"):
                    new = transform_value(prop, val, acc, OVERLAY_SEL.search(sel) is not None)
                elif prop in ("font-family", "font") and FONT_RE.search(re.sub(r"--[\w-]+", "", val)):
                    new = mask_vars(val, lambda v: FONT_RE.sub("'Plus Jakarta Sans'", v))
                elif prop in ("animation", "animation-name"):
                    names = [n for n in keyframes_colored if re.search(rf"\b{re.escape(n)}\b", val)]
                    if names:
                        new = val
                        for n in names:
                            new = re.sub(rf"\b{re.escape(n)}\b", "sk-" + n, new)
                if new is not None and new != val:
                    lines.append(f"{indent}  {prop}: {new}{' !important' if imp else ''};")
            if lines:
                out.append(f"{indent}{scope_selector(sel)} {{\n" + "\n".join(lines) + f"\n{indent}}}")
        elif r.type == "at-rule" and r.lower_at_keyword in ("media", "supports") and r.content:
            inner = []
            process_rules(tinycss2.parse_rule_list(r.content, skip_comments=True, skip_whitespace=True), keyframes_colored, inner, indent + "  ")
            if inner:
                out.append(f"{indent}@{r.lower_at_keyword} {tinycss2.serialize(r.prelude).strip()} {{\n" + "\n".join(inner) + f"\n{indent}}}")
        elif r.type == "at-rule" and r.lower_at_keyword in ("keyframes", "-webkit-keyframes") and r.content:
            name = tinycss2.serialize(r.prelude).strip()
            if name in keyframes_colored:
                frames = []
                for fr in tinycss2.parse_rule_list(r.content, skip_comments=True, skip_whitespace=True):
                    if fr.type != "qualified-rule":
                        continue
                    decls = []
                    for prop, val, imp in decl_list(fr.content):
                        new = transform_value(prop, val, False) if (prop in COLOR_PROPS or prop.startswith("border")) else None
                        decls.append(f"    {prop}: {new if new is not None else val};")
                    frames.append(f"  {tinycss2.serialize(fr.prelude).strip()} {{\n" + "\n".join(decls) + "\n  }")
                out.append(f"@keyframes sk-{name} {{\n" + "\n".join(frames) + "\n}")


def colored_keyframes(rules, found):
    for r in rules:
        if r.type == "at-rule" and r.lower_at_keyword in ("keyframes", "-webkit-keyframes") and r.content:
            if COLOR_RE.search(tinycss2.serialize(r.content)):
                found.add(tinycss2.serialize(r.prelude).strip())
        elif r.type == "at-rule" and r.content and r.lower_at_keyword in ("media", "supports"):
            colored_keyframes(tinycss2.parse_rule_list(r.content, skip_comments=True, skip_whitespace=True), found)


def main():
    files = sorted(p for p in ROOT.glob("*.css") if p.name not in SKIP)
    sheets = {p: tinycss2.parse_stylesheet(p.read_text(encoding="utf-8"), skip_comments=True, skip_whitespace=True) for p in files}
    kf = set()
    for rules in sheets.values():
        colored_keyframes(rules, kf)
    out = ["/* GENERATED by islamhub/tools/build_sakinah_theme.py. Do not edit by hand;",
           "   put manual fixes in sakinah.css. */"]
    for p, rules in sheets.items():
        chunk = []
        process_rules(rules, kf, chunk)
        if chunk:
            out.append(f"\n/* ---- {p.name} ---- */")
            out.extend(chunk)
    OUT.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"wrote {OUT.name}: {sum(1 for _ in OUT.open(encoding='utf-8'))} lines from {len(files)} files, {len(kf)} keyframes")


if __name__ == "__main__":
    main()
