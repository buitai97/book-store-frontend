# Book Store Frontend

Production-ready frontend for an online bookstore with customer-facing shopping flows and an admin management area.

Live demo: `https://book-store-zeta-orpin.vercel.app/`

## Overview

This project is a React + TypeScript SPA built with Vite. It provides:

- Customer pages for browsing books, viewing details, ordering, and checking order history.
- Authentication and account management flows.
- Admin pages for managing books, users, and orders.
- Integration with a backend API using Axios and token-based auth.

## Key Features

- Public storefront: home, about, book details, and order pages.
- Auth flow: login, register, logout, and account fetch.
- Customer account: profile update, password change, and user management modal.
- Admin console: dashboard, user CRUD, book CRUD, and order management.
- File upload support for media (for example, book images).
- Responsive UI using Ant Design components and custom SCSS styling.

## Tech Stack

- React 18
- TypeScript 5
- Vite 5
- React Router 6
- Ant Design 5
- Axios
- Sass (SCSS)
- ESLint 9

## Project Structure

```text
src/
	components/
		admin/        # Admin UI modules (book, user, order)
		auth/         # Route protection/auth helpers
		client/       # Customer-facing modules
		context/      # Global app context/providers
		layout/       # Shared layout/header components
		pages/        # Route-level pages (admin + client)
	services/       # API layer and Axios customization
	styles/         # Global and feature-scoped SCSS styles
	types/          # Global and module type declarations
	layout.tsx      # Root app layout
	main.tsx        # App entry point and route registration
```

## Getting Started

### 1. Prerequisites

- Node.js 18+ (recommended)
- npm 9+

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
VITE_BACKEND_URL=http://localhost:8080
```

`VITE_BACKEND_URL` is required and is used as the Axios `baseURL`.

### 4. Start Development Server

```bash
npm run dev
```

Default local URL: `http://localhost:3000`

## Available Scripts

- `npm run dev`: Start local Vite dev server.
- `npm run start`: Alias for `dev`.
- `npm run build`: Type-check and build production assets.
- `npm run preview`: Preview production build locally.
- `npm run lint`: Run ESLint checks.

## Routing Summary

- Public routes: `/`, `/about`, `/book/:id`, `/order`, `/login`, `/register`
- Protected customer routes: `/history`, `/checkout`
- Protected admin routes: `/admin`, `/admin/book`, `/admin/order`, `/admin/user`

## API Integration Notes

- All API calls are centralized in `src/services/api.ts`.
- Axios instance is configured in `src/services/axios.customize.ts`.
- Bearer token is read from `localStorage` key: `access_token`.
- Requests include credentials (`withCredentials: true`) for cookie-based flows.

## Deployment

The project is configured for Vercel with SPA rewrites via `vercel.json`:

- All paths are rewritten to `/` to support client-side routing.

Build command:

```bash
npm run build
```

## Author

- Tai Bui
- Website: `https://taibui.xyz`
