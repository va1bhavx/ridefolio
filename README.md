# Ridefolio MVP-0

A frontend-only motorcycle discovery and ownership prototype. Built in the existing Next.js project with App Router, React, strict TypeScript, Tailwind 4 and the supplied shadcn Base UI `base-nova` configuration.

## Run

Use Node.js 22+ and pnpm (lockfile generated with pnpm 11).

```sh
pnpm install
pnpm dev
```

Open the Local URL printed by Next.js. Reuse an existing dev server for this checkout. No API keys, database or environment variables are needed. The first production build downloads Google fonts; the app serves them locally afterwards.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

## Try the product

- Explore `/motorcycles`, filter manufacturers and years, open a model, then compare at `/compare`.
- Read nine topic guides through `/knowledge`.
- At `/login`, select **Explore the demo garage**, or enter `demo@ridefolio.app` / `Ridefolio123!`.
- The demo has two motorcycles, fuel history, expenses, services and reminders. Register a new local account to try an empty garage.
- Add, edit and remove motorcycles and ownership records. Fuel and service costs appear automatically in Expenses. Removal dialogs explain linked-record effects.
- Settings controls theme, display name and overview reminders. Metric/INR units are fixed for MVP-0.
- Feedback is saved locally and explicitly **not sent** anywhere.

## Architecture

```text
src/app/                 Server route entries and public/auth/dashboard route groups
src/components/ui/       Registry-generated shadcn / Base UI primitives
src/components/          Layout, navigation, feedback and shared presentation
src/features/            Feature components, schemas, hooks and pure calculations
src/services/interfaces/ Replaceable catalogue, ownership and auth contracts
src/services/mock/       Centralised catalogue, articles and ownership fixtures
src/services/            Mock services and persistence adapter
src/types/               Explicit domain models
src/lib/                 Indian formatters, validation and utilities
public/                  Locally served photography and PWA icons
 tests/                  Node test runner tests executed with tsx
```

Route entries fetch public content through the catalogue repository. Interactive features receive typed data. TanStack Query owns session/ownership reads and invalidation; there is no extra global state container. `services/persistence.ts` is the only application module accessing localStorage. Keys are versioned; ownership data is scoped by local user ID.

The ownership repository is a small typed CRUD contract. Feature editors own their schemas and domain rules. The shared record editor handles React Hook Form wiring, accessible shadcn dialogs and feedback. Native labelled selects and date inputs complement shadcn primitives.

## Domain conventions

- **Mileage:** sort one motorcycle's refills by odometer. The first full tank anchors an interval; every subsequent litre, including partial fills, counts until the next full tank. Exclude the opening tank's litres. Aggregate distance divided by aggregate interval litres produces the weighted result. Incomplete intervals show no estimate. Accuracy depends on complete records and consistent filling.
- **Expenses:** combine manual expenses, fuel and services at read time. Never create duplicate manual fuel/service entries. Edit source records in their own sections.
- **Odometer:** new fuel/service readings can advance the garage reading. Editing or deleting historical records does not rewind it. Fuel forms reject duplicate readings and contradictory chronology.
- **Reminders:** date or optional absolute odometer threshold, whichever is first. In-app only; completing one does not imply a service was performed.
- **Dates:** local calendar ISO dates, formatted for India. Recorded activity cannot be future-dated; reminders can.

## Design and accessibility

Semantic CSS variables define both themes. Geist is the interface font, Manrope supplies editorial headings, and Geist Mono presents technical values. The supplied icon registry remains unchanged; product components use Lucide. Desktop ownership uses a sidebar; mobile uses a bottom bar with a dialog for secondary navigation. Technical tables scroll inside their containers.

The app includes a skip link, semantic headings, labels, visible keyboard focus, live validation feedback, focus-managed Base UI dialogs and reduced-motion styles. Include assistive-technology testing before a production release.

## PWA

`src/app/manifest.ts` supplies name, scope, standalone display, theme colour, 192/512 icons and a maskable icon. Settings offers installation when supported, otherwise browser guidance. Serve over HTTPS in deployment; localhost is valid for development. No service worker is installed, so private data is not cached by one. Offline synchronisation and push notifications are outside this phase.

## Demonstration limits and backend integration

Catalogue years, variants and specifications are **illustrative baselines**, not verified model-year facts. Photos are representative and labelled. Replace them with verified information and properly licensed model-specific assets before publication. No manufacturer maintenance intervals are fabricated.

Mock authentication demonstrates the flow only. Local salted password digests avoid plaintext storage but provide no production security; client guards are not access control. Use unique demo passwords and avoid sensitive information. Clearing browser site data removes accounts and records. There is no recovery, sync or backup.

For Node/Express + PostgreSQL integration, implement the repository contracts with HTTP clients and replace service bindings. Enforce authentication, authorisation, schema validation, ownership checks, transactional writes and duplicate prevention on the server. Replace browser credentials with secure sessions. Preserve source-linked expense semantics. Add data migrations and conflict handling before multi-device use.

## Assets

Illustrative Unsplash photography is served locally:

- `classic.jpg`: https://images.unsplash.com/photo-1558981806-ec527fa84c39
- `adventure.jpg`: https://images.unsplash.com/photo-1558981403-c5f9899a28bc
- `sport.jpg`, `street.jpg`: https://images.unsplash.com/photo-1568772585407-9361f9bf3a87

No runtime external API or image dependency. Monogram and PWA icons are local project assets.

## Verification

- Production build: passed; 38 generated pages including the ten models and nine articles.
- TypeScript strict check, ESLint and seven automated tests: passed.
- Automated tests cover full/partial refill maths, incomplete intervals, weighted mileage, linked expense totals, due thresholds, validation, local authentication, user isolation and cascade deletion.
- Browser checks exercised demo login, dashboard totals, rejected invalid fuel input, saving/removing a fuel record, selected-bike quick actions and dark theme.
- At 390 px, checked overflow on catalogue, model detail, article, comparison, fuel, overview, maintenance and feedback. Desktop landing and mobile dark comparison were visually inspected.
- Browser automation intermittently timed out; this is representative QA, not exhaustive cross-browser or assistive-technology certification. Native installation on a physical device was not tested.
