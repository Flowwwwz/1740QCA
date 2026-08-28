# 1740QCA Process Journal — site guide

## What this is
Seven pages: an index with a scattered image grid, plus one page per task. Dark, type-led, image-first — built off the Cipher reference.

## The motion
**Page morphing** — native **View Transitions API**. Click a tile on the index and it morphs into the page hero. No library, no JS. Works in Chrome, Edge, Safari 18.2+ and Firefox.

**Scroll reveals** — CSS **scroll-driven animations** (`animation-timeline: view()`). Sections rise as they enter. `js/main.js` only exists as a fallback for older browsers.

**Type** — Switzer + Clash Display, loaded free from Fontshare. Deliberately not Inter/Poppins.

⚠️ **Morphing only works over http, not `file://`.** To preview locally:
```
cd "1740QCA Journal"
python3 -m http.server 8000
```
then open `http://localhost:8000`. Or just deploy — it works live.

## Adding your work
Replace the placeholders in `images/` — keep the filenames and they slot straight in.

**Index thumbnails:** `thumb-01.jpg` … `thumb-06.jpg` (`thumb-04.gif` for the GIF tile)

**Task 01:** `t01-folder-structure.png` · `t01-catalogue.png` · `t01-backup-drive.png` · `t01-backup-usb.png`
**Task 02:** `t02-raw-folder.png` · `t02-library-module.png` · `t02-develop-01…04.png` · `t02-psd-export.png` · `t02-photoshop-open.png`
**Task 03:** `t03-layers.png` · `t03-adjustment.png` · `t03-blend-01.png` · `t03-blend-02.png` · `t03-metadata.png`
**Task 04:** `t04-timeline.png` · `t04-export.png` · `t04-gif-01…05.gif`
**Task 05:** `t05-lr-export.png` · `t05-ae-timeline.png` + five YouTube embeds

**YouTube:** in `05-sequences.html`, replace `VIDEO_ID_01`…`05` with the ID from your URL (`youtube.com/watch?v=**THIS_BIT**`). Unlisted is fine.

**Captions:** every `<span class="todo">` is a placeholder. Replace all of them — the captions are where the marks are.

## Layout tuning
The scatter positions live in `css/style.css` under `.t1`–`.t6`. Change `left`, `top`, `width` and `aspect-ratio` to re-compose. Keep it irregular — the asymmetry is the point.

## Publishing (free)
**app.netlify.com/drop** — drag this folder on, get a live URL. Drag again to update.

## Before submitting
- [ ] All placeholders replaced with real screenshots
- [ ] Every `todo` caption written
- [ ] Five GIFs and five videos in place
- [ ] Reflective report written (~300 words)
- [ ] **Open the live URL in a private window** — if it doesn't load there it won't be assessed
- [ ] PDF containing the URL uploaded to the submission portal
