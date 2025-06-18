# POC (Proof of Concept) Experiments

This directory contains isolated experiments and prototypes that are completely separate from the main application.

## 🔒 Isolation Principles

**CRITICAL**: Each POC experiment must be completely isolated to prevent conflicts with the main application.

### Directory Structure
```
poc/
├── README.md                    # This file
├── experiments/
│   ├── experiment-name/         # Each experiment in its own folder
│   │   ├── package.json         # Isolated dependencies
│   │   ├── next.config.js       # Separate Next.js config
│   │   ├── src/                 # Experiment code
│   │   └── README.md            # Experiment documentation
│   └── another-experiment/
└── shared/                      # Shared utilities (if needed)
    └── components/              # Reusable components across POCs
```

## 🚀 Creating a New POC Experiment

### Step 1: Create Experiment Directory
```bash
mkdir -p poc/experiments/your-experiment-name
cd poc/experiments/your-experiment-name
```

### Step 2: Initialize Isolated Package
```bash
npm init -y
npm install next@latest react@latest react-dom@latest
```

### Step 3: Create Next.js Config
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isolated configuration
  basePath: '/poc/your-experiment-name',
  assetPrefix: '/poc/your-experiment-name',
}
module.exports = nextConfig
```

### Step 4: Add Scripts
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001"
  }
}
```

## ⚠️ Safety Rules

1. **Never run POC experiments on port 3000** - Always use different ports (3001, 3002, etc.)
2. **Each experiment has its own package.json** - No shared dependencies with main app
3. **Use different base paths** - Prevents routing conflicts
4. **Kill main app before starting POC** - Prevents port conflicts
5. **Clean up after experiments** - Remove when done

## 🧹 Cleanup Commands

```bash
# Remove a specific experiment
rm -rf poc/experiments/experiment-name

# Remove all experiments (keep structure)
rm -rf poc/experiments/*

# Reset POC directory completely
rm -rf poc/
```

## 📝 Experiment Template

Use this template for new experiments:

```bash
# 1. Create and enter directory
mkdir -p poc/experiments/my-experiment && cd poc/experiments/my-experiment

# 2. Initialize package
npm init -y

# 3. Install dependencies
npm install next react react-dom

# 4. Create basic structure
mkdir -p src/app
echo 'export default function Home() { return <h1>POC Experiment</h1> }' > src/app/page.tsx

# 5. Start experiment
npm run dev
```

## 🔍 Current Experiments

- None (clean slate)

---

**Remember**: POC experiments are temporary and should be removed when no longer needed. 