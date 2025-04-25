# Event Management Platform

A comprehensive event management platform built with Next.js, Prisma, and PostgreSQL.

## Features

-  Event creation and management
-  Speaker management
-  Session scheduling
-  Location management
-  Client and invoice management
-  QR code generation
-  Invitation system
-  User management
-  Responsive dashboard

## Tech Stack

-  **Frontend**: Next.js 13 (App Router), React, Tailwind CSS, shadcn/ui
-  **Backend**: Next.js API Routes, Server Actions
-  **Database**: PostgreSQL with Prisma ORM
-  **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

-  Node.js 16+
-  PostgreSQL database

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/event-management-platform.git
   cd event-management-platform
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:

   -  Copy `.env.example` to `.env`
   -  Update the `DATABASE_URL` with your PostgreSQL connection string
   -  Set up other environment variables as needed

4. Set up the database:
   \`\`\`bash

   # Generate Prisma client

   npx prisma generate

   # Run migrations

   npx prisma migrate dev

   # Seed the database with initial data

   npm run db:seed
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main entities:

-  Users
-  Events
-  Clients
-  Invoices
-  Speakers
-  Sessions
-  Locations
-  Partners
-  QR Codes
-  Invites

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fevent-management-platform)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

## 14. Let's add the shadcn/ui sidebar component

## seed.ts

npx tsc prisma/seed.ts && node prisma/seed.js
