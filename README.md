# TaskEarn – Micro-Task and Earning Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application that lets users complete small tasks and earn rewards. Built with Next.js (client), Express (server), Firebase (auth), and MongoDB.

---

## Live Site & Repositories

- **Website name:** TaskEarn
- **Admin email:** *(Create a user via Register, then set their role to Admin in MongoDB or via another admin in Manage Users)*
- **Admin password:** *(Same as the password you set when registering that user)*
- **Front-end live site link:** *(Deploy client-app to Vercel/Netlify and add URL here)*
- **Client-side GitHub repository link:** *(Your client repo URL)*
- **Server-side GitHub repository link:** *(Your server repo URL)*

---

## Features

- **Role-based access:** Workers complete tasks and earn coins; Buyers create tasks and pay workers; Admins manage users, tasks, and withdrawal requests.
- **User authentication:** Email/password and Google Sign-In via Firebase; JWT stored in localStorage for API access; private routes persist after reload.
- **Worker dashboard:** View total/pending submissions and total earnings; browse available tasks; submit work with proof; withdraw coins (20 coins = $1, minimum 200 coins).
- **Buyer dashboard:** See task count, pending workers, and total paid; add tasks with title, detail, required workers, payable amount, deadline, submission info, and image URL; review pending submissions with Approve/Reject; manage (update/delete) your tasks; purchase coins (Stripe or dummy payment); view payment history.
- **Admin dashboard:** View total workers, buyers, available coins, and payments; approve withdrawal requests (reduces worker coin on approval); manage users (update role, remove user); manage tasks (delete any task).
- **Notifications:** Notifications created on submission approval/rejection (to worker), new submission (to buyer), and withdrawal approval (to worker); view in dashboard sidebar; click to go to relevant route.
- **Responsive layout:** Navbar, footer, home page, and all dashboard sections work on mobile, tablet, and desktop.
- **Home page:** Hero slider (Swiper), Top Workers section, How It Works, Testimonials slider, Why Choose Us, and Call-to-Action; animations with Framer Motion.
- **Environment variables:** Firebase config, API URL, Stripe keys, and MongoDB credentials are read from env (no secrets in code).
- **Pagination:** My Submissions (Worker) uses server-side pagination.
- **No Lorem ipsum:** All copy is meaningful and specific to the platform.

---

## Tech Stack

- **Client:** Next.js 16, React 19, TypeScript, Tailwind CSS, Firebase Auth, Swiper, Framer Motion, Stripe (optional), shadcn/ui
- **Server:** Node.js, Express 5, MongoDB, JWT, Stripe (optional)
- **Auth:** Firebase (email/password + Google); JWT for API authorization

---

## Setup

### Server

```bash
cd server
cp .env.example .env
# Edit .env: DB_USER, DB_PASS, JWT_SECRET, optional STRIPE_SECRET_KEY
npm install
npm run dev
```

Runs at `http://localhost:5000` by default.

### Client

```bash
cd client-app
cp .env.example .env.local
# Edit .env.local: Firebase config, NEXT_PUBLIC_API_URL, optional Stripe/ImageBB keys
npm install
npm run dev
```

Runs at `http://localhost:3000` by default.

### Admin user

1. Register a new account (any role).
2. In MongoDB, set that user’s `role` to `"admin"`, or log in as another admin and use **Manage Users** → **Update Role** → Admin.

---

## Commit & Deploy

- **Client:** Aim for at least 20 notable commits (features, pages, components, fixes).
- **Server:** Aim for at least 12 notable commits (routes, middleware, collections, fixes).
- Deploy server (e.g. Render, Railway) and client (e.g. Vercel, Netlify); add live URLs and repo links to this README.

---

## Optional Enhancements

- ImageBB for profile/task image uploads.
- Real Stripe payment flow with Stripe Elements.
- Email notifications (e.g. SendGrid/AWS SES).
- Advanced task search/filter with MongoDB aggregation.
- Report system for invalid submissions.
