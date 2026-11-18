# Everyday Safe — handoff for a new Claude session

Read this first. It replaces the long design conversation this app was built in.

## What this is

**Everyday Safe** (formerly "ESQ Ready") is a gamified health-and-safety microlearning web app for University of Alberta staff, owned by HRHSE, built by Laura Velázquez (CTL instructional designer). It started for the OD team at Enterprise Square (ESQ, 10230 Jasper Ave, Edmonton) and keeps ESQ-specific facts (address, Security number, floor plans), but the brand is people-centred, not building-centred.

- Live version: claude.ai artifact **https://claude.ai/artifact/9CANNBmq7e2eU3UQ6t4Z3U** (version 169, 2026-11-04). Not reachable from later sessions.
- Working preview (2026-11-17 onward): **https://claude.ai/artifact/Gu5QWt6b57akGHFCm6Jkqa**, published from files (`index.html` with a `<!DOCTYPE html>` + meta prefix, `data/bank.json`, `img/*`). Its page refers to the `db`/`comments` capabilities (account sync, team view) but they are not declared yet, so progress is local-only there.
- An old duplicate artifact "ESQ Ready" (82F2S3nThKTvSo1ipXvxUG) is stale — not the current app.
- Single-page app: one HTML file + `img/` + `data/bank.json`. No framework, no build tooling beyond `build.py`.

## Folder map

| Path | What |
|---|---|
| `index.html` | The built app (identical to the published v169). Needs a web server so it can fetch `data/bank.json`. |
| `standalone.html` | Same app with the question bank built in — opens by double-click, offline. Keep `img/` beside it. |
| `img/` | Every image the app uses (78). Lesson images are standardized to **2:1**. |
| `data/bank.json` | Question bank: 212 questions + branching cases; each has a `lesson` field ("1.2" etc.) and `format` (sort/order/rank/hotspot/branching/dialogue) or `type` (choice/multi). |
| `src/` | Editable source (see below). |
| `build.py` | Rebuilds `index.html`, `standalone.html`, `build/app.js`, `tests/test.html`. Run `python3 build.py`. |
| `tests/` | Playwright tests (see below). |
| `original-artwork/` | Not in this package (too large for a Claude project). Laura's unedited originals are in a separate zip, `everyday-safe-original-artwork.zip`. |

## How the source is assembled (important)

`build.py` concatenates, inside one IIFE:
1. `src/app1.js` — state, storage, migration, helpers, `dialog()`, `toast()`.
2. **Selected line ranges** of `src/content-base.html` — legacy content from v1 (procedure modules `M`, `LEARN` cards, `ULES`, `WORKED`, image maps `QIMG/STORYIMG/INTROIMG/LIMG/VPLAN`, SVG visuals `QV`). The ranges are hard-coded line numbers in `build.py`: **if you edit content-base.html, keep the line count of each range identical** (pad with blank lines) or the build breaks. Many image swaps are done as string `.replace()` calls in `build.py` instead.
3. `src/app2.js` — curriculum: `UNITS`, `LESSONS` (26 + `FINALL`), `CPATHS` (Explore sections), `MISSIONS`, `BADGES`, `LEVELS`.
4. `src/app3.js` — bank loading, `toItem`, the lesson player, `resolve()` (feedback), renderers `R.choice/multi/order/rank/sort/branch/pairs/hazards…`, `startLesson()` (resume prompt).
5. `src/app3b.js` — Unit 1 pattern renderers (`R.model/compare/fade/explore/locate/mission`) and Unit 1 lesson flows `L11–L14`; many `QIMG.x=[...]` image overrides live here.
6. `src/app3c.js` — `R.convo`, consequence text map `CQM`, Units 2–5 flows `L21–L52`; more `QIMG` overrides.
7. `src/app4.js` — finish screen, Keep Ready plan, navigation, Home (`drawHome`, `heroCTA`), Learn path cards, Building, More.
8. `src/app5.js` — sync to claude.ai account storage, progress codes, team/leads pages, onboarding, boot.
`src/head.html` = all CSS (later override blocks win); `src/body.html` = markup shell.

To change an image on a question: find its `img:'key'` in the flow (app3b/app3c) or content-base, then either add `QIMG.key=['img/file.webp','alt text']` in app3b/app3c, or give that one step its own key via `Object.assign({},step,{img:'newkey'})`. Story screens take `simg:['img/x.webp','alt']`.

## Tests

From `tests/` (needs Node + Playwright + Chromium; axe-core for ax.js):
- `node t2.js` — bot plays all 26 lessons + final; prints done/accuracy and any page errors. (`final` accuracy varies by random case; done:false at 78% is normal.)
- `node ax.js` — axe accessibility scan of main screens.
- `node tpers2.js` — leave mid-lesson, reopen, check "Welcome back" + resume dialog.
- `node t404.js` — walks screens and reports missing files.
Run `python3 ../build.py` first; it creates `tests/test.html` (the build with test hooks) that the tests use.

## Design decisions to keep

- **Brand:** U of A 2025/26 Master Brand. Green `#275D38`, Gold `#F2CD00`, Rich Black `#2B292A`, grey `#595959`, Digital White `#F5F5F5`, coral `#E56A54` only as non-text accent. Fonts Roboto Slab (headings) / Roboto (body). Light theme forced. Corners 8px (6px small). Laura rejected coloured accent stripes — keep secondary colours out except progress-state bars.
- **Images:** flat illustration style, U of A palette, off-white bg ~#EEEFE7/#F8F4EC. Lesson image frame = 2:1, `object-fit:contain`, never cropped; pad sides with matching background. Unit cards use `img/uN-scene.webp`.
- **Pedagogy:** lessons follow patterns Demonstrate→Guide→Apply, Explore→Locate→Retrieve, Compare→Explain→Transfer, Problem→Model→Solve, Observe→Interpret→Respond, Retrieve→Feedback→Reapply (Keep Ready). Feedback shows the **consequence** of the choice, not just right/wrong. Wrong answers requeue a new situation (max 2).
- **Branching stories:** weaker choice = gold warning ("Careful. What happens:"), strongest = green.
- **Order questions** may include distractor tiles; Submit unlocks once enough tiles are placed; extra tiles count as wrong.
- **Progress:** saved automatically (localStorage key `esq-ready-v2`; synced to the user's claude.ai account when available). Home shows "Welcome back · Pick up where you left off"; reopening a half-done lesson asks Continue / Start over. Full reset is More → Start over. Progress codes start `ESQ2.` (kept for compatibility).
- **Navigation:** header back arrow + single main button (Previous/Next bar was discussed but not built).

## Hard constraints (from Laura — do not break)

- No leaderboards; never show individual results to coworkers. Team view is unnamed weekly totals only.
- Never collect who needs help on stairs (health information).
- Floor Warden name and user name stay local only (stripped from sync).
- "Keep it as is" is a duress phrase in the content — leave it.
- Laura wants direct, honest feedback, not agreeable answers.

## Open items / known issues

- Content written by Claude (new scenarios, consequence lines, the Lesson 1.2 "feels faint" question) needs safety-expert review.
- Floor Warden is drawn in a **yellow** vest in Lesson 1.4 step 2; text elsewhere says **red** cap and vest.
- Wheelchair sign drawn green; text says blue.
- Lesson 1.1: wallet/keys left on desk in the "grab" image; muster point image shows no LRT station.
- Lesson 3.1 lunchroom steps 1–4 look nearly identical; 911 bubble text small.
- Lesson 3.2 Q2 image reuses the crutches/elevator character.
- Catering-cart question image already shows the correct answer.
- Some image alt texts name race/age/body type — Laura may prefer action-only alt text.
- Building tab/"Your building 0 of 5 lit" is still building-centred; could become "Your safety skills".
- Optional: Previous/Next footer, confetti results screen, delete stale duplicate artifact.

## Publishing (if the new session has the Artifact tool)

Publish `index.html` content to the existing URL above with `files` for any new/changed images under `img/`. The published file has no doctype/head (the Artifact host adds them); `index.html` here is exactly that body-level content, so publish it as is.

## Session 2026-11-17 changes

- "Watch it done" (R.model) steps: image now inset inside the white card (16px padding, 8px radius, max 520px wide, centred); step number moved beside the action text as a solid green circle (`.mrow`). Applies to every Demonstrate step.
- Order questions: emptied tile tray hidden once feedback shows (`.tiles:has(~ .fb){display:none}`), removing the gap above feedback.
- New images (all 2:1 webp, 1400x700; wider/taller sources padded, never cropped):
  - 1.1 story "A different morning" → `escalator-story.webp`; "Escalators are faster" → `escalator-faster.webp` (QIMG.escalator); 3rd-floor route order → `route-3f.webp` (QIMG.route3f); missing colleague → `missing3.webp` (QIMG.missing); smoke stairwell → `smoke-stair2.webp` (QIMG.smokestair).
  - 1.2 Q7 "feel faint" → `faint.webp` (QIMG.faint).
  - 1.3 Jae steps 2–5 → `fire-door`, `fire-pull`, `fire-call`, `fire-stairs`; extinguisher Q → `extinguisher-q.webp`; desk "find without thinking" → `desk-find.webp` (QIMG.gear); kitchenette order → `kitchenette-fire.webp` (QIMG.kitchfire).
  - 1.4 intro → `intro-mobility2.webp` (INTROIMG.mobility).
  - 2.1 intro image removed (`delete INTROIMG.room`); story → `room-story.webp` (STORYIMG.room).
  - 3.2 coffee code: story + Q1 → `visitor-story.webp` (STORYIMG.coffee, QIMG.visitor); Ana steps 1–4 → `coffee-call`, `coffee-say`, `coffee-detail`, `coffee-lock`; build-your-call → `coffee-build.webp` (QIMG.buildcall); "What does Security do" → `security-hears.webp` (QIMG.sechears).
- Alt text for all new images is action-only (no race/age/body type).

### Image issues flagged, not yet fixed
- Pull station drawn yellow (Jae step 3); extinguisher yellow and alarm box green (extinguisher Q). App text says red pull station; Canadian extinguishers are red.
- Jae step 4 calls 911 while still near the fire; suggest stairwell/outside or add "call from a safe spot" to the Why line.
- Ana step 4: Ana stands in the door window after locking in (should be out of sight); desk appears outside the room. Visitor's hand-on-chest in steps 1–3 can read as chest pain. Steps 1–3 desks differ; step 3 nearly identical to step 2.
- 1.4 intro: wheelchair is entering the elevator (lesson says wait in the lobby, never use the elevator); sign still green vs "blue" in text.
- 3rd-floor route image shows the full route (gives away the order answer) and an outdoor muster sign (should be upper LRT platform).
- Smoke stairwell image arrow points to the other exit (gives away the answer).
- Missing colleague image shows the train level, not the upper platform, and nobody at the muster point.
- "Escalators are faster" uses different characters from the preceding story image.
- "What does Security do" image shows the caller, not Security.
- Build-your-call image has a column of empty boxes that look like answer tiles.
- 2.1 story image shows a propped-open door (may pre-reveal a hazard).
