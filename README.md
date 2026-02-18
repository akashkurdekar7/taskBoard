# 📋 TaskBoard

A modern, drag-and-drop Kanban task management app built with **React**, **TypeScript**, and **Vite**. Organize your work across three columns — *To Do*, *In Progress*, and *Done* — with a clean UI, rich task details, and persistent local storage.

---

## ✨ Features

- **Kanban Board** — Three-column layout: *To Do*, *In Progress*, and *Done*
- **Drag & Drop** — Smoothly move task cards between columns using mouse, touch, or keyboard (powered by `@dnd-kit`)
- **Create & Edit Tasks** — Add tasks with title, description (rich text), priority, due date, tags, and assignees
- **Priority Levels** — `low`, `normal`, `high`, `urgent` with visual indicators
- **Activity Log** — Tracks every create, update, move, and delete action (last 50 events)
- **Persistent Storage** — Tasks are saved to `localStorage` and restored on page reload
- **Authentication** — Simple login page with session/remember-me support
- **Reset Board** — One-click board wipe with confirmation prompt

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Vite](https://vite.dev) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Zustand](https://zustand-demo.pmnd.rs) | Global state management |
| [@dnd-kit](https://dndkit.com) | Drag-and-drop interactions |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [React Icons](https://react-icons.github.io/react-icons) | Icon library |
| [uuid](https://github.com/uuidjs/uuid) | Unique ID generation |
| [Vitest](https://vitest.dev) | Unit testing |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Clone the Repository

```bash
git clone https://github.com/akashkurdekar7/taskBoard.git
cd taskBoard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The app will be available at **[http://localhost:5173](http://localhost:5173)**.

---

## 🔑 Login Credentials

The app uses hardcoded demo credentials:

| Field | Value |
|---|---|
| **Email** | `intern@demo.com` |
| **Password** | `intern123` |

> Check **Remember Me** to persist your session across browser restarts (uses `localStorage`). Without it, the session ends when the tab is closed (uses `sessionStorage`).

---

## 📁 Project Structure

```
src/
├── features/
│   ├── auth/
│   │   └── authStore.ts          # Zustand store for login/logout/session
│   └── board/
│       ├── boardStore.ts         # Zustand store for tasks & activity logs
│       ├── Column.tsx            # Droppable column component
│       ├── TaskCard.tsx          # Draggable task card component
│       ├── CreateTaskModal.tsx   # Modal for creating new tasks
│       ├── EditTaskModal.tsx     # Modal for editing existing tasks
│       ├── DescriptionEditor.tsx # Rich text description editor
│       └── ActivityLog.tsx       # Sidebar activity log panel
├── pages/
│   ├── BoardPage.tsx             # Main board page with DnD context
│   └── LoginPage.tsx             # Login page
├── types/
│   └── task.ts                   # TypeScript interfaces (Task, ActivityLog, etc.)
├── App.tsx                       # App entry with routing
└── main.tsx                      # React DOM render entry point
```

---

## 🧩 Key Concepts

### State Management (Zustand)

**`boardStore.ts`** manages all task state globally:
- `addTask` — Adds a task and logs a `"created"` event
- `updateTask` — Updates a task and logs an `"updated"` event
- `deleteTask` — Removes a task and logs a `"deleted"` event
- `moveTask` — Moves a task to a new column and logs a `"moved"` event
- `loadTasks` — Hydrates state from `localStorage` on app start
- `resetBoard` — Clears all tasks and logs from state and storage

The activity log keeps the **last 50 entries** in memory (not persisted).

### Drag & Drop (@dnd-kit)

The board uses `DndContext` with three sensors:
- **PointerSensor** — Mouse drag (activates after 8px movement)
- **TouchSensor** — Touch drag (activates after 200ms hold)
- **KeyboardSensor** — Keyboard accessibility

When a card is dropped, the app checks whether it landed on a **column** or another **task card** (and uses that card's column as the target).

### Data Model

```ts
interface Task {
  id: string;
  title: string;
  description?: string;    // HTML content from rich text editor
  priority: "low" | "normal" | "high" | "urgent";
  dueDate?: string;
  tags: string[];
  attachees?: string[];    // Assignee IDs
  attachments?: { id: string; type: 'image' | 'file'; url: string; name: string }[];
  createdAt: string;
  column: "todo" | "doing" | "done";
}
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the codebase |

---

## 🧪 Running Tests

```bash
npx vitest
```

Tests are located in `src/features/board/boardStore.test.ts` and `src/tests/`.

---

## 🏗️ Building for Production

```bash
npm run build
```

The optimized output will be in the `dist/` folder. You can serve it with any static file server:

```bash
npm run preview
```

---

## 📄 License

This project is for demo/internship purposes.
