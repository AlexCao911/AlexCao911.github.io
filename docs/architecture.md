# Personal Website Architecture

## Goal

Build a modern personal website with three primary modules: Home, Gallery, and Notes. The visual language follows ReactBits-style animated UI: dithered background, bubble navigation, hanging lanyard contact card, magnetic line field, cube header, and scrambled text footers.

## Stack

- Vite + React + TypeScript for a lightweight static-friendly frontend.
- Plain CSS with component-scoped class naming for fast iteration and no framework lock-in.
- Vitest + React Testing Library for route and content regression coverage.
- Local ReactBits-inspired components under `src/components/reactbits`.

## Routes

- `/` renders Home with the dither background and personal introduction.
- `/gallery` renders a Magnet Lines hero and a grid of work cards.
- `/gallery/:slug` renders a single work detail page.
- `/notes` renders a Cubes hero and a list of blog/note entries.
- `/notes/:slug` renders a single note detail page.

## Modules

- `src/data/profile.ts`: owner identity and contact details.
- `src/data/gallery.ts`: work cards and detail content.
- `src/data/notes.ts`: note summaries and article content.
- `src/components/navigation/BubbleNavigation.tsx`: top navigation shell with logo, page links, and lanyard contact.
- `src/components/reactbits/*`: local implementations of the requested ReactBits-style effects.
- `src/pages/*`: page-level layout and composition.

## Visual Direction

The UI should feel creative, technical, and restrained: black ink, warm paper, electric cyan, tomato red, and lime accents instead of a one-note purple/dark-blue palette. Animated effects should add texture without blocking reading or navigation.

## Verification

- Unit tests cover visible routing, navigation, gallery detail, notes detail, and contact information.
- Build verification uses `npm run build`.
- Visual verification uses the local dev server and browser screenshots at desktop and mobile widths.
