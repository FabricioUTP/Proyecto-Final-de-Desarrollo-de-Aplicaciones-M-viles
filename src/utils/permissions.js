import { Alert, Linking, Platform } from "react-native";

/**
 * Estados posibles tras solicitar un permiso:
 * - "granted": el usuario lo concedió, se puede continuar.
 * - "denied": el usuario lo rechazó pero el sistema operativo todavía
 *   permite volver a preguntar (típico la primera vez que se rechaza).
 * - "blocked": el usuario lo rechazó de forma permanente ("No volver a
 *   preguntar" en Android, o ya fue rechazado antes en iOS). En este caso
 *   ya no sirve volver a pedirlo con la API, hay que mandar al usuario a
 *   Ajustes del sistema.
 */
export const evaluatePermissionResult = (result) => {
  if (result.granted || result.status === "granted") return "granted";
  if (result.canAskAgain === false) return "blocked";
  return "denied";
};

/**
 * Solicita un permiso usando la función de Expo que se le pase
 * (ej. ImagePicker.requestCameraPermissionsAsync) y devuelve un
 * estado normalizado + el resultado crudo.
 */
export const requestPermission = async (requestFn) => {
  const result = await requestFn();
  return { state: evaluatePermissionResult(result), raw: result };
};

/**
 * Abre la pantalla de ajustes de la app en el sistema operativo,
 * para que el usuario pueda activar manualmente un permiso bloqueado.
 */
export const openAppSettings = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings();
  }
};

/**
 * Muestra el Alert adecuado según el estado del permiso:
 * - "denied": invita a intentar de nuevo (el sistema todavía preguntará).
 * - "blocked": explica que debe activarlo manualmente y ofrece un botón
 *   directo para abrir Ajustes.
 */
export const showPermissionAlert = (permissionLabel, state) => {
  if (state === "blocked") {
    Alert.alert(
      `Permiso de ${permissionLabel} desactivado`,
      `KronoTask necesita acceso a ${permissionLabel} para esta función. Lo desactivaste anteriormente, así que debes activarlo manualmente desde Ajustes.`,
      [
        { text: "Ahora no", style: "cancel" },
        { text: "Abrir Ajustes", onPress: openAppSettings },
      ],
    );
    return;
  }

  Alert.alert(
    `Permiso de ${permissionLabel} requerido`,
    `KronoTask necesita acceso a ${permissionLabel} para continuar con esta acción.`,
  );
};