// File: frontend-web/src/pages/router.tsx
/**
 * Application Router
 *
 * EN:
 * - Central routing definition for frontend-web.
 * - Enforces authentication boundary.
 * - All business pages are protected.
 *
 * VI:
 * - Định nghĩa routing trung tâm cho frontend-web.
 * - Thực thi ranh giới xác thực.
 * - Mọi trang nghiệp vụ đều được bảo vệ.
 */

import { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import { AuthModals } from "./components/modals";
import { useAuth } from "./context/AuthContext";

// Pages
import AITeaching from "./pages/AITeaching";
import CaseDetail from "./pages/CaseDetail";
import CaseList from "./pages/CaseList";
import Dashboard from "./pages/Dashboard";
import Explainability from "./pages/Explainability";
import Login from "./pages/Login";
import Signing from "./pages/Signing";



/**
 * PrivateRoute
 *
 * EN:
 * - Protect routes that require authentication.
 * - Redirect unauthenticated users to /login.
 *
 * VI:
 * - Bảo vệ route cần đăng nhập.
 * - Chuyển hướng người chưa đăng nhập về /login.
 */
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

/**
 * AppRouter
 *
 * EN:
 * - Root router of the application.
 * - Defines all public and private routes.
 *
 * VI:
 * - Router gốc của ứng dụng.
 * - Định nghĩa toàn bộ route public và private.
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===================== */}
        {/* Public Routes */}
        {/* ===================== */}
        <Route path="/login" element={<Login />} />

        {/* ===================== */}
        {/* Protected Routes */}
        {/* ===================== */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/cases"
          element={
            <PrivateRoute>
              <CaseList />
            </PrivateRoute>
          }
        />

        <Route
          path="/cases/:id"
          element={
            <PrivateRoute>
              <CaseDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/signing"
          element={
            <PrivateRoute>
              <Signing />
            </PrivateRoute>
          }
        />

        <Route
          path="/ai-teaching"
          element={
            <PrivateRoute>
              <AITeaching />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* Explainability (Core Feature) */}
        {/* ===================== */}
        <Route
          path="/explainability"
          element={
            <PrivateRoute>
              <Explainability />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* Redirects */}
        {/* ===================== */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* ===================== */}
      {/* Global Auth Modals */}
      {/* ===================== */}
      <AuthModals />
    </BrowserRouter>
  );
}
