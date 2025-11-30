# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (uses Turbopack)
bun dev

# Build
bun run build

# Lint
bun run lint

# Database
bun prisma:seed              # Seed database
bun prisma generate          # Generate Prisma client
bun prisma migrate dev       # Run migrations
```

## Architecture

This is a **Team Athlete** coaching platform built with Next.js 15 (App Router), using Better-Auth for authentication and Prisma with PostgreSQL.

### Directory Structure

- `app/` - Next.js App Router pages using route groups:
  - `(web)/(public)/` - Public pages (home, auth)
  - `(web)/(private)/(main)/` - Authenticated pages (dashboard, profile)
  - `(web)/(private)/onboarding/` - User onboarding flow
  - `api/` - API routes
- `components/` - Reusable components:
  - `ui/` - Shadcn UI components
  - `features/` - Feature-specific components (Header, Footer, AccessControl)
  - `layout/` - Layout components
- `lib/` - Utilities: auth config, Prisma client, hooks, types
- `src/actions/` - Server actions (user, contract, planning, payment, etc.)
- `src/repositories/` - Database repository pattern implementations
- `prisma/` - Schema and migrations (outputs to `prisma/generated/`)

### Data Model

Core entities: User (with roles: COACH, ADMIN, CLIENT, PROSPECT), Program, Offer, Contract, Planning, Payment, Availability, Notification.

### Authentication

Uses Better-Auth with email/password and Google OAuth. Unonboarded users are redirected to `/onboarding/gender`. Access control based on `UserRole` enum.

## Code Style

- TypeScript with strict mode enabled
- Biome for formatting (tabs, double quotes)
- ESLint with Next.js config
- Tailwind CSS 4 for styling (no CSS files)
- Shadcn UI + Radix primitives
- Zod for validation
- Arrow functions with typed props (`const Component: FC<Props> = () => {}`)
- Event handlers prefixed with "handle" (handleClick, handleSubmit)
- Early returns for readability
- Named exports for components

## Path Aliases

```
@/*           → ./* and ./src/*
@components/* → ./components/*
@lib/*        → ./lib/*
```
