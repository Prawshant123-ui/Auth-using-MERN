import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/user-data`);

      if (data.success) {
        setUserData(data.userData);
      }
    } catch (error) {
      setUserData(null);
      console.error(error);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.userData);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);
      // Only log if it's not a connection refused error (server not running)
      if (error.code !== "ERR_NETWORK" && error.code !== "ECONNREFUSED") {
        console.error("Auth check error:", error);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    userData,
    authLoading,
    setIsLoggedIn,
    setUserData,
    getAuthState,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
export default AppContextProvider;

