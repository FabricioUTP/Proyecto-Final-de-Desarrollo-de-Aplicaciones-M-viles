// src/services/api.js
// Capa de servicio centralizada para el consumo de la API
// API utilizada: JSONPlaceholder (https://jsonplaceholder.typicode.com)
// Simula un directorio corporativo con usuarios y sus tareas asignadas

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
    throw new Error(`Error ${response.status}: No se pudo obtener la información.`);
  }
  return response.json();
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

  // Transformamos los datos de la API al formato corporativo de KronoTask
  return data.map((user) => ({
    id:         user.id,
    name:       user.name,
    username:   user.username,
    email:      user.email,
    phone:      user.phone,
    department: user.company?.name ?? "Sin departamento",
    role:       user.company?.catchPhrase ?? "Colaborador",
    city:       user.address?.city ?? "—",
    website:    user.website,
    initials:   user.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join(""),
  }));
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

  return data.map((todo) => ({
    id:        todo.id,
    title:     todo.title,
    completed: todo.completed,
  }));
};

/**
 * Obtiene el detalle de un miembro del equipo
 * GET /users/{id}
 */
export const fetchMemberById = async (userId) => {
  const response = await fetchWithTimeout(`${BASE_URL}/users/${userId}`);
  const data = await handleResponse(response);

  return {
    id:         data.id,
    name:       data.name,
    username:   data.username,
    email:      data.email,
    phone:      data.phone,
    department: data.company?.name ?? "Sin departamento",
    role:       data.company?.catchPhrase ?? "Colaborador",
    city:       data.address?.city ?? "—",
    website:    data.website,
    initials:   data.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join(""),
  };
};
