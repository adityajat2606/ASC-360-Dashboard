# ASC 360 Dashboard

A comprehensive insurance operations dashboard built for managing policy issuance, wallet operations, and customer management.

## 📋 Project Overview

**Repository**: ASC-360-Dashboard  
**Status**: Active Development  
**Version**: 1.0.0

This project serves as the primary interface for ASC 360 insurance operations, handling policy management, cover assignments, bulk issuance, and wallet management.

---

## 🛠 Tech Stack

This project is built with modern technologies:

| Technology | Purpose |
|-----------|---------|
| **Vite** | Fast build tool and dev server |
| **React 18+** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first styling |
| **shadcn-ui** | High-quality UI components |
| **Bun** | JavaScript runtime & package manager |

---

## 📁 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── DashboardLayout.tsx
│   ├── NavLink.tsx
│   ├── WalletCard.tsx
│   └── ui/              # shadcn-ui components
├── pages/               # Page components
│   ├── DashboardPage.tsx
│   ├── PolicyIssuedPage.tsx
│   ├── BulkIssuancePage.tsx
│   ├── SingleIssuancePage.tsx
│   ├── WalletPage.tsx
│   ├── PaymentsPage.tsx
│   ├── AssignCoversPage.tsx
│   ├── CoverSelectionPage.tsx
│   ├── OperatorProfilePage.tsx
│   └── QuoteLinksPage.tsx
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and API functions
├── test/                # Unit tests
└── main.tsx             # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- Git

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/adityajat2606/ASC-360-Dashboard.git
   cd ASC-360-Dashboard
   ```

2. **Install dependencies**
   ```sh
   bun install
   # or
   npm install
   ```

3. **Start the development server**
   ```sh
   bun run dev
   # or
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the port displayed in your terminal).

---

## 📝 Available Scripts

```sh
# Development
bun run dev          # Start dev server with hot reload

# Building
bun run build        # Build for production
bun run preview      # Preview production build locally

# Code Quality
bun run lint         # Run ESLint
bun run format       # Format code

# Testing
bun run test         # Run unit tests
bun run test:watch   # Run tests in watch mode
```

---

## 🔧 Development Workflow

### Editing Code - Multiple Options

#### 1. **Local Development (Recommended)**
Clone and develop locally using your IDE for the best experience:
```sh
git clone https://github.com/adityajat2606/ASC-360-Dashboard.git
cd ASC-360-Dashboard
bun install
bun run dev
```

#### 2. **GitHub Web Editor**
- Navigate to the repository
- Click the "Edit" button (pencil icon) on any file
- Make changes and commit directly

#### 3. **GitHub Codespaces**
- Click "Code" button on the repository
- Select "Codespaces" tab
- Create a new codespace for cloud-based development
- Edit, commit, and push changes directly

---

## 🎨 UI Components

This project uses **shadcn-ui** for production-ready components including:
- Forms and Inputs
- Navigation elements
- Dialogs and Modals
- Cards and Layouts
- Tables and Data displays
- Alerts and Notifications

All components are styled with Tailwind CSS for consistency.

---

## 🗂 Key Features

- **Dashboard**: Centralized overview of insurance operations
- **Policy Management**: Issue, manage, and track policies
- **Wallet System**: Handle wallet operations and transactions
- **Bulk Operations**: Process multiple policies efficiently
- **Cover Assignment**: Assign insurance covers to policies
- **Payment Tracking**: Monitor and manage payments
- **Operator Profile**: Manage operator information

---

## 🔌 API Integration

The project integrates with backend services through `src/lib/api.ts`. Key endpoints include policy management, wallet operations, and user management.

---

## 📦 Dependencies

**Main Dependencies:**
- `react`: UI framework
- `react-dom`: React DOM rendering
- `react-router-dom`: Client-side routing
- `@radix-ui/*`: Unstyled, accessible components
- `tailwindcss`: Utility CSS framework
- `typescript`: Type safety

**Dev Dependencies:**
- `vite`: Build tool
- `eslint`: Code linting
- `vitest`: Unit testing
- `@testing-library/react`: React testing utilities

---

## 🚀 Deployment

### Build for Production
```sh
bun run build
# Output: dist/
```

The optimized build is ready for deployment to any static hosting service.

### Hosting Options
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Custom domain setup available

---

## ✅ Testing

Run the test suite:
```sh
bun run test           # Single run
bun run test:watch     # Watch mode
```

Tests are located in `src/test/` using Vitest and React Testing Library.

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License

This project is proprietary. Unauthorized copying or distribution is prohibited.

---

## 📞 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

## 🔗 Useful Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-ui](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
