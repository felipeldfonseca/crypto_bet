# Crypto Bet Frontend

A modern, responsive frontend for the Crypto Bet Solana-based betting application built with Next.js 14, React 18, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Landing Page**: Professional marketing page with hero section
- **Wallet Integration**: Seamless Solana wallet connectivity with Phantom, Solflare support
- **Responsive Design**: Mobile-first approach with modern UI components
- **TypeScript**: Full type safety throughout the application
- **Modern Stack**: Next.js 14 App Router, React 18, Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Blockchain**: Solana Web3.js
- **Wallet**: Solana Wallet Adapter
- **Font**: Montserrat (via Google Fonts)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── markets/           # Markets section
│       ├── layout.tsx     # Markets layout with wallet provider
│       └── page.tsx       # Markets page
├── components/
│   ├── layout/
│   │   └── Header.tsx     # Header component
│   ├── landing/
│   │   └── HeroSection.tsx # Hero section for landing page
│   ├── providers/
│   │   └── WalletContextProvider.tsx # Solana wallet context
│   ├── shared/
│   │   └── WalletConnectButton.tsx # Wallet connection component
│   └── ui/                # shadcn/ui components
│       ├── button.tsx
│       └── dropdown-menu.tsx
└── lib/
    └── utils.ts           # Utility functions
```

## 🎨 Design System

The application follows a clean, modern design inspired by top-tier crypto projects:

- **Typography**: Montserrat font family
- **Layout**: Centered containers with max-width of 1120px
- **Buttons**: Rounded, modern styling with hover effects
- **Colors**: Professional color scheme with proper contrast
- **Responsive**: Mobile-first design with breakpoints

## 🔗 Routes

- `/` - Landing page with hero section and marketing content
- `/markets` - Main application interface with wallet connectivity

## 🔌 Wallet Integration

The application supports multiple Solana wallets:

- **Phantom Wallet**
- **Solflare Wallet**
- **Extensible**: Easy to add more wallet adapters

### Wallet Features

- Connect/disconnect functionality
- Display wallet address (shortened format)
- Show SOL balance
- Copy address to clipboard
- Dropdown menu with wallet info

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Key Components

### Header Component
- Responsive header with logo and CTA/wallet button
- Conditional rendering based on route (landing vs markets)
- Proper centering with container constraints

### HeroSection Component
- Eye-catching hero section with main value proposition
- Responsive typography with proper line breaks
- Call-to-action button with navigation

### WalletConnectButton Component
- Smart wallet connection handling
- Connected state with dropdown menu
- Balance display and address management
- Disconnect functionality

### WalletContextProvider
- Solana wallet adapter configuration
- Network setup (currently Devnet)
- Wallet modal provider integration

## 🔧 Configuration

### Tailwind CSS
- Custom container settings
- Montserrat font integration
- shadcn/ui design tokens
- Animation utilities

### Next.js
- App Router configuration
- TypeScript support
- Path aliases (@/* for src/*)

## 🌐 Environment

The application is currently configured for Solana Devnet. To change networks, update the `WalletContextProvider` component.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: Default styles
- Tablet: md: breakpoint (768px+)
- Desktop: lg: breakpoint (1024px+)
- Large Desktop: xl: breakpoint (1280px+)

## 🎨 Styling Approach

- **Utility-first**: Tailwind CSS for rapid development
- **Component-based**: Reusable UI components with shadcn/ui
- **Consistent spacing**: Standardized padding and margins
- **Modern aesthetics**: Clean, professional appearance

## 🔍 Development Notes

- All components are properly typed with TypeScript
- Client components are marked with "use client" directive
- Proper error handling for wallet operations
- Optimized for performance with Next.js features

## 📄 License

This project is part of the Crypto Bet application suite. 