// src/context/TaskContext.jsx
// Almacenamiento de tareas por usuario — cada cuenta tiene su propio storage
// Clave: @kronotask_tasks_<userId>

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { formatError } from "../utils/error";
import { normalizeString, normalizeTask, normalizeTaskList } from "../utils/normalize";

const TaskContext = createContext(null);

// ── Tareas de muestra (solo para cuentas nuevas) ──────────
const INITIAL_TASKS = [
  {
    id: "1",
    title: "Revisar propuesta comercial",
    description:
      "Validar los términos del contrato con el cliente Acme Corp antes de la reunión del viernes.",
    status: "pending",
    priority: "high",
    category: "Comercial",
    createdAt: "22 Abr 2025",
  },
  {
    id: "2",
    title: "Reunión con equipo de diseño",
    description:
      "Alinear wireframes para el nuevo módulo de reportes del dashboard empresarial.",
    status: "completed",
    priority: "medium",
    category: "Diseño",
    createdAt: "21 Abr 2025",
  },
  {
    id: "3",
    title: "Actualizar documentación técnica",
    description:
      "Completar el README del proyecto backend con los nuevos endpoints de la API v2.",
    status: "pending",
    priority: "low",
    category: "Desarrollo",
    createdAt: "20 Abr 2025",
  },
  {
    id: "4",
    title: "Informe mensual de métricas",
    description:
      "Consolidar los KPIs del mes de marzo y preparar el resumen ejecutivo para gerencia.",
    status: "pending",
    priority: "high",
    category: "Gestión",
    createdAt: "19 Abr 2025",
  },
  {
    id: "5",
    title: "Configurar entorno de staging",
    description:
      "Preparar el servidor de pruebas para el despliegue de la versión 2.1 del sistema.",
    status: "completed",
    priority: "medium",
    category: "Desarrollo",
    createdAt: "18 Abr 2025",
  },
];

// ─────────────────────────────────────────────────────────
const TaskProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Clave única por usuario — cada cuenta tiene su propio storage
  const userId = normalizeString(currentUser?.id, "guest");
  const storageKey = `@kronotask_tasks_${userId}`;

  const [tasks,          setTasks]          = useState([]);
  const [storageLoading, setStorageLoading] = useState(true);
  const [storageError,   setStorageError]   = useState(null);

  // Ref para evitar guardar durante el cambio de usuario
  const isLoadingRef = useRef(true);

  // ── useEffect: cargar tareas al cambiar de usuario ────────
  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      isLoadingRef.current = true;
      setStorageLoading(true);
      setTasks([]);

      try {
        const stored = await AsyncStorage.getItem(storageKey);

        if (cancelled) return;

        if (stored !== null) {
          const parsed = JSON.parse(stored);
          const normalizedTasks = normalizeTaskList(parsed);
          setTasks(normalizedTasks);
        } else {
          const defaultTasks = currentUser?.isAdmin ? INITIAL_TASKS : [];
          const normalizedTasks = normalizeTaskList(defaultTasks);
          await AsyncStorage.setItem(storageKey, JSON.stringify(normalizedTasks));
          setTasks(normalizedTasks);
        }
      } catch (err) {
        if (!cancelled) {
          setStorageError(formatError(err).message);
          setTasks(normalizeTaskList(INITIAL_TASKS));
        }
      } finally { 
        if (!cancelled) {
          isLoadingRef.current = false;
          setStorageLoading(false);
        }
      }
    };

    loadTasks();

    // Cleanup: ignorar resultados si el userId cambió antes de terminar
    return () => { cancelled = true; };
  }, [storageKey, userId]);

  // ── useEffect: guardar tareas al cambiar ──────────────────
  useEffect(() => {
    // No guardar mientras se está cargando o cambiando de usuario
    if (storageLoading || isLoadingRef.current) return;

    const saveTasks = async () => {
      try {
        const normalizedTasks = normalizeTaskList(tasks);
        await AsyncStorage.setItem(storageKey, JSON.stringify(normalizedTasks));
      } catch (err) {
        setStorageError(formatError(err).message);
      }
    };

    saveTasks();
  }, [tasks, storageLoading, storageKey]);

  // ── CRUD de tareas ────────────────────────────────────────
  
  const addTask = useCallback((task) => {
    setTasks((prev) => [normalizeTask(task), ...prev]);
  }, []);
  
  const updateTask = useCallback((updatedTask) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === updatedTask.id ? normalizeTask({ ...t, ...updatedTask }) : t
      )
    );
  }, []);
  
  const removeTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);
  
  const toggleTaskStatus = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
          : t
      )
    );
  }, []);
  
  const getTaskById = useCallback(
    (taskId) => tasks.find((t) => t.id === taskId),
    [tasks]
  );
  
  const clearStorageError = useCallback(() => setStorageError(null), []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        storageLoading,
        storageError,
        addTask,
        updateTask,
        removeTask,
        toggleTaskStatus,
        getTaskById,
        clearStorageError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks debe usarse dentro de TaskProvider");
  }
  return context;
};

export { TaskProvider, useTasks };

