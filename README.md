# AI/ML Engineer Roadmap Platform

Full-stack roadmap tracker built with Next.js App Router, TypeScript, Tailwind, Prisma/PostgreSQL, NextAuth, Zustand, React Query, and D3.

## Implemented Features

- Credentials-based authentication via NextAuth
- Prisma schema for users, roadmaps, phases, topics, projects, progress, resources, top projects
- Default roadmap auto-created on first `/api/roadmaps` fetch
- Interactive roadmap page with:
  - collapsible phases/topics
  - D3 mini tree map
  - progress-aware topic cards
- Topic detail view:
  - progress status toggle (`not_started -> in_progress -> completed -> mastered`)
  - notes support
  - resources add/list
  - projects and skills
- Resource manager:
  - CRUD endpoints
  - search + type filter UI
  - file upload endpoint (Vercel Blob)
- Analytics pages:
  - overall completion
  - phase progress charts
  - activity heatmap UI
- Roadmap editor:
  - phase add + reorder (drag-and-drop)
  - clone roadmap
  - export/import JSON (basic)
- Dark mode toggle
- Responsive dashboard shell (sidebar + main content)

## Tech Stack

- Next.js `16` (App Router)
- TypeScript (strict)
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth.js
- Zustand + React Query
- D3.js
- Vercel Blob upload API

## Project Structure

```txt
src/
  app/
    (dashboard)/
    api/
    login/
  components/
  hooks/
  lib/
  stores/
  types/
prisma/
  schema.prisma
  seed.ts
```

## Environment Variables

Set these in your local environment or Vercel project settings:

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
BLOB_READ_WRITE_TOKEN=
```

## Local Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run db:push
npm run db:seed
```

## Notes

- Default roadmap is marked `isDefault: true` and `isEditable: false`.
- Clone the default roadmap before editing.
- File upload requires `BLOB_READ_WRITE_TOKEN`.
