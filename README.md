# 📋 KronoTask

### Aplicación Móvil de Gestión de Tareas Empresariales

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" />
  <img src="https://img.shields.io/badge/Android_Studio-3DDC84?style=for-the-badge&logo=android&logoColor=white" />
</p>

---

## 📌 Descripción del Proyecto

**KronoTask** es una aplicación móvil multiplataforma diseñada para la gestión de tareas dentro de un entorno empresarial. Ofrece un flujo completo de trabajo para usuarios que necesitan crear, administrar y seguir el progreso de sus tareas de manera organizada.

Implementada con **React Native** y **Expo**, la aplicación presenta una estructura modular, navegación fluida, almacenamiento local por usuario y un directorio de equipo con datos externos simulados.

---

## ⚡ Funcionalidades principales

- Autenticación con registro de usuarios y login.
- Persistencia de sesión usando `AsyncStorage`.
- CRUD completo de tareas: crear, leer, editar, marcar como completada/pendiente y eliminar.
- Dashboard con métricas de tareas totales, pendientes y completadas.
- Filtros de tareas por estado.
- Directorio de equipo con consumo de API externa y manejo de estados de carga, error y vacío.
- Interfaz con animaciones, tarjetas y feedback visual.

---

## 👥 Equipo de Desarrollo

| #   | Nombre Completo                    | Rol                                            |
| --- | ---------------------------------- | ---------------------------------------------- |
| 1   | Fabricio Manuel Munives Santamaría | Desarrollador Mobile / Frontend / Backend / DB |
| 2   | Elmer Diego Falla Samaniego        | Desarrollador Mobile / Frontend / Backend / DB |

---

## 🛠️ Tecnologías y Lenguajes

| Tecnología        | Versión  | Descripción                          |
| ----------------- | -------- | ------------------------------------ |
| React Native      | 0.81.5   | Framework principal de la app móvil  |
| Expo              | ~54.0.33 | Plataforma de desarrollo y ejecución |
| JavaScript (ES6+) | —        | Lenguaje principal                   |
| JSX               | —        | Sintaxis de UI para React            |
| React Navigation  | ^7.14.11 | Navegación entre pantallas           |
| AsyncStorage      | 2.2.0    | Persistencia local de datos          |

---

## 📁 Estructura del Proyecto

```
Proyecto-Final-de-Desarrollo-de-Aplicaciones-M-viles/
│
├── assets/                        # Recursos gráficos e imágenes
│   └── images/
│
├── src/
│   ├── components/                # Componentes reutilizables
│   │   ├── TaskCard.jsx           # Tarjeta de tarea
│   │   └── UserMenuButton.jsx     # Botón de menú de usuario
│   │
│   ├── context/                   # Manejo de estado global
│   │   ├── AuthContext.jsx        # Autenticación y sesión
│   │   └── TaskContext.jsx        # CRUD de tareas y persistencia
│   │
│   ├── hooks/                     # Hooks personalizados
│   │   └── useApi.js              # Hook para requests con estados
│   │
│   ├── navigation/                # Configuración de rutas
│   │   └── AppNavigator.jsx       # Navegación principal
│   │
│   ├── screens/                   # Pantallas principales
│   │   ├── LoginScreen.jsx
│   │   ├── CreateAccountScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── CreateTaskScreen.jsx
│   │   ├── TaskDetailScreen.jsx
│   │   └── TeamScreen.jsx
│   │
│   └── theme/                     # Paleta y estilos globales
│       └── colors.js
│
├── App.jsx                        # Punto de entrada
├── app.json                       # Configuración de Expo
├── package.json                   # Dependencias y scripts
└── README.md                      # Documentación del proyecto
```

---

## 📌 Pantallas principales

### 🔐 Login

- `src/screens/LoginScreen.jsx`
- Formulario con validación de correo y contraseña.
- Mensajes de error y animación de feedback.
- Acceso a la app al iniciar sesión.

### 🧑‍💼 Registro

- `src/screens/CreateAccountScreen.jsx`
- Registro de usuario con nombre, cargo, email y contraseña.
- Validaciones de entradas y verificación de contraseñas.
- Persistencia de la nueva cuenta y sesión automática.

### 🏠 Dashboard de tareas

- `src/screens/HomeScreen.jsx`
- Lista de tareas con filtrado por estado.
- Estadísticas de tareas totales, pendientes y completadas.
- Navegación al detalle y al directorio de equipo.

### ✏️ Crear / editar tarea

- `src/screens/CreateTaskScreen.jsx`
- Formulario para nueva tarea o edición de una existente.
- Selección de categoría, prioridad y descripción.
- Validaciones de campos y vista previa.

### 📄 Detalle de tarea

- `src/screens/TaskDetailScreen.jsx`
- Información completa de la tarea.
- Cambio de estado pendiente/completada.
- Edición desde el detalle.
- Eliminación con confirmación.

### 👥 Directorio de equipo

- `src/screens/TeamScreen.jsx`
- Consumo de API externa para miembros y tareas.
- Estados de carga, error y vacío.
- Detalle de perfil de miembro.

---

## ⚡ Características principales

- Autenticación real con gestión de sesión.
- CRUD de tareas completamente funcional.
- Edición de tareas desde el detalle.
- Almacenamiento local independiente por usuario.
- Navegación con React Navigation.
- Presentación visual cuidada con animaciones.

---

## 🚀 Instalación y ejecución

```bash
git clone https://github.com/FabricioUTP/Proyecto-Final-de-Desarrollo-de-Aplicaciones-M-viles.git
cd Proyecto-Final-de-Desarrollo-de-Aplicaciones-M-viles
npm install
npm start
```

Para abrir en plataformas específicas:

```bash
npm run android
npm run ios
npm run web
```

> `npm run ios` requiere macOS.

---

## 🧪 Scripts disponibles

| Script            | Descripción                    |
| ----------------- | ------------------------------ |
| `npm start`       | Inicia Expo en modo desarrollo |
| `npm run android` | Abre la app en Android         |
| `npm run ios`     | Abre la app en iOS (macOS)     |
| `npm run web`     | Ejecuta la app en navegador    |
| `npm run lint`    | Ejecuta el linter de Expo      |

---

## 📌 Nota técnica

- El estado de autenticación y las tareas se guardan en `AsyncStorage`.
- El directorio de equipo consume datos desde `JSONPlaceholder`.
- `useApi.js` centraliza la gestión de peticiones con `loading`, `error` y `data`.
- El formulario de tareas puede crear o editar según reciba `taskId`.

---

## ✅ Estado actual

La aplicación cuenta con:

- CRUD completo de tareas.
- Autenticación y persistencia de sesión.
- Navegación entre todas las pantallas principales.
- Consumo de API externa y manejo completo de estados.
- Diseño visual coherente con experiencia móvil.

---

## 📚 Referencias clave

- `src/context/AuthContext.jsx` — gestión de autenticación.
- `src/context/TaskContext.jsx` — CRUD y persistencia de tareas.
- `src/screens/CreateTaskScreen.jsx` — creación y edición de tareas.
- `src/screens/TeamScreen.jsx` — consumo de API externa.
