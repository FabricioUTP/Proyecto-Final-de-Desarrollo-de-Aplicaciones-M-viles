export const normalizeString = (value, defaultValue = "") => {
  if (value === null || value === undefined) return defaultValue;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : defaultValue;
};

export const normalizeEmail = (value) => normalizeString(value).toLowerCase();

export const isValidEmail = (value) => {
  const email = normalizeEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const normalizeStatus = (value) =>
  value === "completed" ? "completed" : "pending";

export const normalizePriority = (value) => {
  const valid = ["high", "medium", "low"];
  return valid.includes(value) ? value : "medium";
};

export const normalizeCategory = (value) => normalizeString(value, "General");

export const normalizeCreatedAt = (value) => {
  const formatted = normalizeString(value);
  if (formatted) return formatted;
  return new Date()
    .toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
};

export const normalizeTask = (task = {}) => ({
  id: normalizeString(task.id, Date.now().toString()),
  title: normalizeString(task.title, "Tarea sin título"),
  description: normalizeString(task.description, ""),
  status:
    task.completed === true || task.status === "completed"
      ? "completed"
      : "pending",
  priority: normalizePriority(task.priority),
  category: normalizeCategory(task.category),
  createdAt: normalizeCreatedAt(task.createdAt),
});

export const normalizeTaskList = (tasks) =>
  Array.isArray(tasks) ? tasks.map(normalizeTask) : [];

export const normalizeUser = (user = {}) => {
  const fullName = normalizeString(user.fullName || user.name, "Usuario");
  const initials =
    normalizeString(user.initials || fullName)
      .split(" ")
      .map((fragment) => fragment[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("") || "US";

  return {
    id: normalizeString(user.id, Date.now().toString()),
    name: fullName,
    fullName,
    username: normalizeString(user.username, fullName),
    jobTitle: normalizeString(user.jobTitle, "Colaborador"),
    email: normalizeEmail(user.email),
    phone: normalizeString(user.phone, "No disponible"),
    department: normalizeString(user.department, "Sin departamento"),
    role: normalizeString(user.role, "Colaborador"),
    city: normalizeString(user.city, "—"),
    website: normalizeString(user.website, ""),
    initials,
    isAdmin: typeof user.isAdmin === "boolean" ? user.isAdmin : false,
  };
};

export const normalizeUserList = (users) =>
  Array.isArray(users) ? users.map(normalizeUser) : [];

export const normalizeAuthPayload = ({
  fullName,
  jobTitle,
  email,
  password,
}) => ({
  fullName: normalizeString(fullName),
  jobTitle: normalizeString(jobTitle),
  email: normalizeEmail(email),
  password: normalizeString(password),
});