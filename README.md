# Harnix landing page

Implementation of `Harnix Landing.dc.html` from the Claude Design handoff, built
as a Next.js App Router site with Tailwind v4.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
npm run typecheck
```

Copy `.env.example` to `.env.local` to set the site URL, milestone, demo status
and lead destination.

## Layout

| Path | What's in it |
| --- | --- |
| `components/root-shell.tsx` | `<html>`/`<body>`, Be Vietnam Pro, GA |
| `components/pages/*` | Home, blog index and blog post page shells |
| `components/sections/*` | One file per home-page section |
| `app/globals.css` | Design tokens (night/paper/accent), keyframes, reveal utilities |
| `lib/copy.ts` | All copy, VI and EN, same shape (`Copy` type) |
| `lib/config.ts` | Env-driven knobs: pricing/chat flags, demo video, docs, socials |
| `content/posts/*.mdx` | Blog posts (VI body, then `{/* en */}`, then EN body) |
| `components/mdx-components.tsx` | Post typography plus `<Summary>`, `<Points>`, `<Compare>` |
| `design/` | Earlier handoff bundle |

## Redesign (Oct 2026)

Implements `Harnix Landing.dc.html` and `Harnix Blog Post.dc.html` from the
"Harnix UI redesign" Claude Design handoff.

- **One font, fixed palette.** Be Vietnam Pro for everything (no mono). The
  page alternates night (`#0d1014`) and paper (`#fafafa`) sections with the
  xanh ngọc accent (`#0f8f6a` / `#47c496` on dark), so the theme toggle is gone.
- **Pricing is hidden** until the pricing model is settled. The section is
  intact in `components/sections/pricing.tsx`; `NEXT_PUBLIC_PRICING_ENABLED=true`
  brings back the section, the "Bảng giá · Từ 2,9 triệu/tháng" nav item, the
  footer link and the pricing FAQ answer. While off, the nav shows "Hỏi đáp"
  and the FAQ says pricing is being finalised.
- **Chat launcher** ("Hỏi Harnix") is built but off (`NEXT_PUBLIC_CHAT_ENABLED`)
  — it is UI only. Back-to-top is always on.
- **Leads.** The demo form posts to `/api/partner` as before (same envelope,
  `eventType: "partner.submitted"`). Payload is now
  `name, phone, email, company, size, want` — **`phone` is new, `app` is gone**;
  the Apps Script/Sheet needs a `phone` column. The client now also sends
  `locale`, `page` and the honeypot. The waitlist form is removed from the
  page; `/api/waitlist` still works.
- **Blog.** Posts gain `tag`, `cover` (`run` | `data` | `console`) and `tags`
  frontmatter (EN overrides under `en:`). The post page builds its table of
  contents from `##` headings. MDX runs with JS expressions blocked, so the
  custom blocks take string props:

  ```mdx
  <Summary>

  1. Point with **bold**.

  </Summary>

  <Compare labels="Tình huống|Không có Run|Có Run" caption="Hình 1.">
    <Row cells="Sự cố|Mất hết|Chạy tiếp" />
  </Compare>
  ```

## Decisions worth knowing

**Tokens are verbatim.** Every colour, radius, type size and spacing value comes
from the design file, including the odd ones (`14.5px`, `11.5px`, `#70707a`).
They live as CSS custom properties in `app/globals.css` and are exposed to
Tailwind through `@theme inline`, so `bg-surface2` and `text-text3` resolve to
the same variables the light theme overrides. Verified against the prototype:
`#0c0c0d` body, `56px/1.04/-0.03em` h1, `1160px` container with `24px` gutters,
`12px` card radius on `#141416` / `#26262a`, mono at `11.5px/1.75`.

**Dark is the default**, switched only by explicit choice — the OS
`prefers-color-scheme` is deliberately not consulted, matching the design. The
choice is stored in `localStorage` and applied by an inline script before first
paint, so there is no flash. (To respect the OS setting instead, change the
`bootstrap` string in `app/layout.tsx`.)

**Both languages are complete.** The brief's §9.1 only asked for an English nav
and hero, but a half-translated page reads as broken, so `lib/copy.ts` carries a
full pair — including the FAQ, demo chapters, run trace, operate cards and blog
cards. What deliberately stays untranslated: proper nouns, code and identifiers
(`user_message`, `gpt-4o-mini`, `run_8c41f2`), the system's own state words
(`completed`, `running`, `measured`), the product UI labels inside the console
mock (`Run trace`, `Step detail`, `Tokens in/out`), the sample document's file
name, and terms of art Vietnamese uses untranslated anyway (agent, knowledge
base, token, Run, trace, API key, widget, backend, frontend, waitlist, design
partner, milestone codes). A blog post without an `en` block keeps its
Vietnamese title — the article itself is Vietnamese, so that is the honest
fallback.

**The prototype chrome is gone.** The amber state switcher was a design-review
tool, so the states it faked are now real:

- the blog fetches `/api/posts` and renders loading / loaded / empty / error on
  its own, with a working retry;
- both forms validate client-side and POST for real, showing sending, success
  and server-error states from the response;
- the demo's coming-soon / ready split is `NEXT_PUBLIC_DEMO_STATUS`.

**Leads have no CRM yet.** `lib/leads.ts` POSTs each submission to
`LEADS_WEBHOOK_URL` if set, and otherwise logs it server-side while still
returning success. Swap that one function for the real integration.

**Accessibility.** The tabs, accordion, segmented controls and form errors carry
real ARIA (`role="tablist"`, `aria-expanded`, `aria-pressed`, `aria-invalid` +
`aria-describedby`), there is a skip link, the wordmark's dotless `ı` is hidden
from assistive tech behind an `sr-only` "Harnix", and `prefers-reduced-motion`
disables the pulse, shimmer and spinner. Checked for horizontal overflow at 390,
768 and 1440px.

**SEO lives in the route conventions.** `app/robots.ts`, `app/sitemap.ts` and
`app/manifest.ts` generate `/robots.txt`, `/sitemap.xml` and the web manifest;
`/api` is disallowed, and the sitemap lists only `/` because that is the only
route that exists. `components/structured-data.tsx` emits one JSON-LD graph —
Organization, WebSite, FAQPage — built from `lib/copy.ts` and `lib/config.ts`,
so editing a FAQ entry updates the markup with it. The blog rows are passed to
the section from the server (`<Blog initialPosts={posts} />`) so the titles and
excerpts are in the first HTML response rather than behind a client fetch.

## Still outstanding

- **Screenshots.** The hero console frame and the demo poster are DOM
  recreations, as they were in the prototype. Swap in real captures.
- **`/blog` routes.** `content/posts.ts` points at `/blog/<slug>`, and the blog
  section and footer both link to `/blog`; those pages are not part of the
  landing page and do not exist yet, so every one of those links is a 404 that
  crawlers will follow. Until they ship this is the largest remaining SEO
  liability on the page — either build the routes (then add them to
  `app/sitemap.ts`, which has the snippet commented in) or drop the links.
- **Demo chapter timings.** `chapters[].at` in `lib/copy.ts` is placeholder
  spacing; replace with real marks when the video is cut. They only surface once
  `NEXT_PUBLIC_DEMO_STATUS=ready`.
- **Outlined-wordmark SVG.** Still needs real font outlines; the lockups here are
  live text.
- **Integration snippets** in the developer section are illustrative, and the
  section says so. The API contract is not settled.
