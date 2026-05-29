// src/hooks/useApi.js
// Hook personalizado para el consumo de APIs
// Maneja los tres estados requeridos por la rúbrica:
//   - loading  → mientras se espera la respuesta
//   - error    → si la petición falla
//   - data     → cuando la respuesta es exitosa

import { useCallback, useEffect, useRef, useState } from "react";
import { formatError } from "../utils/error";

/**
 * useApi
 * @param {Function} apiFn     - Función async que realiza la petición
 * @param {Array}    deps      - Dependencias que disparan una nueva petición
 * @param {boolean}  immediate - Si es true, ejecuta al montar el componente
 *
 * Retorna: { data, loading, error, refetch }
 */
const useApi = (apiFn, deps = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Evita actualizar el estado si el componente ya fue desmontado
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ── Función principal de fetch ──────────────────────────
  const execute = useCallback(async (...args) => {
    if (!isMounted.current) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFn(...args);
      if (isMounted.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        setData(null);
        setError(formatError(err).message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // ── Ejecutar automáticamente al montar ──────────────────
  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  // refetch permite volver a ejecutar la petición manualmente
  return { data, loading, error, refetch: execute };
};

export default useApi;
