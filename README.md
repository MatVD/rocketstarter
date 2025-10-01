# 🚀 RocketStarter

<div align="center">

**The ultimate Web3 project management platform for seamless Web2-to-Web3 transitions**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Web3](https://img.shields.io/badge/Powered%20by-Web3-orange.svg)](https://web3js.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Demo](#-demo) • [Features](#-features) • [Quick Start](#-quick-start) • [Backend Integration](#-backend-integration) • [Documentation](#-documentation)

</div>

---

## 📖 About

**RocketStarter** is a comprehensive project management platform designed specifically for teams transitioning from Web2 to Web3 technologies. Built by [Kudora Labs](https://kudora.io), it provides structured workflows, pre-built templates, and integrated Web3 tooling to accelerate blockchain project development.

### 🎯 Who It's For

- **Development Teams** building DeFi protocols, NFT marketplaces, or DAO platforms
- **Project Managers** overseeing Web3 initiatives
- **Businesses** transitioning to blockchain technologies
- **Entrepreneurs** launching Web3 startups

---

## ✨ Features

### 🎛️ **Comprehensive Project Management**

- **Visual Dashboard** with real-time progress tracking
- **5-Step Workflow** from requirements to deployment
- **Task Management** with drag-and-drop Kanban boards
- **Team Collaboration** tools and role-based assignments

### 📋 **Pre-Built Strategy Templates**

- **DeFi Protocol Launch** - Complete DeFi development workflow
- **NFT Marketplace** - End-to-end NFT platform creation
- **DAO Governance** - Decentralized governance system setup
- **Custom Templates** - Tailored to your specific needs

### 🔗 **Native Web3 Integration**

- **Wallet Connection** via RainbowKit
- **Backend API Integration** with real-time data sync
- **Blockchain Network** support (Mainnet, Sepolia)
- **Task Workflow** management with on-chain capabilities
- **Multi-Chain Support** (Ethereum Mainnet & Sepolia Testnet)
- **Smart Contract Interaction** with Wagmi & viem
- **Environment Management** (testnet/mainnet switching)

### 🎨 **Modern User Experience**

- **Responsive Design** for desktop and mobile
- **Dark/Light Theme** support
- **Smooth Animations** with Framer Motion
- **Intuitive Interface** built with Tailwind CSS

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/MatVD/rocketstarter.git
cd rocketstarter

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Add your WalletConnect Project ID (optional for wallet features)
# Get one at: https://cloud.walletconnect.com/
echo "VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here" >> .env
```

### 3. Start Development Server

```bash
npm run dev
```

🎉 **That's it!** Open [http://localhost:5173](http://localhost:5173) to see RocketStarter in action.

---

## 🔗 Backend Integration

RocketStarter includes full backend API integration for real-time data management.

### Quick Backend Setup

```bash
# Clone the backend repository
git clone <backend-repo>
cd rocketstarter-back

# Start with Docker
docker-compose up -d
npm run seed:auto

# Verify connection
curl http://localhost:3000/health
```

### Features

- **Real-time Data Sync** - Live project and task updates
- **Wallet Authentication** - Automatic user verification
- **Task Workflows** - Backend-enforced business rules
- **Connection Monitoring** - Visual status indicators

### Integration Status

- ✅ **API Client** - Axios-based with auto-authentication
- ✅ **React Hooks** - Custom hooks for all endpoints
- ✅ **Type Safety** - Full TypeScript integration
- ✅ **Error Handling** - Comprehensive user feedback
- ✅ **CORS Support** - Pre-configured for development

📖 **Full setup guide**: [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)

Test the integration in the "API Testing" tab within the app.

---

## 📊 Demo

### Dashboard Overview

Track your Web3 project progress with visual indicators and step-by-step guidance.

### Project Board

Manage tasks with an intuitive Kanban interface designed for Web3 development workflows.

### Strategy Templates

Jump-start your project with battle-tested templates for common Web3 use cases.

---

## 🛠️ Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Create production-optimized build        |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint code quality checks           |

---

## 📁 Project Structure

```
rocketstarter/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Build/           # Task & Kanban management
│   │   ├── Dashboard/       # Progress tracking
│   │   ├── Layout/          # App shell components
│   │   └── Templates/       # Strategy templates
│   ├── pages/               # Main application pages
│   ├── contexts/            # React context providers
│   ├── utils/               # Helper functions
│   ├── types/               # TypeScript definitions
│   └── constants/           # App constants
├── public/                  # Static assets
└── docs/                    # Additional documentation
```

---

## 🧑‍💻 Development Workflow

### The RocketStarter 5-Step Process

1. **📋 Requirements Analysis** - Define Web3 objectives and success metrics
2. **🏗️ Architecture Choice** - Select optimal blockchain platform and tools
3. **📜 Smart Contracts** - Develop, test, and optimize contracts
4. **🔍 Tests & Audit** - Comprehensive security validation
5. **🚀 Deployment** - Production release and monitoring

Each step includes:

- ✅ **Predefined tasks** and checkpoints
- 👥 **Team assignments** and role guidance
- ⏱️ **Time estimates** and milestone tracking
- 📚 **Resources** and best practices

---

## 🔧 Technology Stack

### Frontend

- **React 18** - Modern component-based UI
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling

### Web3 Integration

- **RainbowKit** - Wallet connection interface
- **Wagmi** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library

### UI/UX

- **Framer Motion** - Smooth animations
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Modern icon system

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/rocketstarter.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push and create a pull request
git push origin feature/amazing-feature
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♀️ Support & Community

- **📧 Email**: [support@kudora.io](mailto:support@kudora.io)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/MatVD/rocketstarter/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/MatVD/rocketstarter/discussions)
- **📖 Documentation**: [docs.rocketstarter.io](https://docs.rocketstarter.io)

---

## 🚀 What's Next?

- [ ] **Advanced Analytics** - Detailed project insights and metrics
- [ ] **AI-Powered Recommendations** - Smart task prioritization
- [ ] **Multi-Chain Expansion** - Polygon, Arbitrum, and more
- [ ] **Team Collaboration** - Real-time editing and comments
- [ ] **Integrations** - GitHub, Slack, Discord connections

---

<div align="center">

**Built with ❤️ by [Kudora Labs](https://kudora.io)**

_Empowering the Web3 transition, one project at a time._

⭐ **Star this repo** if RocketStarter helps you build amazing Web3 projects!

</div>
