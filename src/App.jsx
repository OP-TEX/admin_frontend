import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from 'react-hot-toast';

import Sidebar from "./components/common/Sidebar";
import LoginPage from "./pages/LoginPage";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to the page they came from or default to home
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen dark:bg-gray-900 bg-light-primary dark:text-gray-100 text-light-text overflow-hidden">
                {/* BG */}
                <div className="fixed inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 from-gray-100 via-gray-200 to-gray-100 opacity-80" />
                  <div className="absolute inset-0 backdrop-blur-sm" />
                </div>

                <Sidebar />
                <Routes>
                  <Route path="/" element={<ProductsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
