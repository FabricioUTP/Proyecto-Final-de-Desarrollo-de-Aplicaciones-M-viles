import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { requestPermission, showPermissionAlert } from "./permissions";

/**
 * NOTA: KronoTask usa únicamente notificaciones LOCALES (programadas en
 * el dispositivo). Las notificaciones remotas/push no son necesarias y
 * fueron eliminadas de Expo Go en SDK 53 — el aviso que muestra la
 * consola es informativo y no afecta el funcionamiento de la app.
 */

export const configureNotificationHandler = () => {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        // SDK 53+: shouldShowAlert fue reemplazado por Banner/List.
        // Se mantienen ambos por compatibilidad.
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // En algunos entornos (web, simulador sin soporte) puede fallar sin
    // consecuencias para el flujo principal de la app.
  }


  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "Recordatorios de tareas",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    }).catch(() => {});
  }
};

/**
 * Verifica y solicita permisos para notificaciones locales.
 * Solo pide el permiso si aún no fue concedido, para no interrumpir
 * al usuario innecesariamente en cada acción.
 */
export const ensureNotificationPermission = async () => {
  if (!Device.isDevice) {
    // En emuladores las notificaciones locales no se muestran; en lugar
    // de bloquear el flujo simplemente retornamos ok para no interrumpir
    // las pruebas en simulador.
    return { ok: true };
  }

  try {
    // Verificar primero el estado actual antes de volver a pedir
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) return { ok: true };

    const { state } = await requestPermission(Notifications.requestPermissionsAsync);
    if (state !== "granted") {
      showPermissionAlert("las notificaciones", state);
      return { ok: false, reason: state };
    }
    return { ok: true };
  } catch {
    // Si el sistema de permisos falla (caso raro), no bloqueamos la app
    return { ok: false, reason: "unavailable" };
  }
};

/**
 * Programa un recordatorio local para una tarea en una fecha futura.
 * Devuelve el id de la notificación para poder cancelarla después.
 */
export const scheduleTaskReminder = async (task, fireDate) => {
  const permission = await ensureNotificationPermission();
  if (!permission.ok) return null;

  if (fireDate.getTime() <= Date.now()) return null;

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Recordatorio de tarea",
        body: task.title,
        data: { taskId: task.id },
      },
      // SDK 52+: el trigger debe ser un objeto tipado; pasar un Date
      // directo lanza un error y la notificación nunca se programa.
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireDate,
        channelId: "default",
      },
    });
    return notificationId;
  } catch (error) {
    console.warn("[notifications] No se pudo programar el recordatorio:", error?.message);
    return null;
  }
};

/**
 * Cancela un recordatorio programado (tarea completada, editada o eliminada).
 */
export const cancelTaskReminder = async (notificationId) => {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Ya se disparó o no existe; no hay acción necesaria.
  }
};

/**
 * Notificación inmediata de confirmación al completar una tarea.
 */
export const notifyTaskCompleted = async (task) => {
  const permission = await ensureNotificationPermission();
  if (!permission.ok) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✅ Tarea completada",
        body: `Marcaste "${task.title}" como completada.`,
      },
      trigger: null,
    });
  } catch {
    // Si la notificación falla, no interrumpimos el flujo principal.
  }
};