// src/context/AuthContext.jsx
// Contexto de autenticación
// Gestiona: sesión actual, usuarios registrados y persistencia con AsyncStorage

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY   = "@kronotask_registered_users";
const SESSION_KEY = "@kronotask_current_session";

const ADMIN_USER = {
  id:       "admin",
  fullName: "Admin",
  jobTitle: "Administrador",
  email:    "admin@kronotask.com",
  password: "Admin123",
  isAdmin:  true,
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_KEY);
        if (stored) setCurrentUser(JSON.parse(stored));
      } catch {}
      finally { setAuthLoading(false); }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      if (
        email.trim().toLowerCase() === ADMIN_USER.email &&
        password === ADMIN_USER.password
      ) {
        const session = { ...ADMIN_USER };
        delete session.password;
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setCurrentUser(session);
        return { success: true, error: null };
      }

      const stored = await AsyncStorage.getItem(USERS_KEY);
      const users  = stored ? JSON.parse(stored) : [];
      const found  = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (found) {
        const session = { ...found };
        delete session.password;
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setCurrentUser(session);
        return { success: true, error: null };
      }

      return {
        success: false,
        error: "Datos ingresados incorrectamente. Verifica tu correo y contraseña.",
      };
    } catch {
      return { success: false, error: "Ocurrió un error al iniciar sesión. Intenta de nuevo." };
    }
  }, []);

  const register = useCallback(async ({ fullName, jobTitle, email, password }) => {
    try {
      const stored = await AsyncStorage.getItem(USERS_KEY);
      const users  = stored ? JSON.parse(stored) : [];

      const emailExists =
        users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ||
        email.trim().toLowerCase() === ADMIN_USER.email;

      if (emailExists) {
        return { success: false, error: "Este correo ya está registrado en el sistema." };
      }

      const newUser = {
        id:       Date.now().toString(),
        fullName: fullName.trim(),
        jobTitle: jobTitle.trim(),
        email:    email.trim().toLowerCase(),
        password,
        isAdmin:  false,
      };

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

      const session = { ...newUser };
      delete session.password;
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setCurrentUser(session);

      return { success: true, error: null };
    } catch {
      return { success: false, error: "No se pudo crear la cuenta. Intenta de nuevo." };
    }
  }, []);

  const logout = useCallback(async () => {
    try { await AsyncStorage.removeItem(SESSION_KEY); } catch {}
    finally { setCurrentUser(null); }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export { AuthProvider, useAuth };