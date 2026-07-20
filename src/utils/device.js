import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { requestPermission } from "./permissions";

/**
 * Abre la cámara del dispositivo y devuelve el URI de la foto tomada.
 * Devuelve null si el usuario cancela.
 */
export const takePhoto = async () => {
  const { state } = await requestPermission(ImagePicker.requestCameraPermissionsAsync);
  if (state !== "granted") {
    return { ok: false, reason: state }; // "denied" | "blocked"
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.6, // comprimimos para no llenar AsyncStorage con base64/uri pesados
  });

  if (result.canceled) {
    return { ok: false, reason: "canceled" };
  }

  return { ok: true, uri: result.assets[0].uri };
};

/**
 * Permite elegir una foto de la galería como alternativa a la cámara.
 */
export const pickPhotoFromGallery = async () => {
  const { state } = await requestPermission(ImagePicker.requestMediaLibraryPermissionsAsync);
  if (state !== "granted") {
    return { ok: false, reason: state };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.6,
  });

  if (result.canceled) {
    return { ok: false, reason: "canceled" };
  }

  return { ok: true, uri: result.assets[0].uri };
};

/**
 * Obtiene la ubicación GPS actual del dispositivo y la convierte
 * en una dirección legible (reverse geocoding).
 */
export const getCurrentLocation = async () => {
  const { state } = await requestPermission(Location.requestForegroundPermissionsAsync);
  if (state !== "granted") {
    return { ok: false, reason: state };
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = position.coords;

    let address = "";
    try {
      const places = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (places.length > 0) {
        const place = places[0];
        address = [place.street, place.district, place.city]
          .filter(Boolean)
          .join(", ");
      }
    } catch {
      // El reverse geocoding puede fallar (sin internet, límites de la API).
      // No es crítico: igual tenemos las coordenadas.
    }

    return {
      ok: true,
      location: { latitude, longitude, address },
    };
  } catch (error) {
    return { ok: false, reason: "unavailable", error };
  }
};
