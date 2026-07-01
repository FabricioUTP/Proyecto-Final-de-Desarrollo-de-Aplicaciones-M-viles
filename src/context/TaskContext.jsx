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
import { formatError } from "../utils/error";
import { cancelTaskReminder, notifyTaskCompleted } from "../utils/notifications";
import Logger from "../utils/logger";
import {
  normalizeString,
  normalizeTask,
  normalizeTaskList,
} from "../utils/normalize";
import { useAuth } from "./AuthContext";

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
  const userId     = normalizeString(currentUser?.id ?? "guest");
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
          Logger.info("TaskContext", "Tareas cargadas desde storage", { count: normalizedTasks.length, userId });
        } else {
          const defaultTasks = currentUser?.isAdmin ? INITIAL_TASKS : [];
          const normalizedTasks = normalizeTaskList(defaultTasks);
          await AsyncStorage.setItem(storageKey, JSON.stringify(defaultTasks));
          setTasks(normalizedTasks);
          Logger.info("TaskContext", "Storage vacío — tareas iniciales cargadas", { count: normalizedTasks.length, userId });
        }
      } catch (err) {
        if (!cancelled) {
          const msg = formatError(err).message;
          Logger.error("TaskContext", "Error al cargar tareas", { error: msg, userId });
          setStorageError(msg);
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
        Logger.debug("TaskContext", "Tareas guardadas", { count: normalizedTasks.length });
      } catch (err) {
        const msg = formatError(err).message;
        Logger.error("TaskContext", "Error al guardar tareas", { error: msg });
        setStorageError(msg);
      }
    };

    saveTasks();
  }, [tasks, storageLoading, storageKey]);

  // ── CRUD de tareas ────────────────────────────────────────
  
  const addTask = useCallback((task) => {
    const normalized = normalizeTask(task);
    Logger.info("TaskContext", "Tarea creada", { id: normalized.id, title: normalized.title });
    setTasks((prev) => [normalized, ...prev]);
  }, []);
  
  const updateTask = useCallback((updatedTask) => {
    Logger.info("TaskContext", "Tarea actualizada", { id: updatedTask.id });
    setTasks((prev) =>
      prev.map((t) =>
        t.id === updatedTask.id ? normalizeTask({ ...t, ...updatedTask }) : t
      )
    );
  }, []);
  
  const removeTask = useCallback((taskId) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (task?.notificationId) cancelTaskReminder(task.notificationId);
      Logger.info("TaskContext", "Tarea eliminada", { id: taskId });
      return prev.filter((t) => t.id !== taskId);
    });
  }, []);
  
  const toggleTaskStatus = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const isCompletingNow = t.status !== "completed";
        if (isCompletingNow) {
          if (t.notificationId) cancelTaskReminder(t.notificationId);
          notifyTaskCompleted(t);
          Logger.info("TaskContext", "Tarea completada", { id: taskId, title: t.title });
          return { ...t, status: "completed", notificationId: "" };
        }
        Logger.info("TaskContext", "Tarea reabierta", { id: taskId });
        return { ...t, status: "pending" };
      })
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

export { TaskProvider, useTasks }