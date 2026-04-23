import { createContext, useContext, useState } from "react";

const TaskContext = createContext(null);

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

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const addTask = (task) => setTasks((prev) => [task, ...prev]);

  const updateTask = (updatedTask) =>
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
      ),
    );

  const removeTask = (taskId) =>
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

  const toggleTaskStatus = (taskId) =>
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task,
      ),
    );

  const getTaskById = (taskId) => tasks.find((task) => task.id === taskId);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        removeTask,
        toggleTaskStatus,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
};

export { TaskProvider, useTasks };

