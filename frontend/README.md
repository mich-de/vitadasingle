# VitaApp

A comprehensive life management application built with React, TypeScript, and Vite. VitaApp helps you manage properties, vehicles, expenses, bookings, workouts, events, and documents all in one place.

## Features

- **Property Management**: Track residential and commercial properties with financial data
- **Vehicle Management**: Monitor vehicle information, insurance, and maintenance
- **Expense Tracking**: Categorize and analyze personal and business expenses
- **B&B Booking Management**: Handle vacation rental bookings and revenue
- **Workout Tracking**: Log fitness activities and monitor progress
- **Event Management**: Schedule and organize personal and professional events
- **Document Storage**: Organize and categorize important documents
- **Multi-language Support**: Available in English and Italian

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Deployment**: Vercel

## Architecture

This project follows the **AI Coding Guidelines** for consistent development:

- **All code written in English** (identifiers, comments, docstrings)
- **ISO 8601 date format** for all data storage (`YYYY-MM-DD` or RFC 3339)
- **English as primary UI language** with internationalization support
- **Proper TypeScript types** and comprehensive error handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vitadasingle.git
cd vitadasingle/frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run type-check

# Clean cache
npm run clean-cache
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   ├── modals/         # Modal components
│   │   └── ui/             # Base UI components
│   ├── context/            # React Context providers
│   │   ├── LanguageContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── features/           # Feature-based organization
│   │   ├── expenses/       # Expense management
│   │   ├── properties/     # Property management
│   │   └── vehicles/       # Vehicle management
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   │   ├── common/         # Common types
│   │   ├── entities/       # Entity types
│   │   └── features/       # Feature-specific types
│   ├── utils/              # Utility functions
│   │   ├── dateHelpers.ts  # ISO 8601 date utilities
│   │   └── formatters.ts   # Localized formatters
│   └── main.tsx           # Application entry point
├── public/                 # Static assets
├── vercel.json            # Vercel deployment configuration
└── package.json           # Project dependencies
```

## Internationalization

The application supports multiple languages using a custom translation system:

- **English (en)**: Primary language (default)
- **Italian (it)**: Secondary language

Translation keys follow a hierarchical structure:
```javascript
t('expenses.category.food')      // "Food" / "Alimentari"
t('dashboard.welcome')           // "Welcome" / "Benvenuto"
t('common.save')                 // "Save" / "Salva"
```

## Date Handling

All dates are stored in ISO 8601 format following the AI Coding Guidelines:

- **Storage**: `"2025-07-03"` (date) or `"2025-07-03T17:45:00Z"` (timestamp)
- **Display**: Automatically formatted based on user locale
- **Utilities**: Comprehensive date helpers in `utils/dateHelpers.ts`

## Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set up environment variables in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to main branch

```bash
# Manual deployment
npm run vercel-build
```

### Custom Deployment

```bash
# Build for production
npm run build

# Serve static files from 'dist' directory
# Configure your web server to serve index.html for all routes
```

## Development Guidelines

### Code Style

- Use **English** for all code, comments, and documentation
- Follow **TypeScript** best practices with strict type checking
- Use **functional components** with hooks
- Implement **proper error handling** and loading states
- Write **descriptive commit messages** using conventional commits

### Component Structure

```typescript
// ComponentName.tsx
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ComponentProps {
  id: string;
  title: string;
  onAction: (id: string) => void;
}

export const ComponentName: React.FC<ComponentProps> = ({ id, title, onAction }) => {
  const { t } = useLanguage();
  
  return (
    <div className="component-wrapper">
      <h2>{t('component.title')}</h2>
      {/* Component content */}
    </div>
  );
};
```

### Date Usage

```typescript
import { getCurrentDate, formatDateForDisplay } from '@/utils/dateHelpers';

// Create new records with ISO dates
const newExpense = {
  id: generateId(),
  date: getCurrentDate(),          // "2025-07-03"
  createdAt: getCurrentTimestamp() // "2025-07-03T14:30:00Z"
};

// Display dates to user
const displayDate = formatDateForDisplay(expense.date, language);
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or questions, please open an issue on GitHub or contact the development team.

---

*Last updated: 2025-07-03*
