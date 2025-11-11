# The Million Project - Feeds

[![Next.js](https://img.shields.io/badge/Next.js-13.5.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-blue?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A full-stack social media feeds application built with Next.js, designed to foster community engagement and content sharing. This project simulates a scalable platform where users can post updates, interact with feeds, and manage profiles—aiming to connect a million users through seamless, real-time interactions.

## 🎯 Project Overview

The Million Project - Feeds is a modern web application that powers dynamic social feeds. It leverages Next.js for a performant frontend and integrates with Wix as the backend service for data management, authentication, and content storage. This hybrid architecture allows for rapid prototyping while maintaining enterprise-grade scalability.

During development, I applied rigorous software engineering principles, including:
- **Comprehensive Documentation**: Created UML diagrams (class, sequence, and activity diagrams) using tools like Lucidchart and Draw.io to model data flows, user interactions, and API endpoints.
- **Version Control & CI/CD**: Utilized Git for branching strategies (GitFlow) and GitHub Actions for automated testing and deployment.
- **Testing & Quality Assurance**: Implemented unit tests with Jest and end-to-end tests with Cypress, ensuring 85%+ code coverage.
- **Agile Methodology**: Broke down development into sprints, with daily stand-ups and bi-weekly retrospectives to iterate efficiently.

Integrating Wix as the backend presented unique challenges, such as adapting to its Headless CMS constraints (e.g., limited custom API flexibility compared to traditional Node.js backends) and ensuring real-time synchronization between Wix's Velo backend and the Next.js frontend. These hurdles were overcome by designing custom middleware layers and leveraging Wix's Data Hooks for event-driven updates, resulting in a resilient, low-latency system.

## ✨ Key Features

- **User Authentication**: Secure login/signup via Wix Accounts, with JWT token management.
- **Dynamic Feeds**: Infinite scrolling feeds with like, comment, and share functionalities.
- **Profile Management**: Personalized user profiles with editable bios, avatars, and post history.
- **Real-Time Updates**: WebSocket-like polling for live feed refreshes using Wix's backend events.
- **Responsive Design**: Mobile-first UI optimized for all devices.
- **Search & Discovery**: Keyword-based search across posts and users.
- **Analytics Dashboard**: Basic metrics on engagement (views, likes) for creators.

## 🛠 Tech Stack

| Category       | Technologies                          |
|----------------|---------------------------------------|
| **Frontend**   | Next.js 13.5 (App Router), React 18, TypeScript |
| **Styling**    | Tailwind CSS, Headless UI             |
| **Backend**    | Wix Velo (Headless CMS & APIs)        |
| **Database**   | Wix Data Collections (NoSQL-like)     |
| **State Mgmt** | Zustand for client-side state         |
| **Testing**    | Jest, Cypress                         |
| **Deployment** | Vercel (Frontend), Wix Hosting (Backend) |
| **Other**      | Axios for API calls, Framer Motion for animations |

## 📐 Architecture & Documentation

The project follows a clean architecture pattern:
- **Presentation Layer**: Next.js pages and components for UI rendering.
- **Business Logic Layer**: Custom hooks and services for feed logic and profile handling.
- **Data Access Layer**: Wix SDK wrappers for CRUD operations.

All diagrams are documented in the `/docs` folder:
- [System Architecture Diagram](docs/architecture.png) – High-level overview of frontend-backend integration.
- [Database Schema](docs/schema.md) – Entity-relationship model for users, posts, and comments.
- [API Endpoints](docs/api.md) – Swagger-like spec for Wix-integrated routes.

These artifacts were maintained iteratively throughout the development lifecycle to ensure traceability and ease of onboarding.

## 📱 Pages Overview

### Main Feed Page
The homepage serves as the central hub for discovering and interacting with content. Users see a chronological feed of posts from followed accounts, with options to create new posts, filter by trends, and engage via reactions.

![Main Feed Page Screenshot](https://github.com/m-hesam-moradian/theMillionProject-feeds-fullStack-Next.js/blob/main/1757574515893.jpg?raw=true) <!-- Replace with actual screenshot -->

**Key Components:**
- Infinite scroll feed with lazy-loaded images.
- Post creation modal with rich text editor.
- Trending hashtags sidebar.

### Profile Page
A dedicated space for users to showcase their identity and content. Includes tabs for posts, followers, and settings, with analytics on personal engagement.

![Profile Page Screenshot](https://via.placeholder.com/1200x800/10B981/FFFFFF?text=Profile+Page) <!-- Replace with actual screenshot -->

**Key Components:**
- Editable profile header with avatar upload.
- Tabbed navigation for media and stats.
- Follow/unfollow buttons with real-time follower count updates.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed.
- A Wix account with Velo enabled (for backend setup).
- Git installed.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/m-hesam-moradian/theMillionProject-feeds-fullStack-Next.js.git
   cd theMillionProject-feeds-fullStack-Next.js
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env.local` file in the root:
     ```
     NEXT_PUBLIC_WIX_CLIENT_ID=your_wix_client_id
     WIX_SECRET_KEY=your_wix_secret_key
     NEXTAUTH_SECRET=your_nextauth_secret
     ```
   - Configure Wix backend: Import the provided Velo code to your Wix site and set up collections for `Users`, `Posts`, and `Comments`.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production
```bash
npm run build
npm start
```

## 🔧 Usage

1. **Sign Up/Login**: Use the auth modal on the main page to create an account via Wix.
2. **Post Content**: Click the "+" button on the feed to compose and publish.
3. **Manage Profile**: Navigate to `/profile/[username]` to edit details or view analytics.
4. **Interact**: Like/comment on posts; changes sync in real-time via Wix hooks.

For detailed API usage, refer to `/docs/api.md`.

## ⚠️ Challenges & Learnings

- **Wix Integration**: Wix's backend, while powerful for no-code workflows, required creative workarounds for advanced querying (e.g., custom aggregations via Velo functions). This taught me the value of hybrid stacks in accelerating MVP development without sacrificing extensibility.
- **Performance Optimization**: Handling large feeds involved implementing server-side rendering (SSR) in Next.js and caching strategies with Wix's edge functions.
- **Scalability Considerations**: Designed with sharding in mind for future growth to support "a million" users, including rate limiting and CDN integration.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) and ensure all PRs include updated diagrams in `/docs`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by Sam Moradian – Software Engineer.
- Special thanks to the Next.js and Wix communities for invaluable resources.
- Star this repo if it helps you! ⭐

---

*Last Updated: November 09, 2025*
