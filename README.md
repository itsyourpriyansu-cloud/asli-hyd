# Asli Hyderabad: homepage build

A one-page homepage for [Asli Hyderabad](https://aslihyd.in), in plain HTML, CSS and JS with GSAP 3.12.5 + ScrollTrigger and Lenis 1.1.13 (all local, no CDN). It started from a luxury-template layout ("Maison Nomen", hence the `mn-` class prefix) and is being rebuilt section by section with Asli's content from the client wireframe and the live site.

## Run

```
npm start              # or: node server.js [port]   -> http://127.0.0.1:8642
```

Use this server, not `python -m http.server` or double-clicking `index.html`. It supports HTTP Range requests, which the section videos need.

## Where things are

| Path | What |
|---|---|
| `index.html` | Every section, in page order |
| `css/` | `base` (tokens), `fonts`, `header`, `preloader`, `sections` (in page order), `footer` |
| `js/preloader.js` | Intro loader |
| `js/components.js` | UI behaviour (header, explorers, carousel, Quick Experiences…) |
| `js/motion.js` | Lenis + every scroll animation |
| `js/cats-reveal.js` | Section 3 WebGL colour reveal |
| `assets/` | Images, videos, fonts, brand; credits in `assets/img/SOURCES.md`, `assets/img/quick/SOURCES.md`, `VIDEO-SOURCES.md` |
| `tools/` | Headless Chrome tests and asset scripts ([tools/README.md](tools/README.md)) |
| `docs/PROJECT-CONTEXT.md` | **Full project context and handoff**: section map, architecture, design system, workflow, backlog |
| `docs/STARTER-PROMPT.md` | The prompt to start a new Claude session on this project |
| `docs/plans/` | Approved plans from earlier steps |
| `WIREFRAME-CONTENT.md` / `LIVE-SITE-AUDIT.md` | Content briefs (client wireframe, live-site crawl) |
| `SITE-OUTLINE.md` | The original template's asset brief (outdated for the sections already rebuilt) |

## Status (26 Oct 2026)

**Built:** the intro loader, hero, statement, Two Paths, conventions carousel, Hyderabad Your Way, numbers, Private Access teaser, Rooted in Hyderabad (+ skyline), Quick Experiences, Asli Hyderabad Originals, header and footer.

**Still template:** Materials, Worlds, Heritage, Social and Partners (sections 10–14 in the code).

See `docs/PROJECT-CONTEXT.md` for the details and the wireframe sections still to build.

All inner-page links are placeholders, and forms are inert.
