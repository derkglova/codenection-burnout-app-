# Raycast Design System

A dark-canvas developer-tools marketing system, reconstructed from a single design-analysis document (no Figma file, codebase, or asset export was provided).

**Source:** `uploads/DESIGN-raycast.md` — a structured design-analysis of Raycast's marketing site (raycast.com), covering `/` (home), `/store`, `/core-features/ai`, `/pricing`, and `/thomas/hacker-news` (an extension detail page). No Figma link, GitHub repo, or codebase path was given — everything here is derived from that one markdown spec's color/type/component tables and prose description. There is no logo file, icon set, or screenshot in the source materials.

## Company & product context

Raycast is a macOS command-palette / launcher app (a Spotlight-style productivity tool) with an extension store and an AI feature. The design system captures its **marketing website** — the chrome that sells the product — not the in-product macOS app UI itself (the source document explicitly separates the two and only documents the former). The site's core surfaces per the source: a home page, an extension store/marketplace, a feature deep-dive page (AI), a pricing page, and individual extension detail pages.

## Content fundamentals

- **Tone:** direct, feature-first, no fluff. Headlines describe what the product does ("Your shortcut to everything") rather than abstract brand language.
- **Casing:** sentence case throughout headings and body copy; button labels are short imperative verbs ("Download", "Install Extension", "Get Pro", "Sign in").
- **Voice:** second person is implicit in CTAs ("Get Pro") rather than "we" language — the product speaks through its own UI (command-palette mockups) more than through marketing prose.
- **Emoji:** none. The system has no documented emoji usage anywhere in chrome or copy.
- **Numbers/labels:** plan names are plain (Free / Pro / Pro+Advanced AI); feature names are literal product nouns (Quicklinks, Clipboard History, Snippets) rather than benefit-speak taglines.

## Visual foundations

- **Color:** one continuous dark mode, no light variant. A 4-step near-black surface ladder (`canvas` #07080a → `surface` #0d0d0d → `surface-elevated` #101111 → `surface-card` #121212) builds all elevation. White (`primary` #ffffff) is the single, universal CTA color — never a second accent. Saturated accents (yellow/red/green/blue) exist only inside extension/feature illustrations, never on chrome, buttons, or text.
- **Type:** Inter, site-wide, with `font-feature-settings: "calt","kern","liga","ss03"` — the `ss03` stylistic set (alternate single-story `g`) is the brand's signature typographic detail. Display type additionally swaps in `ss02`/`ss08` and drops `liga`. Letter-spacing is consistently positive (0.1–0.4px), giving an airy quality despite the dark canvas.
- **Backgrounds:** no photography. The only imagery is full-fidelity screenshots of Raycast's own command-palette / store / AI-chat UI — "the marketing page is the product." No hand-drawn illustration, no repeating pattern/texture, no photographic gradients.
- **The one gradient:** a red diagonal-stripe band (`#ff5757` → `#a1131a`) across the very top of the home-page hero — a launch-banner motif used once per page maximum. A smaller echo repeats at the top of the footer. No gradients elsewhere.
- **Animation:** not documented in the source (no easing/duration values given). Treat interactive states as instant/CSS-default until real motion specs are available.
- **Hover states:** explicitly undocumented by the source ("No hover states documented per system policy"). Only default and pressed/active states are specified.
- **Press states:** color-based, not scale-based — the primary button dims one notch to `primary-pressed` (#e8e8e8) on press; no shrink/scale transforms are documented.
- **Borders:** a single hairline system — 1px `hairline` (#242728) on every card edge, `hairline-soft` (8% white) on translucent overlays, `hairline-strong` (16% white) for emphasis dividers and focus states.
- **Shadows:** none. The system has zero drop-shadow elevation — depth comes entirely from the surface-color ladder.
- **Transparency/blur:** transparency appears only as soft accent tints (`accent-*-soft` at 15% alpha) and the two hairline-soft/strong border variants — no blur/backdrop-filter usage is documented.
- **Imagery color vibe:** n/a — no photography in the system; the only "imagery" is UI screenshots and small flat app icons.
- **Corner radii:** cluster tightly at 6–16px (never 0 on cards, never above 16px except full pills). `sm` 6px for keycaps/rows, `md` 8px for buttons/inputs/small cards, `lg` 10px for feature/pricing cards, `xl` 16px for the hero command-palette mockup container.
- **Cards:** flat surface fill + 1px hairline border + one of the four radii above. No shadow, no colored left-border accent. Elevation cue (if any) is a one-notch-lighter background, not a shadow or border color change.
- **Layout:** ~1240px max content width, 96px vertical rhythm between sections, no decorative dividers — the dark canvas runs continuous edge-to-edge from hero to footer.

## Iconography

**No icon assets were provided in the source.** The design-analysis document is prose/YAML only — it describes app-icon tiles (Slack, Spotify, Figma, Notion, Linear, Hacker News) and command-palette glyphs but contains no actual SVG/PNG/icon-font files to copy. Per design-system policy, no icons were fabricated.

- `AppIconTile` is shipped as an empty frame (48px/64px rounded square) — pass a real app-icon image as its child when you have one.
- The keyboard-shortcut `Keycap` glyph renders as styled text (e.g. `⌘`, `Esc`) rather than an icon — this matches the source, which describes keycaps as text-in-a-pill, not glyphs.
- No icon font, sprite sheet, or CDN icon set (Lucide/Heroicons/etc.) is referenced by the source, so none was substituted. If Raycast's real marketing site uses a specific icon set, provide it and this system can be updated to reference it directly.
- No emoji or Unicode-symbol icons are used per the source's content fundamentals.

## Assets

**No logo file, brand mark, product screenshot, or illustration was included in the source materials.** `assets/` is intentionally empty. Everywhere a Raycast wordmark/mark would appear (nav, footer, thumbnail), this system renders the plain-type name "Raycast" in Inter rather than inventing a logo — per design-system policy, brand marks are never drawn from memory.

## Intentional additions

None. Every component in this system corresponds to a named entry in the source's `components:` table (button-primary/secondary/tertiary/install, text-input, store-search-bar, pill-tab, badge-pro/info, keycap, command-palette-card/row, feature-card, store-extension-card, pricing-tier-card, hero-stripe-band, app-icon-tile, primary-nav, footer-section, link-inline). No component families were added beyond that inventory.

## Components

Grouped by concern under `components/`:

- **forms/** — `Button` (primary/secondary/tertiary/install variants), `TextInput` (default/search variants)
- **feedback/** — `Badge` (pro/info), `PillTab` (filter chip, active state)
- **cards/** — `FeatureCard`, `StoreExtensionCard`, `PricingTierCard`, `CommandPaletteCard` + `CommandPaletteRow`
- **decorative/** — `AppIconTile`, `Keycap`
- **navigation/** — `PrimaryNav`, `FooterSection`
- **inline/** — `LinkInline`
- **hero/** — `HeroStripeBand`

## UI kit

`ui_kits/marketing-site/` — an interactive click-through recreation of the marketing site: Home (hero + feature rows), Store (search + extension grid), Pricing (tier grid), and an Extension Detail page, all composed from the components above.

## Foundations & guidelines

`guidelines/` — specimen cards for the Colors, Type, Spacing, and Brand groups shown in the Design System tab (surface ladder, text colors, category accents, hero stripe gradient, type scale, ss03 toggle, spacing scale/rhythm, radius scale, elevation, hairline borders).

## File index

```
styles.css                      global stylesheet entry (imports tokens/)
tokens/colors.css                color custom properties
tokens/typography.css            Inter font load + type-scale custom properties
tokens/spacing.css                spacing scale
tokens/radius.css                corner-radius scale
components/forms/                Button, TextInput
components/feedback/             Badge, PillTab
components/cards/                FeatureCard, StoreExtensionCard, PricingTierCard, CommandPaletteCard, CommandPaletteRow
components/decorative/           AppIconTile, Keycap
components/navigation/           PrimaryNav, FooterSection
components/inline/                LinkInline
components/hero/                 HeroStripeBand
guidelines/                      foundation specimen cards
ui_kits/marketing-site/          Home, Store, Pricing, ExtensionDetail screens + index.html
thumbnail.html                   project tile
SKILL.md                          Claude-Code-portable skill file
```

## Caveats

- Built from a single markdown design-analysis document — no Figma, codebase, or real asset export was available. Colors/type/spacing are exact per that document; layout details beyond what it specifies (exact grid breakpoints, hover states, animation timing) are reasonable defaults, not verified against the live site.
- No logo, icons, or screenshots exist in this system — see Iconography/Assets above.
- Hover states and motion/easing are explicitly out of scope per the source document.

**Ask:** if you have access to Raycast's actual site code, a Figma file, or exported logo/icon assets, attach them and this system can be corrected against ground truth — especially the logo, real app icons, and any hover/motion behavior the current source doesn't document.
