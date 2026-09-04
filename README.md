# Promoters — Erickson Coaching Greece Questionnaire

Branded campaign-intake questionnaire for Erickson Coaching Greece.

The form is intentionally simple:

1. Maria completes the questionnaire.
2. Conditional questions only appear when relevant.
3. Progress is autosaved locally in the browser (`localStorage`).
4. On submit, a Next.js API route sends one formatted email to `info@promoters.gr` via Resend.
5. No database or permanent response storage is used.

## Stack

- Next.js 15 / React 19
- TypeScript
- Custom CSS using the Promoters visual identity
- Resend for transactional email
- Vercel-ready

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Create these in `.env.local` locally and in **Vercel → Project → Settings → Environment Variables** after deployment:

```env
RESEND_API_KEY=re_xxxxxxxxx
FORM_FROM_EMAIL=Promoters <forms@your-verified-domain.gr>
FORM_TO_EMAIL=info@promoters.gr
```

`FORM_TO_EMAIL` already falls back to `info@promoters.gr`, but keeping it as an environment variable makes future reuse easier.

### Important: sender domain

The value used in `FORM_FROM_EMAIL` must be a sender/domain that your Resend account is allowed to send from. Verify the chosen domain in Resend before using the form in production.

## Deploy to Vercel

1. Import this GitHub repository into Vercel.
2. Keep the default Next.js build settings.
3. Add the three environment variables above.
4. Deploy.
5. Submit one test form and confirm that the message arrives at `info@promoters.gr`.

## Editing questions

All questions live in:

`data/questions.ts`

Each question defines its type, required status, options, optional selection limit and optional conditional logic. You can change copy or options without touching the questionnaire UI.

## Email output

The email is rendered as a readable campaign brief, grouped by section. A plain-text fallback is also sent.

## Privacy / storage

- No database is used.
- Draft answers are stored only in the respondent's browser until successful submission.
- Draft data is removed after a successful submit.
- A hidden honeypot field is included to reduce automated spam.
- Search engines are instructed not to index the questionnaire.
