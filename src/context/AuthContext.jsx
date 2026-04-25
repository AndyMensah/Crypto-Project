// context/AuthContext.jsx — Global authentication state
//
// This provides login/logout functions and the current user to every component
// in the app without having to pass props manually through every level.
//
// Usage in any component:
//   import { useAuth } from "../context/AuthContext";
//   const { user, login, logout } = useAuth();

import { createContext, useContext, useState, useEffect } from "react";

// Create the context object (null is just the default before the Provider mounts)
const AuthContext = createContext(null);

/**
 * AuthProvider — wrap your app with this so all children can access auth state.
 * It is added to main.jsx around <App />.
 */
export function AuthProvider({ children }) {
  // user: null when logged out, or { _id, name, email, token } when logged in
  const [user, setUser] = useState(null);

  // loading: true while we check localStorage on first page load.
  // Prevents a brief "flash" redirect to /signin for already-logged-in users.
  const [loading, setLoading] = useState(true);

  // On app load, check if we already have a saved user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // If the stored data is corrupted, clear it out
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // Done checking — safe to render protected routes now
  }, []);

  /**
   * login — called after a successful /api/login or /api/register response.
   * Saves the user data and token to localStorage so they survive page refreshes.
   *
   * @param {Object} userData - { _id, name, email, token } from the backend
   */
  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * logout — clears user data and token everywhere.
   * The user will be redirected to /signin by ProtectedRoute components.
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — custom hook for accessing auth state in any component.
 * Use this instead of useContext(AuthContext) directly.
 */
export function useAuth() {
  return useContext(AuthContext);
}
