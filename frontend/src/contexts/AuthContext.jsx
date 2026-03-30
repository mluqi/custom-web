import React, { createContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => ({
    role: localStorage.getItem("role") || null,
    userName: localStorage.getItem("userName") || null,
  }));

  const isAuthenticated = Boolean(token);
  const [menus, setMenus] = useState([]);
  const [menusLoading, setMenusLoading] = useState(false);

  async function fetchMenus(role) {
    if (!role) return;
    setMenusLoading(true);
    try {
      const res = await api.get(`/role-access/role/${role}/menus`);
      setMenus(res.data?.menus || []);
      return res.data || [];
    } catch (err) {
      // console.error("Failed to fetch menus for role", err);
      setMenus([]);
      return [];
    } finally {
      setMenusLoading(false);
    }
  }

  async function fetchProfile() {
    try {
      const res = await api.get("/auth/profile");
      // Backend returns { user: { ... } }, so we need to access res.data.user
      const userData = res.data?.user || res.data;
      const role = userData?.user_role || userData?.role?.role_id || null;
      const userName = userData?.user_name || userData?.userName || null;

      if (role) {
        localStorage.setItem("role", role);
      }
      if (userName) {
        localStorage.setItem("userName", userName);
      }
      setUser({
        role: role || null,
        userName: userName || null,
      });
      return { role, userName };
    } catch (err) {
      // console.error("Failed to fetch profile", err);
      return { role: null, userName: null, userPhoto: null };
    }
  }

  async function login(credentials) {
    // Expect backend to return { token }
    const res = await api.post("/auth/signin", credentials);
    const data = res.data;
    if (!data.token) throw new Error("Login failed: no token returned");

    // Save token first so subsequent requests use it
    localStorage.setItem("token", data.token);
    setToken(data.token);

    // Fetch profile to get role/userName
    const { role, userName } = await fetchProfile();

    // Persist profile to localStorage
    if (role) localStorage.setItem("role", role);
    if (userName) localStorage.setItem("userName", userName);

    // Fetch menus for role
    if (role) {
      await fetchMenus(role);
    }

    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    setToken(null);
    setUser({ role: null, userName: null, userPhoto: null });
    setMenus([]);
    // Let API interceptor or components handle redirecting to /login
  }

  // If token exists on mount, try to fetch menus for existing role
  React.useEffect(() => {
    // If we have a token but no user role yet, fetch profile first
    if (token && !user?.role) {
      (async () => {
        const { role } = await fetchProfile();
        if (role) await fetchMenus(role);
      })();
      return;
    }

    if (token && user?.role) {
      fetchMenus(user.role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
        menus,
        menusLoading,
        fetchMenus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
