Fluid Flow: High-Performance Task Engine
A React-based project management interface focused on fluid motion, complex state orchestration, and sub-100ms interaction latency.

🚀 The Mission
Built to demonstrate the intersection of technical React architecture and high-fidelity UX engineering. This isn't just a CRUD app; it’s an exploration of how state management affects perceived performance and user delight.

🛠 Tech Stack & Rationale
Framework: React 18 (Vite) — Optimized for fast HMR and modern build pipelines.

State Management: * Zustand: For global UI state (sidebar toggles, active filters).

TanStack Query: For asynchronous server state, implementing Optimistic Updates to ensure zero-lag when moving tasks.

React Context: Leveraged specifically for the Theme Engine to prevent prop-drilling without over-engineering global state.

Styling & Animation:

Motion.dev (Framer Motion): Handling layout transitions via layoutId and physics-based gesture interactions.

Tailwind CSS + CSS Modules: A hybrid approach using Tailwind for utility speed and CSS Modules for complex, state-dependent component styles.

Backend: Supabase (PostgreSQL) — Demonstrating a deep understanding of relational data models and real-time subscriptions.

✨ Key UX Features
1. The "Zero-Latency" Board
   Using Optimistic UI, task movements are reflected instantly. If the server request fails, the state gracefully rolls back with a notification—ensuring the user never waits for a loading spinner on a primary action.

2. Motion-First Design
   Instead of static jumps, every UI change is interpolated.

Shared Element Transitions: Clicking a task expands it into a modal via a smooth layout animation.

Micro-interactions: Custom-engineered hover effects and "springy" drag-and-drop feedback.

3. Cross-Client Email System
   Built a React Email previewer within the app. It demonstrates the ability to translate modern React components into bulletproof, table-based HTML layouts compatible with Outlook, Gmail, and Apple Mail.

📈 Performance & Architecture
Memoization Strategy: Strategic use of React.memo and useCallback on the Task Board to ensure that moving one card doesn't trigger a re-render of 100+ sibling cards.

Bundle Optimization: Custom Vite configuration to split vendor chunks, ensuring a "Green" Lighthouse score for accessibility and performance.

Relational Integrity: Designed a schema with foreign key constraints and automated triggers to handle cascading updates across projects.