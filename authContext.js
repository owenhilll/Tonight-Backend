import { request } from "@/axios";
import { createContext, useContext, useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
const AuthContext = createContext();

export let IsBusiness = false;

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);

  useEffect(() => {
    let u = JSON.parse(localStorage.getItem("user"));

    setSession(u != null);

    if (u != null) {
      setUser(u);
      if (u.category === null) IsBusiness = false;
      else IsBusiness = true;
    }
  }, []);

  const logout = async (inputs) => {
    localStorage.setItem("user", null);
    setUser(null);
    setSession(false);
  };
  const login = async (inputs) => {
    const res = request
      .post("/auth/login", inputs, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setSession(res.status === 200);
        if (res.data.category === null) window.IsBusiness = false;
        else window.IsBusiness = true;
      })
      .catch((err) => {
        throw new Error("Cannot authenticate User" + err);
      });
  };

  const contextData = { session, user, login, logout };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <SafeAreaView>
          <Text>..</Text>
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthContextProvider, useAuth };
