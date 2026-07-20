// src/services/api.js
import Logger from "../utils/logger";

const RANDOM_USER_URL = "https://randomuser.me/api";
const PLACEHOLDER_URL = "https://jsonplaceholder.typicode.com";
const TIMEOUT_MS      = 8000;

const fetchWithTimeout = (url, options = {}) =>
  Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("La solicitud tardó demasiado. Verifica tu conexión a internet.")),
        TIMEOUT_MS
      )
    ),
  ]);

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo obtener la información del servidor.`);
  }
  return response.json();
};

export const fetchTeamMembers = async (userId = "kronotask") => {
  Logger.info("API", "fetchTeamMembers iniciado", { userId });
  try {
    const response = await fetchWithTimeout(
      `${RANDOM_USER_URL}/?results=10&nat=us,gb,au,ca&inc=name,email,phone,location,picture,login,dob&seed=${userId}`
    );
    const data = await handleResponse(response);

    const CORPORATE_ROLES = [
      "Gerente de Proyectos", "Desarrollador Senior", "Diseñadora UX/UI",
      "Analista de Datos", "Director Comercial", "Coordinadora de RRHH",
      "Arquitecto de Software", "Especialista en Marketing",
      "Líder de Operaciones", "Consultora de Negocios",
    ];

    const DEPARTMENTS = [
      "Tecnología", "Desarrollo", "Diseño", "Analítica", "Comercial",
      "Recursos Humanos", "Ingeniería", "Marketing", "Operaciones", "Consultoría",
    ];

    const members = data.results.map((user, index) => ({
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
      photo: {
        thumbnail: user.picture.thumbnail,
        medium:    user.picture.medium,
        large:     user.picture.large,
      },
      initials: `${user.name.first[0]}${user.name.last[0]}`.toUpperCase(),
    }));

    Logger.info("API", "fetchTeamMembers completado", { count: members.length });
    return members;
  } catch (err) {
    Logger.error("API", "fetchTeamMembers fallido", { error: err?.message });
    throw err;
  }
};

export const fetchMemberTasks = async (userId) => {
  Logger.debug("API", "fetchMemberTasks iniciado", { userId });
  try {
    const response = await fetchWithTimeout(
      `${PLACEHOLDER_URL}/todos?userId=${userId}&_limit=5`
    );
    const data = await handleResponse(response);
    Logger.debug("API", "fetchMemberTasks completado", { userId, count: data.length });
    return data.map((todo) => ({
      id:        todo.id,
      title:     todo.title,
      completed: todo.completed,
    }));
  } catch (err) {
    Logger.error("API", "fetchMemberTasks fallido", { userId, error: err?.message });
    throw err;
  }
};