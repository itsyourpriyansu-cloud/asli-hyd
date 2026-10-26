# Starter prompt for a new Claude session

Open Claude Code in `C:\Users\priyansu\Downloads\asli_hyd`. Claude Code loads `CLAUDE.md` automatically. Paste the prompt below as the first message, then give section commands the way you always have.

---

## 1. Session-start prompt (paste once, at the start)

```text
You're continuing the Asli Hyderabad homepage build in this folder. Another Claude session built everything so far with me, section by section. Pick up exactly where it left off, in the same flow.

Before doing anything else:
1. Read CLAUDE.md, then docs/PROJECT-CONTEXT.md in full, then tools/README.md.
2. Skim WIREFRAME-CONTENT.md (the client's wireframe = the brief) and LIVE-SITE-AUDIT.md (data from the live aslihyd.in), and look at the plans in docs/plans/ to see how earlier sections were planned.
3. Start your own server (node server.js 8655, or another free port). Run
   node tools/test/shot.mjs http://127.0.0.1:8655/ <absolute scratchpad path> <data-sec> 1440x900
   for 2–3 built sections, and look at the screenshots, so you have seen the current site with your own eyes.
4. Reply with a short summary only:
   - the section map as you understand it (visible number → data-sec → what it is → built or template);
   - the working rules you will follow;
   - anything in the docs that looks inconsistent with the code.
   Then wait for my command. Do not change any files yet.

How I work, which the docs also cover:
- I give one section at a time, usually with a screenshot. I may say "this section", "the next section" or "the Nth section" (counting visible sections from the top). If there's any doubt which section I mean, ask before editing. Never touch sections I didn't name.
- If my message has /plan or says "plan", use plan mode. Research the wireframe, the live data, the code and online assets, then show me the plan for approval before building. Otherwise just do it.
- Keep every existing effect and interaction working. Verify in headless Chrome (desktop + phone, clean console) and look at the screenshots before you tell me it's done.
- No eyebrows or extra CTAs unless I ask. Real, properly licensed Hyderabad imagery: never YouTube, and record every credit. Use the site's cream/ink/gold design system and the jaali/arch motifs.
```

---

## 2. Command patterns that work well

Each pattern is followed by its typical prompt.

**Plan and build a section (big change):**

```text
/plan <screenshot> In this section (<visible number or name>) build <what>, using <wireframe section / data>. Same interaction as <section N> / <reference>. Find the best images and videos online and apply them properly.
```

**Direct change (small, clear):**

```text
<screenshot> Get rid of the eyebrow here.
<screenshot> Change the image here and make it perfect for this copy. Use anything available online.
<screenshot> Improve the UI of this list, same interaction, keep only 10 items, more breathing room.
```

**Next unbuilt section:**

```text
/plan Now the next section: make it <wireframe section, e.g. "Plan My Hyderabad">.
```

The next template slots after section 9 are Materials, Worlds, Heritage, Social and Partners; see PROJECT-CONTEXT §3.

**Asking where things stand:**

```text
What's left to build against the wireframe, and what do you recommend for the next section?
```

---

## 3. What the new session should already know (sanity check)

- **Visible section 5** = "Hyderabad, Your Way" (the six-theme card explorer). **Visible 10** = "Asli Hyderabad Originals", the same explorer mirrored.
- Quick Experiences lives in `data-sec="spinner"`. Keep that name; motion.js depends on it.
- Sections 11–15 (Materials, Worlds, Heritage, Social, Partners) are still the template.
- The tests live in `tools/test/`. `originals.mjs`, `arcade.mjs` and `voices.mjs` should all print all PASS.

If any of these comes back wrong, point it to `docs/PROJECT-CONTEXT.md` §3.
