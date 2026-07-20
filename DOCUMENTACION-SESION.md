# Documentación de la sesión de trabajo — KronoTask

**Proyecto:** KronoTask — Aplicación móvil de gestión de tareas empresariales
**Stack:** React Native 0.81 + Expo SDK 54 (New Architecture)
**Objetivo de la sesión:** revisar la rúbrica del proyecto final, corregir hallazgos y lograr el primer *development build* nativo funcionando en un dispositivo Android físico.

---

## 1. Resumen ejecutivo

Se partió de un proyecto que cumplía los avances 1, 2 y 3 a nivel de código, pero que **no compilaba a un build nativo** y arrastraba configuración muerta. Al final de la sesión:

- El proyecto compila e instala como APK nativo en un teléfono Android real.
- Las tres funcionalidades nativas (cámara, GPS, notificaciones) quedan operativas.
- Se corrigió el bug que impedía que los recordatorios (notificaciones locales) se dispararan.
- Se limpió la configuración del proyecto (dependencias, `app.json`, `package.json`).

---

## 2. Revisión contra la rúbrica

Se compararon las 4 rúbricas (APF1, APF2, APF3 y Proyecto Final) contra el estado del repositorio.

**Cubierto correctamente:** estructura del proyecto, interfaz con componentes básicos, diseño responsivo, navegación (React Navigation), hooks (`useState`/`useEffect`/`useApi`), consumo de dos APIs con estados de carga/error, persistencia con AsyncStorage, cámara, GPS, notificaciones, gestión de permisos, logging y `ErrorBoundary`.

**Hallazgos que se corrigieron o quedaron identificados:**

| # | Hallazgo | Estado |
|---|---|---|
| 1 | El build fallaba: `app.json` referenciaba imágenes de íconos inexistentes | ✅ Corregido |
| 2 | Configuración muerta de `expo-router` en un proyecto que usa React Navigation | ✅ Corregido |
| 3 | Dependencias sin uso en `package.json` | ✅ Corregido |
| 4 | Nombre del proyecto genérico (`proyectoApp`) | ✅ Corregido |
| 5 | No existía build nativo ni evidencia de despliegue | ✅ Build generado |
| 6 | Los recordatorios no disparaban notificación | ✅ Corregido |
| 7 | Falta material de sustentación y capturas de notificaciones/permisos | 🔜 Pendiente (tarea del equipo) |

---

## 3. Cambios de configuración

### 3.1 `app.json`

- `name`: `proyectoApp` → **`KronoTask`**
- `slug`: `proyectoApp` → **`kronotask`**
- `scheme`: `proyectoapp` → **`kronotask`**
- `icon`, `adaptiveIcon`, `splash`, `favicon`: todas las referencias a imágenes inexistentes (`icon.png`, `splash-icon.png`, `android-icon-*.png`, `favicon.png`) ahora apuntan a **`logo.png`** (500×500, sí existe). Este era el motivo real por el que `expo prebuild` / `run:android` fallaba.
- Se agregó **`android.package: com.kronotask.app`** (obligatorio para generar el build).
- Se eliminó el plugin **`expo-router`** y la experiment **`typedRoutes`** (la app usa `App.jsx` + React Navigation, no file-based routing).
- `web.output`: `static` → **`single`** (evita el error *"static rendering requires the expo-router package"* al arrancar Metro).

### 3.2 `package.json`

- `name`: `proyectoapp` → **`kronotask`**
- Se eliminó el script `reset-project` (apuntaba a un archivo inexistente).
- Se eliminaron **8 dependencias sin uso**: `expo-router`, `@react-navigation/bottom-tabs`, `@react-navigation/elements`, `expo-haptics`, `expo-image`, `expo-linking`, `expo-symbols`, `expo-web-browser`.

### 3.3 `.expo/types/router.d.ts`

Se neutralizó el archivo generado por `expo-router` (importaba el paquete eliminado y rompía el linting).

---

## 4. Corrección del sistema de notificaciones

**Síntoma:** el apartado de recordatorio de tareas existía en la UI, pero al vencer el tiempo **no aparecía ninguna notificación**.

**Causa raíz:** dos incompatibilidades con la API de `expo-notifications` en SDK 52+.

1. El *trigger* se pasaba como un objeto `Date` directo. Desde SDK 52 el trigger debe ser un **objeto tipado**; pasar un `Date` lanza un error silencioso y la notificación nunca se programa.
2. El handler usaba solo `shouldShowAlert`, propiedad reemplazada en SDK 53 por `shouldShowBanner` / `shouldShowList`.

**Solución aplicada en `src/utils/notifications.js`:**

Handler actualizado con las nuevas propiedades:

```js
handleNotification: async () => ({
  shouldShowAlert: true,     // compatibilidad
  shouldShowBanner: true,    // SDK 53+
  shouldShowList: true,      // SDK 53+
  shouldPlaySound: true,
  shouldSetBadge: false,
}),
```

Trigger corregido a la forma tipada + canal Android + log de diagnóstico:

```js
trigger: {
  type: Notifications.SchedulableTriggerInputTypes.DATE,
  date: fireDate,
  channelId: "default",
},
```

El cálculo de la fecha de disparo (`getReminderFireDate` en `CreateTaskScreen.jsx`) ya era correcto, no requirió cambios.

---

## 5. Proceso de build nativo (Android)

Esta fue la parte más laboriosa. Se resolvieron, en orden, los siguientes obstáculos del entorno Windows:

| Error | Causa | Solución |
|---|---|---|
| `expo prebuild` fallaba | Assets de íconos inexistentes | Corregir `app.json` (ver §3.1) |
| `Failed to resolve the Android SDK path` | `ANDROID_HOME` sin definir | Configurar variable de entorno al SDK |
| `adb no se reconoce` | `platform-tools` fuera del PATH | Agregar al PATH |
| `JAVA_HOME is not set` | Sin JDK en el entorno | Usar el JDK integrado de Android Studio (`\jbr`) |
| `No connected device found` | Depuración USB / cable | Activar depuración USB y modo transferencia de archivos |
| `ninja: error: mkdir ... No such file` | **Ruta del proyecto demasiado larga** (límite de 260 caracteres de Windows) | Renombrar la carpeta a `kronotask` |
| `No variants exist` / `different roots` | Caché de build generada con la ruta antigua | Limpiar cachés de Gradle y `node_modules/*/android/build` |
| `INSTALL_FAILED_USER_RESTRICTED` | El teléfono bloqueó la instalación por USB | Activar "Instalar vía USB" en Opciones de desarrollador |

### 5.1 Script de automatización

Se creó **`compilar-android.cmd`** en la raíz del proyecto. Ejecuta todo el flujo con un doble clic:

1. Define `ANDROID_HOME`, `JAVA_HOME` y `PATH` solo para esa ventana.
2. Verifica que `adb` y `java` existan antes de empezar.
3. Detiene daemons de Gradle antiguos.
4. Limpia cachés de compilaciones previas (Gradle + `.cxx` + `android/build` de cada módulo nativo).
5. Verifica el teléfono conectado (`adb devices`).
6. Compila e instala con `npx expo run:android`, guardando el log completo en `build-log-k.txt`.

### 5.2 Requisitos del entorno (para futuras compilaciones)

- **Android Studio** con SDK Platform 34+ y Platform-Tools instalados.
- La carpeta del proyecto debe estar en una **ruta corta** (ej. `C:\Users\df10x\Documents\GitHub\kronotask`).
- Teléfono con **Depuración USB** e **Instalar vía USB** activados.
- Primer build: 5–15 min. Builds siguientes: 1–2 min.

---

## 6. Estado de las vulnerabilidades (`npm audit`)

Tras `npm audit fix`, las vulnerabilidades restantes son **todas transitivas del tooling de Expo/ESLint** (babel, tar, undici, postcss, uuid…), no del código empaquetado en el APK. **No ejecutar `npm audit fix --force`**: instalaría Expo SDK 57 y rompería el proyecto (está en SDK 54).

---

## 7. Pendientes para cerrar la rúbrica del Proyecto Final

1. **Capturas de evidencia:** notificación de recordatorio disparándose, diálogos de permisos (cámara/GPS/notificaciones), app instalada en el teléfono.
2. **Actualizar el README:** cambiar el estado del "Avance Final" de 🔜 Pendiente a ✅, y añadir la sección de arquitectura general del proyecto final.
3. **Material de sustentación:** presentación y/o video demostrativo del flujo completo.
4. **Regenerar `package-lock.json`** ya realizado con `npm install` tras la limpieza de dependencias.

---

## 8. Archivos modificados/creados en esta sesión

| Archivo | Acción |
|---|---|
| `app.json` | Modificado (nombre, package, íconos, plugins, web.output) |
| `package.json` | Modificado (nombre, dependencias, scripts) |
| `.expo/types/router.d.ts` | Neutralizado |
| `src/utils/notifications.js` | Corregido (handler + trigger) |
| `compilar-android.cmd` | Creado (script de build) |
| `build-log-k.txt` | Generado (log de compilación) |
| `DOCUMENTACION-SESION.md` | Este documento |

---

*Documento generado como registro técnico de la sesión de puesta en marcha del build nativo de KronoTask.*
