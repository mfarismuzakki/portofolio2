"""Build js/data/alquran/kemenag/PageNNN.json: the Mushaf Standar Indonesia (Kemenag/LPMQ)
text for every verse on each of the app's 604 pages, as {"surah:verse": text}.

    python islamhub/tools/build_kemenag_pages.py

Source: Kementerian Agama RI, Lajnah Pentashihan Mushaf Al-Qur'an (quran.kemenag.go.id),
via the quran-json mirror (https://quran-json.risanb.com/text/kemenag/quran.json).
The text is copied verbatim; only the page grouping is ours.
"""
import json, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "js" / "data" / "alquran" / "pages"
OUT = ROOT / "js" / "data" / "alquran" / "kemenag"
SOURCE = "https://quran-json.risanb.com/text/kemenag/quran.json"


def main():
    with urllib.request.urlopen(urllib.request.Request(SOURCE, headers={"User-Agent": "IslamHub build"}), timeout=60) as r:
        chapters = json.load(r)
    text = {(c["id"], v["id"]): v["text"] for c in chapters for v in c["verses"]}
    assert len(text) == 6236, len(text)
    OUT.mkdir(parents=True, exist_ok=True)
    missing = 0
    for page in sorted(PAGES.glob("Page*.json")):
        data = json.loads(page.read_text(encoding="utf-8"))
        out = {}
        for s in data["surahs"]:
            for v in s["verses"]:
                key = (int(s["number"]), int(v["number"]))
                if key in text:
                    out[f"{key[0]}:{key[1]}"] = text[key]
                else:
                    missing += 1
        (OUT / page.name).write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(list(OUT.glob('Page*.json')))} pages written, {missing} verses missing")


if __name__ == "__main__":
    main()
