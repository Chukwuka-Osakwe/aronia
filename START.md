# Start here — optional

**This step is optional, and it's the human's call, not yours.** It exists for
people who aren't designers and would rather talk the direction through before
any UI gets built. If that's not you, skip the whole thing.

> **Are you comfortable directing the design yourself** — you know what you're
> building and roughly the style you want? Then say *"skip this, let's build"*
> and the agent goes straight to [AGENTS.md](./AGENTS.md). You never have to
> touch this file.
>
> **Not sure, or you'd like a hand choosing?** Then have the short conversation
> below **before any code is written.**

**Agent:** offer this — don't impose it. On the first UI request, if the design
direction isn't already settled, ask *once* whether they'd like to talk it
through or just get building, and honour the answer. If they choose to build,
skip straight to AGENTS.md; if they choose to talk, or don't know, run the
conversation below. Never make a non-designer sit through it against their will,
and never silently skip it for someone who could use it.

## Why this exists

aronia hands you three fully-formed design languages. When the direction is
clear, that's a gift. When it isn't, it's a trap: the risk was never *can you
build the UI* — you can — it's building it fast and confidently **in the wrong
language**, or in an accidental blend of all three. That's expensive to undo,
because by then it's spread across every screen.

So when nobody's steering, don't guess and don't build. Spend a few exchanges
settling the direction, get a yes, *then* build. Minutes here save a rewrite
later.

## The conversation

Ask a couple at a time — this is a conversation, not a form. Use their words
back to them, not design jargon.

1. **What are you making, and who's it for?** Enough to picture it — the kind of
   product, the audience, the feeling it should give.

2. **Pick the family.** Read the three back in plain terms and steer toward the
   one that fits what they just described:
   - **neo-brutalism** — loud, playful, high-contrast: thick black borders, hard
     offset shadows, flat saturated colour, chunky type. For bold, confident,
     attention-grabbing interfaces.
   - **glassmorphism** — frosted, translucent, layered: soft blur, hairline
     borders, generous rounded corners. Needs a busy, non-uniform backdrop to
     read — **don't pick it for a plain white app**, it goes invisible on a flat
     fill.
   - **swiss** — quiet, precise, content-first: near-monochrome ink on white,
     hairline borders, crisp corners, a single hazard-orange accent. For calm,
     understated, information-dense interfaces.

3. **Any brand you have to match?** Existing colours, a logo, a product whose
   look you're extending. If yes, reassure them we'll *override the palette* in
   `tokens.css` to match — aronia's palette is built to be overridden — not
   fight it.

4. **Where do we start?** One screen or one flow, not the whole app. A concrete
   first target keeps the direction honest.

## Close the gate

Say back what you heard as a single-line brief, e.g.:

> "A calm, content-first dashboard in **swiss**, matching your existing brand
> blue, starting with the settings screen."

Get an explicit yes. Only then run `npx aronia add …` and pick up from
[AGENTS.md](./AGENTS.md).

**Two rules for this conversation:**
- **Recommend, don't survey.** If they're unsure, choose the family that best
  fits what they described and tell them *why* — don't hand a non-designer a menu
  and make them decide blind.
- **Their words, not jargon.** "Clean and calm" is a real answer; translate it to
  swiss yourself. Don't ask which radius or accent they want.
