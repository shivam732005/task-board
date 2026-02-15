import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");

    if (localUser) {
      setUser(JSON.parse(localUser));
    } else if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const login = (email, password, remember) => {
    if (email !== "intern@demo.com" || password !== "intern123") {
      return { success: false, message: "Invalid email or password" };
    }

    const userData = { email };

    if (remember) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
    }

    setUser(userData);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
