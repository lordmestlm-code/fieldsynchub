# FieldSyncHub - Field Service Management Application

A professional full-stack field service management application with React frontend and Node.js backend.

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
- **Backend:** Node.js + Express
- **Database:** SQLite (sql.js - WebAssembly, no native build needed)

## Quick Start

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Start the application (two terminals)

# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Dashboard statistics |
| GET/POST | `/api/customers` | Customer CRUD |
| GET/POST | `/api/technicians` | Technician CRUD |
| GET/POST/PUT | `/api/jobs` | Job management |
| GET/POST | `/api/invoices` | Invoice management |
| GET/POST | `/api/estimates` | Estimate management |
| GET | `/api/revenue` | Monthly revenue data |

## Project Structure

```
fieldsynchub-app/
├── client/
│   ├── src/
│   │   ├── api/           # API service layer
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
├── server/
│   ├── server.js          # Express API server
│   ├── database.sqlite    # SQLite database file
│   └── package.json
└── README.md
```

## Design

- **Primary Color:** Emerald Green (#10B981)
- **Style:** Professional, modern, clean
- **UI:** Card-based layouts with subtle shadows

## License

MIT