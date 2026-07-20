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
import { formatError } from "../utils/error";
import Logger from "../utils/logger";

import {
  isValidEmail,
  normalizeAuthPayload,
  normalizeString,
  normalizeUser,
} from "../utils/normalize";


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
        if (stored) {
          const session = JSON.parse(stored);
          setCurrentUser(session);
          Logger.info("AuthContext", "Sesión restaurada", { userId: session?.id });
        }
      } catch (err) {
        Logger.error("AuthContext", "Error al restaurar sesión", { error: formatError(err).message });
      } finally { 
        setAuthLoading(false); 
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    Logger.info("AuthContext", "Intento de login", { email });
    try {
      const normalizedEmail    = normalizeString(email).toLowerCase();
      const normalizedPassword = normalizeString(password);

      if (!normalizedEmail || !normalizedPassword) {
        Logger.warn("AuthContext", "Login fallido: campos vacíos");
        return { success: false, error: "El correo y la contraseña son obligatorios." };
      }
      if (!isValidEmail(normalizedEmail)) {
        Logger.warn("AuthContext", "Login fallido: email inválido", { email: normalizedEmail });
        return { success: false, error: "Ingresa un correo válido." };
      }

      // ── Admin hardcodeado ───────────────────────────────
      if (normalizedEmail === ADMIN_USER.email && normalizedPassword === ADMIN_USER.password) {
        const session = { ...normalizeUser(ADMIN_USER) };
        delete session.password;
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setCurrentUser(session);
        Logger.info("AuthContext", "Login exitoso (admin)", { userId: session.id });
        return { success: true, error: null };
      }

      // ── Usuarios registrados ────────────────────────────
      const stored = await AsyncStorage.getItem(USERS_KEY);
      const users  = stored ? JSON.parse(stored) : [];
      const found  = Array.isArray(users)
        ? users.find(
            (u) =>
              u.email.toLowerCase() === normalizedEmail &&  // ← bug original corregido
              u.password === normalizedPassword
          )
        : null;

      if (found) {
        const session = { ...normalizeUser(found) };
        delete session.password;
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setCurrentUser(session);
        Logger.info("AuthContext", "Login exitoso", { userId: session.id });
        return { success: true, error: null };
      }

      Logger.warn("AuthContext", "Login fallido: credenciales incorrectas", { email: normalizedEmail });
      return {
        success: false,
        error: "Datos ingresados incorrectamente. Verifica tu correo y contraseña.",
      };
    } catch (err) {
      Logger.error("AuthContext", "Error inesperado en login", { error: formatError(err).message });
      return { success: false, error: formatError(err).message };
    }
  }, []);

  const register = useCallback(async (payload) => {
    Logger.info("AuthContext", "Intento de registro", { email: payload?.email });
    try {
      const userData = normalizeAuthPayload(payload);
      const { fullName, jobTitle, email, password } = userData;

      if (!fullName || !jobTitle || !email || !password) {
        Logger.warn("AuthContext", "Registro fallido: campos vacíos");
        return { success: false, error: "Todos los campos son obligatorios." };
      }
      if (!isValidEmail(email)) {
        Logger.warn("AuthContext", "Registro fallido: email inválido");
        return { success: false, error: "Ingresa un correo válido." };
      }
      if (password.length < 6) {
        Logger.warn("AuthContext", "Registro fallido: contraseña corta");
        return { success: false, error: "La contraseña debe tener al menos 6 caracteres." };
      }

      const stored = await AsyncStorage.getItem(USERS_KEY);
      const users  = stored ? JSON.parse(stored) : [];

      const emailExists =
        (Array.isArray(users) && users.some((u) => u.email.toLowerCase() === email.toLowerCase())) ||
        email.trim().toLowerCase() === ADMIN_USER.email;

      if (emailExists) {
        Logger.warn("AuthContext", "Registro fallido: email duplicado", { email });
        return { success: false, error: "Este correo ya está registrado en el sistema." };
      }

      const newUser = normalizeUser({
        id:      Date.now().toString(),
        fullName,
        jobTitle,
        email,
        password,
        isAdmin: false,
      });

      const usersToStore = Array.isArray(users) ? [...users, newUser] : [newUser];
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(usersToStore));

      const session = { ...newUser };
      delete session.password;
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setCurrentUser(session);

      Logger.info("AuthContext", "Registro exitoso", { userId: newUser.id });
      return { success: true, error: null };
    } catch (err) {
      Logger.error("AuthContext", "Error inesperado en registro", { error: formatError(err).message });
      return { success: false, error: formatError(err).message };
    }
  }, []);

  const logout = useCallback(async () => {
    Logger.info("AuthContext", "Cierre de sesión", { userId: currentUser?.id });
    try { 
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch (err) {
      Logger.error("AuthContext", "Error al cerrar sesión", { error: formatError(err).message });
    } finally { 
      Logger.clear(); // Limpiar logs al cambiar de sesión
      setCurrentUser(null); 
    }
  }, [currentUser]);

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