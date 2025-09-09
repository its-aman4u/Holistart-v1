# Overview

This is a mobile-first approval application for Holistart built as a full-stack web application. The app enables managers to review and approve two types of requests: MRF (Manpower Requisition Form) approvals and Onboarding approvals. The application features a clean, card-based design optimized for mobile devices with real-time approval workflows and salary escalation logic.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing (SPA)
- **State Management**: TanStack Query for server state management
- **Mobile-First Design**: Responsive design optimized for 320px-428px viewports with touch targets and safe areas

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful endpoints with structured error handling
- **Data Storage**: In-memory storage with interface for easy database migration
- **Development**: Hot module replacement with Vite integration
- **Build**: ESBuild for production bundling

## Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Type-safe database schemas with Zod validation
- **Storage Interface**: Abstracted storage layer (IStorage) allowing easy swapping between in-memory and database implementations

## Key Business Logic
- **MRF Approval Workflow**: Automatic escalation to Director for salary requests >₹35,000
- **Document Verification**: Multi-stage onboarding approval with document status tracking
- **Real-time Updates**: Live count badges for pending approvals on dashboard
- **Mobile Optimization**: Touch-friendly interface with 44px tap targets and minimal navigation

## UI/UX Patterns
- **Component System**: Consistent design system with variants for different states
- **Loading States**: Global loading overlay with custom event system
- **Toast Notifications**: User feedback for approval actions
- **Card-Based Layout**: Scannable design with high contrast and clear hierarchy

# External Dependencies

## Core Technologies
- **@neondatabase/serverless**: PostgreSQL serverless driver for production database
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library for SPA navigation

## UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library for consistent iconography

## Development Tools
- **vite**: Fast build tool with HMR support
- **typescript**: Type safety across the entire stack
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **tsx**: TypeScript execution for development server

## Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation and schema definition
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation

## Additional Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **cmdk**: Command palette component
- **embla-carousel-react**: Touch-friendly carousel component