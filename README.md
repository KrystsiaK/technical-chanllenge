# User Management System

A modern user management platform built with Next.js, TypeScript, and Playwright testing.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended)

### Installation

```bash
pnpm install
```

## 📦 Available Commands

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run all tests
pnpm test

# Run tests with UI mode
pnpm test:ui

# Run tests in headed mode (visible browser)
pnpm test:headed

# Debug tests
pnpm test:debug

# View test report
pnpm exec playwright show-report
```

### Docker

```bash
# Build and start container
docker compose up -d --build

# View logs
docker compose logs -f

# Stop container
docker compose down
```

Application will be available at [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 16.0.1
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Testing**: Playwright 1.56
- **Containerization**: Docker
