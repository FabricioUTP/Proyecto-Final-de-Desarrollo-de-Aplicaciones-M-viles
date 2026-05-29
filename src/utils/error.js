const normalizeErrorMessage = (
  error,
  fallback = "Ocurrió un error inesperado. Intenta de nuevo.",
) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === "object") {
    if (typeof error.message === "string" && error.message.length > 0) {
      return error.message;
    }
    if (typeof error.error === "string" && error.error.length > 0) {
      return error.error;
    }
  }
  return fallback;
};

export const createError = (message, code = "UNKNOWN_ERROR") => {
  const error = new Error(normalizeErrorMessage(message));
  error.code = code;
  return error;
};

export const formatError = (
  error,
  fallback = "Ocurrió un error inesperado. Intenta de nuevo.",
) => {
  const message = normalizeErrorMessage(error, fallback);
  return {
    message,
    code: error?.code || error?.status || "UNKNOWN_ERROR",
    original: error,
  };
};
