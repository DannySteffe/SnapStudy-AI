import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          const userData = JSON.parse(userInfo);

          // Validate token expiration (basic check)
          if (userData.token) {
            // Decode JWT payload to check expiration
            const tokenPayload = JSON.parse(atob(userData.token.split(".")[1]));
            const currentTime = Date.now() / 1000;

            if (tokenPayload.exp && tokenPayload.exp > currentTime) {
              setUser(userData);
            } else {
              // Token expired, remove it
              localStorage.removeItem("userInfo");
              console.log("Token expired, user logged out");
            }
          } else {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("userInfo");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    try {
      localStorage.setItem("userInfo", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
      throw new Error("Failed to save login information");
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("userInfo");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
