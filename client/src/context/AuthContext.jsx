import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  // ========================================
  // AUTHENTICATION STATUS
  // ========================================

  const isAuthenticated = !!token && !!user;

  // ========================================
  // LOADING
  // ========================================

  const loading = false;

  // ========================================
  // LOGIN
  // ========================================

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "token",
      data.token
    );
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ========================================
// CUSTOM HOOK
// ========================================

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
