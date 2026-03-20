# Hero background video

Put your homepage hero file here as:

`hero.mp4`

**Why:** Files in `public/` are served as static assets and are **not** bundled into the JS build. A large video in `src/` was inflating `dist/` (~800MB+) and slowing `npm run build`.

**Tip:** For production, compress the clip (e.g. under ~15MB) or host on a CDN and set `HERO_VIDEO_SRC` in `HomePage.jsx` to that URL.
