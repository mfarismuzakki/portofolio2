"""Refresh the current live video ID of every channel in js/data/live-streams.json.

YouTube's embed/live_stream?channel=... no longer resolves reliably, so the app embeds
a concrete video ID. This script reads each channel's /live page and records the
broadcast that is live right now. Standard library only; run locally or from CI:

    python islamhub/tools/update_live_streams.py
"""
import json, re, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "js" / "data" / "live-streams.json"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
    "Accept-Language": "id,en;q=0.8",
    "Cookie": "CONSENT=YES+cb; SOCS=CAI",
}


def current_live(channel_id):
    req = urllib.request.Request(f"https://www.youtube.com/channel/{channel_id}/live", headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        html = r.read().decode("utf-8", "ignore")
    # From datacenter IPs YouTube may answer with a consent or bot check page. That says
    # nothing about the channel, so keep the previous state instead of marking it offline.
    if "ytInitialData" not in html and "ytInitialPlayerResponse" not in html:
        raise RuntimeError("no player data (consent or bot check page)")
    canon = re.search(r'<link rel="canonical" href="https://www\.youtube\.com/watch\?v=([\w-]{11})"', html)
    live = '"isLiveNow":true' in html or '"isLive":true' in html
    owner = re.search(r'"channelId":"(UC[\w-]{22})"', html)
    # Only accept a broadcast that is live now and belongs to this channel.
    if canon and live and (not owner or owner.group(1) == channel_id):
        return canon.group(1)
    return None


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    changed = False
    for ch in data["channels"]:
        try:
            vid = current_live(ch["channelId"])
        except Exception as e:  # keep the previous ID on network errors
            print(f"! {ch['name']}: {e}", file=sys.stderr)
            continue
        live = vid is not None
        if vid and vid != ch.get("videoId"):
            ch["videoId"] = vid
            changed = True
        if ch.get("live") != live:
            ch["live"] = live
            changed = True
        print(f"{'LIVE' if live else 'off '} {ch['name']}: {ch.get('videoId')}")
    if changed:
        data["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
        DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("changed" if changed else "unchanged")


if __name__ == "__main__":
    main()
