# Overview

This is a full-stack portfolio website built with React, Express, and PostgreSQL. The application showcases a developer's professional profile, projects, skills, and experience. It features GitHub integration to automatically sync and display projects, a contact form for visitor communications, and a modern, responsive UI built with shadcn/ui components and Tailwind CSS.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- shadcn/ui component library built on Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Framer Motion for animations and transitions
- Custom theme provider for dark/light mode support

**Design Decisions**
- Component-based architecture with separation of concerns (pages, components, hooks, lib)
- Path aliases (`@/`, `@shared/`) for clean imports
- CSS variables for themeable color system and consistent design tokens

## Backend Architecture

**Server Stack**
- Express.js as the HTTP server framework
- TypeScript with ES modules for modern JavaScript features
- Custom Vite middleware integration for development with HMR support

**API Design**
- RESTful API endpoints for GitHub projects and contact messages
- `/api/github/projects` - Fetch synced GitHub projects from database
- `/api/github/projects/sync` - Trigger manual sync of GitHub projects
- `/api/contact` - Submit contact form messages
- JSON request/response format with Zod schema validation

**Data Layer**
- Drizzle ORM for type-safe database queries and schema management
- Abstract storage interface (`IStorage`) for potential database swapping
- In-memory storage implementation (`MemStorage`) as fallback/development option
- PostgreSQL as the production database via Neon serverless driver

## Database Schema

**Tables**
- `users` - User accounts with username/password (authentication ready)
- `contact_messages` - Visitor contact form submissions
- `github_projects` - Synced GitHub repository data with metadata

**Key Design Patterns**
- UUID primary keys with `gen_random_uuid()` for distributed systems compatibility
- Timestamp tracking with `created_at` and `updated_at` fields
- JSONB for flexible data storage (topics array in GitHub projects)
- Unique constraints on critical fields (username, github_id)

## External Dependencies

**GitHub Integration**
- Octokit REST API client for GitHub API interactions
- Replit Connectors for OAuth token management and renewal
- Automatic token refresh mechanism to handle expiration
- Syncs repository data: name, description, language, topics, stars, forks

**Email Service**
- Nodemailer configured for sending contact form notifications
- SMTP transport setup with environment-based configuration

**Replit Platform**
- Replit-specific plugins for development experience (cartographer, dev-banner, runtime-error-modal)
- Environment-based feature flags for Replit-only features
- Replit identity tokens for secure connector authentication

**Development Tools**
- TypeScript for static type checking across full stack
- ESBuild for server-side bundling in production
- Drizzle Kit for database migrations and schema management
- tsx for running TypeScript files directly in development