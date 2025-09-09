# Holistart Mobile Approval Application

## Overview

Holistart is a mobile-first approval application designed for managers to review and approve two types of requests:
1. **MRF (Manpower Requisition Form) Approvals** - For hiring new employees
2. **Onboarding Approvals** - For approving new employee onboarding processes

The application features a clean, card-based design optimized for mobile devices with real-time approval workflows and automatic salary escalation logic.

## Features

### Core Functionality
- **Mobile-First Design**: Optimized for 320px-428px viewports with touch-friendly interface
- **Role-Based Access**: Different user roles (Manager, LOB Head, Director) with appropriate permissions
- **Real-time Updates**: Live count badges for pending approvals on dashboard
- **Automatic Escalation**: MRF requests with salary >₹35,000 automatically escalate to Director
- **Document Verification**: Multi-stage onboarding approval with document status tracking

### MRF Approval Workflow
- View MRF requests with department, entity, cost center details
- Automatic salary threshold checking (configurable at ₹35,000)
- High-value requests escalate to Director automatically
- Approve/Reject functionality with reason tracking
- Full detail view with comprehensive position information

### Onboarding Approval Workflow
- Review candidate personal information and employment details
- Document verification status (Aadhaar, PAN, Education, Employment)
- Asset allocation tracking (Laptop, Mobile, ID Card, Parking Pass)
- Complete onboarding approval workflow
- Progress tracking with status indicators

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** as build tool with Hot Module Replacement
- **Tailwind CSS** for styling with custom design tokens
- **shadcn/ui** components built on Radix UI primitives
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express.js server
- **TypeScript** for type safety
- **In-memory storage** with interface for database migration
- **RESTful API** design with structured error handling

### Development Tools
- **ESBuild** for production bundling
- **Drizzle ORM** for database operations (configured for PostgreSQL)
- **Zod** for runtime type validation

## Installation and Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd holistart-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The application uses in-memory storage by default. No additional environment variables are required for development.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## User Guide

### Login Process
The application includes demo credentials for testing:

- **Manager**: MGR001 / manager123
- **LOB Head**: LOB001 / lob123  
- **Director**: DIR001 / director123

### Dashboard Navigation
- **Home**: Overview of pending approvals and quick actions
- **Reports**: Analytics and approval statistics
- **Settings**: User preferences and system configuration

### MRF Approval Flow
1. Navigate to MRF section from dashboard
2. Select an MRF request to review
3. Review basic details (department, positions, salary range)
4. Click "View Full Details" for comprehensive information
5. Choose "Approve" or "Reject" with optional comments
6. High-value requests (>₹35,000) automatically escalate to Director

### Onboarding Approval Flow
1. Navigate to Onboarding section from dashboard
2. Select a candidate to review
3. Review personal information and employment details
4. Check document verification status
5. Review asset allocation requirements
6. Click "View Full Details" for complete candidate profile
7. Approve or reject the onboarding request

## UI Screenshots and Flow

### Login Screen
- Clean mobile-first design with company branding
- Demo credential buttons for easy testing
- Secure authentication with role-based access

### Dashboard
- Pending approval count badges
- Quick navigation to MRF and Onboarding sections
- Recent activity overview
- Role-specific content display

### MRF Detail View
- Card-based layout with clear information hierarchy
- Department, entity, and cost center details
- Salary range with automatic escalation indicators
- Action buttons with touch-friendly design

### MRF Full Detail View
- Comprehensive position information
- Organization details and business context
- Compensation breakdown with annual budget impact
- Priority level indicators (Standard vs High)

### Onboarding Detail View
- Candidate summary with key information
- Document verification progress
- Employment details overview
- Quick action buttons

### Onboarding Full Detail View
- Complete personal information section
- Detailed employment information
- Document verification status with icons
- Asset allocation checklist
- Approval workflow controls

## API Endpoints

### Authentication
- No external authentication required (demo mode)
- Role-based access control implemented

### MRF Endpoints
- `GET /api/mrf` - List all MRF requests
- `GET /api/mrf/:id` - Get specific MRF details
- `PATCH /api/mrf/:id` - Update MRF status (approve/reject/escalate)

### Onboarding Endpoints
- `GET /api/onboarding` - List all onboarding requests
- `GET /api/onboarding/:id` - Get specific candidate details  
- `PATCH /api/onboarding/:id` - Update onboarding status (approve/reject)

## Configuration

### Salary Threshold
The automatic escalation threshold can be configured in localStorage:
```javascript
localStorage.setItem('salary_threshold', '35000');
```

### Theme Customization
Colors and design tokens are defined in `client/src/index.css`:
- Primary colors for branding
- Semantic colors for status indicators
- Dark mode support available

## Development

### Project Structure
```
holistart-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # Application entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express server
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage interface
│   └── vite.ts             # Vite development server setup
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Data models and validation
└── package.json           # Dependencies and scripts
```

### Adding New Features

1. **New Pages**: Add components in `client/src/pages/`
2. **API Endpoints**: Extend `server/routes.ts`
3. **Data Models**: Update `shared/schema.ts`
4. **UI Components**: Create in `client/src/components/`

### Code Style
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Functional React components with hooks
- Tailwind CSS for consistent styling

## Troubleshooting

### Common Issues

1. **Application not loading**
   - Check if port 5000 is available
   - Verify all dependencies are installed
   - Clear browser cache if issues persist

2. **SSL Certificate Errors in Production**
   - Ensure proper port binding (0.0.0.0:5000)
   - Check Replit domain configuration
   - Verify HTTPS redirects are working

3. **API Requests Failing**
   - Check server logs for errors
   - Verify API endpoint URLs
   - Ensure proper request/response handling

### Support
For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

*This application is designed for demonstration purposes and includes demo data for testing approval workflows.*