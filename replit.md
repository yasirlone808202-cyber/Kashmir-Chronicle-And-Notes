# Kashmir Portal

## Overview

A comprehensive website about Kashmir featuring history, current data, and JK BOSE study notes by Yasir Ferooz.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Routing**: Wouter
- **UI Components**: shadcn/ui (Radix)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (available but not used yet)

## Features

### Kashmir Information
- Animated intro splash screen with Yasir Ferooz name and photo
- Complete Kashmir history timeline (Ancient to Present)
- Community discussion and contribution system (localStorage)
- Population, vehicle, religion demographics with charts
- How religions emerged in Kashmir

### Study Notes Portal
- Class 11th and 12th sections (JK BOSE)
- Subject subsections: Physics, Chemistry, English
- Admin panel (password: yasir123) to upload/edit notes
- Payment system: 5 rupees per lesson via FamPay UPI (8082029582@fam)
- Download in PDF and TXT formats with "Yasir Ferooz" watermark
- Study-friendly animated interface

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/kashmir-portal run dev` — run frontend locally
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Project Structure

- `artifacts/kashmir-portal/` — Main React frontend
- `artifacts/api-server/` — Express API server
- `lib/` — Shared libraries (db, api-spec, etc.)
- `attached_assets/` — User uploaded assets
