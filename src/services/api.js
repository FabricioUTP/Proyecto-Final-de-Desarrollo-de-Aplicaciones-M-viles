// src/services/api.js
// Capa de servicio centralizada para el consumo de APIs externas
//
// APIs utilizadas:
//   1. Random User API  (https://randomuser.me)
//      → Directorio del equipo con fotos reales de perfil
//      → Gratuita, sin API key, sin límite de peticiones
//
//   2. JSONPlaceholder  (https://jsonplaceholder.typicode.com)
//      → Tareas asignadas por miembro del equipo
//      → Gratuita, sin API key

const RANDOM_USER_URL = "https://randomuser.me/api";
const PLACEHOLDER_URL = "https://jsonplaceholder.typicode.com";
const TIMEOUT_MS      = 8000;

// ── Utilidad: fetch con timeout ───────────────────────────
const fetchWithTimeout = (url, options = {}) =>
  Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "La solicitud tardó demasiado. Verifica tu conexión a internet."
            )
          ),
        TIMEOUT_MS
      )
    ),
  ]);

// ── Utilidad: manejo centralizado de respuestas ───────────
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: No se pudo obtener la información del servidor.`
    );
  }
  return response.json();
};

// ─────────────────────────────────────────────────────────
// ENDPOINT 1: Random User API — Miembros del equipo
// Devuelve 10 empleados con foto real de perfil
// ─────────────────────────────────────────────────────────

/**
 * Obtiene la lista de miembros del equipo con fotos reales
 * GET randomuser.me/api/?results=10&...
 */
// ✅ Ahora — seed por usuario, cada cuenta ve personas distintas
export const fetchTeamMembers = async (userId = "kronotask") => {
  const response = await fetchWithTimeout(
    `${RANDOM_USER_URL}/?results=10&nat=us,gb,au,ca&inc=name,email,phone,location,picture,login,dob&seed=${userId}`
  );
  const data = await handleResponse(response);

  // Cargos corporativos simulados (se rotan por índice)
  const CORPORATE_ROLES = [
    "Gerente de Proyectos",
    "Desarrollador Senior",
    "Diseñadora UX/UI",
    "Analista de Datos",
    "Director Comercial",
    "Coordinadora de RRHH",
    "Arquitecto de Software",
    "Especialista en Marketing",
    "Líder de Operaciones",
    "Consultora de Negocios",
  ];

  const DEPARTMENTS = [
    "Tecnología",
    "Desarrollo",
    "Diseño",
    "Analítica",
    "Comercial",
    "Recursos Humanos",
    "Ingeniería",
    "Marketing",
    "Operaciones",
    "Consultoría",
  ];

  return data.results.map((user, index) => ({
    // ID numérico del 1 al 10 para asociar con JSONPlaceholder
    id:         index + 1,
    uuid:       user.login.uuid,
    firstName:  user.name.first,
    lastName:   user.name.last,
    name:       `${user.name.first} ${user.name.last}`,
    email:      user.email,
    phone:      user.phone,
    city:       user.location.city,
    country:    user.location.country,
    role:       CORPORATE_ROLES[index] ?? "Colaborador",
    department: DEPARTMENTS[index]     ?? "General",
    age:        user.dob.age,
    // Fotos reales en tres tamaños — esto diferencia a Random User API
    photo: {
      thumbnail: user.picture.thumbnail,  // 32×32  — para listas
      medium:    user.picture.medium,     // 128×128 — para cards
      large:     user.picture.large,      // 256×256 — para detalle
    },
    initials: `${user.name.first[0]}${user.name.last[0]}`.toUpperCase(),
  }));
};

// ─────────────────────────────────────────────────────────
// ENDPOINT 2: JSONPlaceholder — Tareas por miembro
// Asocia tareas reales del API al miembro según su índice
// ─────────────────────────────────────────────────────────

/**
 * Obtiene las tareas asignadas a un miembro del equipo
 * GET /todos?userId={userId}&_limit=5
 */
export const fetchMemberTasks = async (userId) => {
  const response = await fetchWithTimeout(
    `${PLACEHOLDER_URL}/todos?userId=${userId}&_limit=5`
  );
  const data = await handleResponse(response);

  return data.map((todo) => ({
    id:        todo.id,
    title:     todo.title,
    completed: todo.completed,
  }));
}