# TypeScript Project Template

A minimal TypeScript project setup with testing and linting configured.

## Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the project
npm start

# Run in development mode with hot-reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Serve the web interface
npm run serve
```

## Project Structure

- `src/`: Source code
  - `components/`: Reusable components
  - `__tests__/`: Test files
  - `index.ts`: Node.js entry point
  - `browser.ts`: Browser entry point
- `dist/`: Compiled JavaScript (generated after build)
- `public/`: Static files for the web interface
  - `index.html`: Main HTML page

## Web Interface

To access the web interface:

1. Build the project: `npm run build`
2. Install serve if not installed: `npm install -g serve` 
3. Serve the application: `npm run serve`
4. Open `http://localhost:3000/public/` in your browser

## Technologies

- TypeScript
- Jest for testing
- ESLint for linting
