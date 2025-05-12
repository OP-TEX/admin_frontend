import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Sidebar from "./components/common/Sidebar";
import LoginPage from "./pages/LoginPage";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import { refreshAuthTokens } from "./endpoints/endpoints";
import { logout, loginSuccess } from "./redux/slices/authSlice"; // Added logout import

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
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Function to handle token refresh
  const handleTokenRefresh = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!userId || !refreshToken) {
        console.log("Missing userId or refreshToken - can't refresh");
        return false;
      }
      
      const tokens = await refreshAuthTokens(userId, refreshToken);
      
      // Update tokens in localStorage
      localStorage.setItem("token", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      
      // Update Redux state with new tokens
      if (user) {
        dispatch(loginSuccess({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }));
      }
      
      console.log("Token refresh successful");
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };
  
  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };
  
  useEffect(() => {
    // Try to refresh token on mount
    const refreshOnMount = async () => {
      const success = await handleTokenRefresh();
      
      // If refresh fails, log the user out
      if (!success && localStorage.getItem("token")) {
        handleLogout();
      }
    };
    
    refreshOnMount();
    
    // Set up interval for token refresh every 20 minutes
    const refreshInterval = setInterval(() => {
      handleTokenRefresh().catch(err => {
        console.error("Scheduled token refresh failed:", err);
        handleLogout();
      });
    }, 20 * 60 * 1000); // 20 minutes
    
    // Clean up interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);
  
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
                  <Route path="/orders" element={<OrdersPage/>} />
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