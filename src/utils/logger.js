// src/utils/logger.js
// Sistema de logging centralizado para KronoTask.
// En desarrollo imprime en consola con colores por nivel.
// En producción solo guarda en el buffer interno (no hay consola).
// Los últimos 100 eventos quedan en memoria y se pueden exportar
// desde la pantalla de diagnóstico del administrador.

const IS_DEV = __DEV__;

const LEVELS = {
  INFO:  "INFO",
  WARN:  "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
};

// Buffer en memoria — los últimos MAX_ENTRIES registros
const MAX_ENTRIES = 100;
const _logs = [];

const _push = (level, context, message, meta) => {
  const entry = {
    level,
    context,
    message,
    meta: meta ?? null,
    timestamp: new Date().toISOString(),
  };
  _logs.push(entry);
  if (_logs.length > MAX_ENTRIES) _logs.shift();
  return entry;
};

const _print = (entry) => {
  if (!IS_DEV) return;
  const tag = `[${entry.level}][${entry.context}]`;
  if (entry.level === LEVELS.ERROR) {
    console.error(tag, entry.message, entry.meta ?? "");
  } else if (entry.level === LEVELS.WARN) {
    console.warn(tag, entry.message, entry.meta ?? "");
  } else {
    console.log(tag, entry.message, entry.meta ?? "");
  }
};

const _log = (level, context, message, meta) => {
  const entry = _push(level, context, message, meta);
  _print(entry);
};

// ── API pública ───────────────────────────────────────────

const Logger = {
  info:  (context, message, meta) => _log(LEVELS.INFO,  context, message, meta),
  warn:  (context, message, meta) => _log(LEVELS.WARN,  context, message, meta),
  error: (context, message, meta) => _log(LEVELS.ERROR, context, message, meta),
  debug: (context, message, meta) => { if (IS_DEV) _log(LEVELS.DEBUG, context, message, meta); },

  /** Devuelve una copia del buffer de logs (útil para diagnóstico) */
  getLogs: () => [..._logs],

  /** Limpia el buffer (útil en logout para no mezclar sesiones) */
  clear: () => { _logs.length = 0; },
};

export default Logger;