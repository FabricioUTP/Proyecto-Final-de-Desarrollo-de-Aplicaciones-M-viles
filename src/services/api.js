// src/services/api.js
// Capa de servicio centralizada para el consumo de la API
// API utilizada: JSONPlaceholder (https://jsonplaceholder.typicode.com)
// Simula un directorio corporativo con usuarios y sus tareas asignadas

import { createError } from "../utils/error";
import { normalizeTask, normalizeTaskList, normalizeUser, normalizeUserList } from "../utils/normalize";

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Tiempo máximo de espera para una petición (ms)
const TIMEOUT_MS = 8000;

// ── Utilidad: fetch con timeout ───────────────────────────
const fetchWithTimeout = (url, options = {}) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("La solicitud tardó demasiado. Verifica tu conexión.")),
        TIMEOUT_MS
      )
    ),
  ]);
};

// ── Utilidad: manejo centralizado de respuestas ───────────
const handleResponse = async (response) => {
  if (!response.ok) {
    throw createError(
      `Error ${response.status}: No se pudo obtener la información.`,
      `HTTP_${response.status}`
    );
  }

  try {
    return await response.json();
  } catch {
    throw createError(
      "La respuesta del servidor no tiene un formato válido.",
      "INVALID_JSON"
    );
  }
};

// ─────────────────────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────────────────────

/**
 * Obtiene la lista de miembros del equipo (usuarios corporativos)
 * GET /users
 */
export const fetchTeamMembers = async () => {
  const response = await fetchWithTimeout(`${BASE_URL}/users`);
  const data = await handleResponse(response);

  if (!Array.isArray(data)) {
    throw createError("No se recibió un listado válido de miembros.", "INVALID_PAYLOAD");
  }

  return normalizeUserList(
    data.map((user) => ({
      id: user.id,
      fullName: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      department: user.company?.name,
      role: user.company?.catchPhrase,
      city: user.address?.city,
      website: user.website,
      initials: user.name,
    }))
  );
};

/**
 * Obtiene las tareas asignadas a un miembro del equipo
 * GET /todos?userId={userId}
 */
export const fetchMemberTasks = async (userId) => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/todos?userId=${userId}&_limit=5`
  );
  const data = await handleResponse(response);

  if (!Array.isArray(data)) {
    throw createError("No se recibieron tareas válidas para el miembro.", "INVALID_PAYLOAD");
  }

  return normalizeTaskList(
    data.map((todo) => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      description: todo.title,
      category: "General",
      priority: "medium",
      createdAt: "",
    }))
  );
};

/**
 * Obtiene el detalle de un miembro del equipo
 * GET /users/{id}
 */
export const fetchMemberById = async (userId) => {
  const response = await fetchWithTimeout(`${BASE_URL}/users/${userId}`);
  const data = await handleResponse(response);

  if (!data || typeof data !== "object") {
    throw createError("No se recibió información válida del miembro.", "INVALID_PAYLOAD");
  }

  return normalizeUser({
    id: data.id,
    fullName: data.name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    department: data.company?.name,
    role: data.company?.catchPhrase,
    city: data.address?.city,
    website: data.website,
    initials: data.name,
  });
};
