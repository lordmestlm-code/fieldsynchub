# FieldSyncHub - Field Service Management Application

A full-stack field service management web application built with React and Node.js.

## Features

- 📊 **Dashboard** - Overview of key metrics and KPIs
- 📅 **Scheduling** - Calendar-based job scheduling
- 👥 **CRM** - Customer relationship management
- 📋 **Job Management** - Kanban board for work orders
- 💰 **Invoicing** - Estimates to invoices workflow
- 👷 **Technician Management** - Team management
- 📈 **Reports** - Analytics and reporting

## Tech Stack

- **Frontend:** React + Vite + React Router
- **UI Components:** Custom components with professional styling
- **Backend:** Node.js + Express
- **Database:** SQLite with better-sqlite3
- **Authentication:** JWT-based auth

## Quick Start

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start the development server
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && npm run dev
```

## Project Structure

```
fieldsynchub-app/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── server/          # Node.js backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── package.json
└── README.md
```

## License

MIT