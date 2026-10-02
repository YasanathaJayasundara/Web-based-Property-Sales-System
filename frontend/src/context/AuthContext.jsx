import React, { createContext, useContext, useState, useEffect } from "react";
import { USERS } from "../data/mockData";
import { loginUser, registerUser } from "../data/userPaymentApi";

const AuthContext = createContext(null);

const databaseUserIds = {
  u1: 3, // Amara (BUYER in DB)
  u2: 4, // Nadeesha (SELLER in DB)
  u3: 5, // Ruwan (AGENT in DB)
  u4: 1  // Admin in DB
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("haven_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("haven_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("haven_user");
    }
  }, [user]);

  async function login(email, password = "Password@123") {
    // 1. Try real SQL Server backend first
    try {
      const dbUser = await loginUser({ email, password });
      if (dbUser) {
        const loggedInUser = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          phone: dbUser.phone,
          address: dbUser.address,
          databaseId: dbUser.id,
        };
        setUser(loggedInUser);
        return { ok: true, user: loggedInUser };
      }
    } catch (err) {
      console.warn("Backend login failed, checking local users:", err.message);
    }

    // 2. Fallback to mock / demo accounts if offline
    const foundUser = USERS.find(
      (currentUser) => currentUser.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      return {
        ok: false,
        error: "No account found with that email. Try one of the demo accounts below."
      };
    }

    const fallbackUser = {
      ...foundUser,
      databaseId: databaseUserIds[foundUser.id] || 3
    };
    setUser(fallbackUser);
    return { ok: true, user: fallbackUser };
  }

  async function register(userData) {
    try {
      const dbUser = await registerUser(userData);
      const newUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        phone: dbUser.phone,
        address: dbUser.address,
        databaseId: dbUser.id,
      };
      setUser(newUser);
      return { ok: true, user: newUser };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
