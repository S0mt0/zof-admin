# Zita Onyeka Foundation CMS

Admin dashboard and API server for the Zita Onyeka Foundation website. This project manages the content, media, donations, and public API data consumed by the public frontend app, `zof-v2`.

## Overview

The CMS provides:

- Authenticated admin dashboard
- Public API routes for the website
- Landing page section management
- About page section management
- Blog and article management
- Event and programme management
- Photo gallery/media management
- Donation campaigns and donation records
- Paystack donation initialization, verification, and webhooks
- Contact messages
- Foundation settings and social/contact information
- Team and volunteer management
- Rich text editing with TipTap
- S3 media uploads
- Email receipts and thank-you messages

## Tech Stack

- Next.js 14
- React 19
- TypeScript
- Prisma 6
- MongoDB
- NextAuth v5
- Tailwind CSS
- Radix UI
- TipTap
- dnd-kit
- AWS S3
- Paystack
- Nodemailer / Resend
- jsPDF

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create `.env` from the example file:

```bash
cp .env.example .env
```

Generate Prisma client:

```bash
npx prisma generate
```

Run the development server:

```bash
pnpm dev
```

The CMS usually runs on port `3000`. The public frontend should point to it with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Environment Variables

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | MongoDB connection string used by Prisma. |
| `AUTH_SECRET` | NextAuth secret. Required in production. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |
| `DEFAULT_ADMIN_EMAILS` | Comma-separated emails that should become admins automatically. |
| `APP_URL` | CMS base URL. Example: `http://localhost:3000`. |
| `FRONTEND_BASE_URL` | Public frontend URL. Used for redirects and allowed origins. |
| `GOOGLE_APP_USER` | Gmail SMTP sender account. |
| `GOOGLE_APP_PASSWORD` | Gmail app password for SMTP. |
| `RESEND_API_KEY` | Resend API key for transactional email support. |
| `AWS_KEY` | AWS access key for S3 uploads. |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 uploads. |
| `AWS_REGION` | AWS S3 region. |
| `AWS_S3_BUCKET_NAME` | S3 bucket name. |
| `PAYSTACK_SECRET_KEY` | Paystack secret key for donations. |

Do not commit `.env`.

## Scripts

```bash
pnpm dev        # Start local dev server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm typecheck  # Run TypeScript checks
pnpm lint       # Run lint command
pnpm db:push    # Generate Prisma client and push schema to MongoDB
```

Use `pnpm db:push` only when you intentionally want to update the database schema.

## Dashboard Sections

Main dashboard areas include:

- Dashboard overview
- Landing page sections
- About page sections
- Blogs and articles
- Events and programmes
- Photo gallery/media
- Contact information and messages
- Donation page, campaigns, and donation management
- Settings
- Profile

The page-section structure is intentionally modular. Each website page has dashboard subroutes for the sections it owns.

## Public API Routes

The frontend consumes public API routes such as:

- `GET /api/landing`
- `GET /api/about`
- `GET /api/blogs`
- `GET /api/blogs/:slug`
- `GET /api/events`
- `GET /api/events/:slug`
- `GET /api/media`
- `GET /api/info`
- `GET /api/settings`
- `GET /api/teams`
- `GET /api/volunteers`
- `GET /api/testimonials`
- `GET /api/faqs`
- `POST /api/message`
- `POST /api/blogs/comment`
- `POST /api/events/comment`
- `POST /api/donations/initialize`
- `GET /api/donations/verify`
- `POST /api/donations/webhook`

Public API routes must not be blocked by dashboard authentication middleware. If they are protected, the frontend will receive an HTML login redirect instead of JSON.

## Prisma

The app uses Prisma with MongoDB. The schema lives at:

```text
prisma/schema.prisma
```

Common commands:

```bash
npx prisma validate
npx prisma generate
pnpm db:push
```

After changing composite types or models, run validate and generate before building.

## Donations

Donation features include:

- Donation page aside/copy management
- Campaign CRUD and reordering
- Paystack transaction initialization
- Transaction verification
- Paystack webhook handling
- Donation table with search, filters, ordering, pagination, bulk selection, and deletion
- PDF/CSV export
- Email receipts and thank-you messages

Enabled Paystack channels are configured in `lib/utils/paystack.ts`.

## Media Uploads

Media and page images are uploaded to S3. Required environment variables:

```bash
AWS_KEY=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
```

The gallery supports uploaded images/videos and external video URLs such as YouTube links.

## Email

The CMS can send emails through Gmail SMTP and Resend. Donation receipts and thank-you messages are generated from reusable email templates and may include receipt PDF attachments.

Required variables depend on the sender used:

```bash
GOOGLE_APP_USER=
GOOGLE_APP_PASSWORD=
RESEND_API_KEY=
```

## Auth and Roles

Authentication is powered by NextAuth. Admin access is role-based. Emails listed in `DEFAULT_ADMIN_EMAILS` are promoted automatically during signup/login flows.

Donation management and other sensitive dashboard areas should remain admin-only.

## Deployment Notes

For production, configure at least:

```bash
DATABASE_URL=
AUTH_SECRET=
APP_URL=https://admin.zitaonyekafoundation.org
FRONTEND_BASE_URL=https://www.zitaonyekafoundation.org
PAYSTACK_SECRET_KEY=
AWS_KEY=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
```

Also configure email variables if receipts, thank-you emails, password reset, or contact workflows should send mail.

After deployment, confirm:

- Public API routes return JSON without auth redirects.
- Paystack callback and webhook URLs are correct.
- S3 uploads work.
- Donation receipt emails are delivered.
- Prisma client was generated during install/build.

## Related Project

The public website lives in `zof-v2`. It consumes this CMS through `NEXT_PUBLIC_API_BASE_URL` and renders the public pages.
