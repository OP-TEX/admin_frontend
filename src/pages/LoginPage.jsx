import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, LogIn } from "lucide-react";
import { API_ENDPOINTS } from "../endpoints/endpoints";
import { loginStart, loginSuccess, loginFailure } from "../redux/slices/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      dispatch(loginSuccess(data));
      
      // Navigate to the protected page they tried to visit or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative dark:bg-gray-900 bg-light-primary">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 from-gray-100 via-gray-200 to-gray-100 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="dark:bg-gray-800 bg-white bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md p-8 rounded-2xl shadow-xl border dark:border-gray-700 border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold dark:text-gray-100 text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 px-4 py-2.5 dark:bg-gray-700 bg-white bg-opacity-50 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:text-gray-100 text-gray-900"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 px-4 py-2.5 dark:bg-gray-700 bg-white bg-opacity-50 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:text-gray-100 text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 dark:bg-gray-700 bg-gray-100 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm dark:text-gray-300 text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-indigo-500 hover:text-indigo-400"
              >
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          {error && (
            <p className="mt-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <p className="mt-4 text-center text-sm dark:text-gray-400 text-gray-600">
            
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;