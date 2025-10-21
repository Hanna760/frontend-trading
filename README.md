# frontend-trading

Frontend application for Andina Trading system built with Angular.

## Features
- User authentication (login/register)
- Admin panel
- Principal trading panel
- Role-based access control
- Portfolio management
- Order management

## Technologies
- Angular
- TypeScript
- CSS3
- Docker

## Getting Started

### Prerequisites
- Node.js
- npm
- Angular CLI

### Installation
```bash
npm install
ng serve
```

### Docker
```bash
docker build -t frontend-trading .
docker run -p 80:80 frontend-trading
```

## Project Structure
```
src/
├── app/
│   ├── admin/           # Admin panel components
│   ├── auth/            # Authentication components
│   ├── header/          # Header component
│   ├── landing-page/    # Landing page
│   ├── principal-pane/  # Main trading interface
│   ├── services/        # API services
│   └── interceptors/     # HTTP interceptors
└── assets/              # Static assets
```
