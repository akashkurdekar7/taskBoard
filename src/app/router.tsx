import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import BoardPage from "../pages/BoardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import ErrorBoundary from "../components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/board",
    element: (
      <ProtectedRoute>
        <BoardPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
]);
