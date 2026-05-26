// src/context/TaskContext.jsx
// Contexto global de tareas con persistencia local mediante AsyncStorage
// Criterio 4 — Persistencia local con AsyncStorage

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const TaskContext = createContext(null);

// Clave de almacenamiento en AsyncStorage
const STORAGE_KEY = "@kronotask_tasks";

// ── Tareas iniciales de muestra ────────────────────────────
// Solo se usan la primera vez que se instala la app (si AsyncStorage está vacío)
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
  const [tasks,          setTasks]          = useState([]);
  const [storageLoading, setStorageLoading] = useState(true);
  const [storageError,   setStorageError]   = useState(null);

  // ── useEffect: cargar tareas desde AsyncStorage al iniciar ──
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored !== null) {
          // Hay tareas guardadas — las cargamos
          const parsed = JSON.parse(stored);
          setTasks(parsed);
        } else {
          // Primera vez — guardamos las tareas iniciales
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
          setTasks(INITIAL_TASKS);
        }
      } catch (err) {
        setStorageError("No se pudieron cargar las tareas guardadas.");
        setTasks(INITIAL_TASKS);
      } finally {
        setStorageLoading(false);
      }
    };

    loadTasks();
  }, []);

  // ── useEffect: guardar tareas en AsyncStorage al cambiar ──
  // Solo se ejecuta cuando tasks cambia Y ya terminó la carga inicial
  useEffect(() => {
    if (storageLoading) return;

    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (err) {
        setStorageError("No se pudieron guardar los cambios.");
      }
    };

    saveTasks();
  }, [tasks, storageLoading]);

  // ── Agregar tarea ─────────────────────────────────────────
  const addTask = useCallback((task) => {
    setTasks((prev) => [task, ...prev]);
  }, []);

  // ── Actualizar tarea ──────────────────────────────────────
  const updateTask = useCallback((updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      )
    );
  }, []);

  // ── Eliminar tarea ────────────────────────────────────────
  const removeTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  // ── Cambiar estado de tarea ───────────────────────────────
  const toggleTaskStatus = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task
      )
    );
  }, []);

  // ── Obtener tarea por ID ──────────────────────────────────
  const getTaskById = useCallback(
    (taskId) => tasks.find((task) => task.id === taskId),
    [tasks]
  );

  // ── Limpiar error de storage ──────────────────────────────
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
