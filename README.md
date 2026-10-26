# ידיים ירוקות / Green Hands website

A static one-page marketing site, in Hebrew at `/` and English at `/en/`, hosted on Netlify.

## Commands
- `npm run dev`: build to `dist/` and preview at http://localhost:5173. Form posts are accepted locally and logged to the terminal.
- `npm run build`: build `dist/`. This is what Netlify runs, and it needs no dependencies.
- `npm run images`: regenerate WebP sizes, favicons and the OG image after changing `photos-src/`. Needs `npm install` first. Commit the outputs.

## Where things live
- Copy: `src/i18n/he.json`, `src/i18n/en.json`. A FAQ answer starting with `[` is a placeholder and is not rendered.
- Markup: `src/page.mjs` · styles: `src/styles.css` · behaviour: `src/main.js`
- Design reference: `../design-handoff/`

## Quote form
Netlify Forms picks up `<form name="quote" data-netlify="true">` at deploy. Submissions appear under the site's **Forms** tab. Set up email notifications to ghands.sam@gmail.com in Site configuration → Notifications → Emails and webhooks → Form submission notifications.

## Domain
Netlify sets `URL` during the build, and that drives canonical, hreflang, OG and the sitemap. After adding a custom domain and making it primary, redeploy.
