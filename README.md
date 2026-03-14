# FieldSyncHub - Field Service Management Application

A professional field service management web application built with React.

## Features

- 📊 **Dashboard** - Overview of key metrics and KPIs
- 📅 **Scheduling** - Calendar-based job scheduling
- 👥 **CRM** - Customer relationship management
- 📋 **Job Management** - Kanban board for work orders
- 💰 **Invoicing** - Estimates to invoices workflow
- 👷 **Technician Management** - Team management
- 📈 **Reports** - Analytics and reporting

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Charts:** Recharts
- **State:** React Context + Hooks

## Quick Start

```bash
# Install dependencies
cd client
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
fieldsynchub-app/
├── client/
│   ├── src/
│   │   ├── api/           # Mock data API
│   │   ├── components/
│   │   │   ├── ui/        # Reusable UI components
│   │   │   ├── layout/    # Layout components
│   │   │   └── features/  # Feature components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript type definitions
│   │   └── styles/        # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Design

- **Primary Color:** Emerald Green (#10B981)
- **Style:** Professional, modern, clean
- **UI:** Card-based layouts with subtle shadows

## License

MIT