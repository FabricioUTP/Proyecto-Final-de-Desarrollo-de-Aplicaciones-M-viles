# 📋 KronoTask
### Aplicación Móvil de Gestión de Tareas Empresariales

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/AsyncStorage-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" />
  <img src="https://img.shields.io/badge/Android_Studio-3DDC84?style=for-the-badge&logo=android&logoColor=white" />
</p>

---

## 📌 Descripción del Proyecto

**KronoTask** es una aplicación móvil multiplataforma orientada a la gestión de tareas dentro de un entorno empresarial. Permite a los usuarios organizar, visualizar y dar seguimiento a sus actividades diarias de manera eficiente, facilitando la productividad y el control operativo.

Desarrollada con **React Native** y **Expo**, la aplicación implementa buenas prácticas en estructuración de código, diseño responsivo y organización de componentes, con un flujo de navegación claro e intuitivo.

---

## 👥 Equipo de Desarrollo

| # | Nombre Completo | Rol |
|---|---|---|
| 1 | Fabricio Manuel Munives Santamaría | Desarrollador Mobile / Frontend / Backend / DB|
| 2 | Elmer Diego Falla Samaniego | Desarrollador Mobile / Frontend / Backend / DB|

---

## 🎨 Paleta de Colores

La paleta fue seleccionada para transmitir profesionalismo, claridad visual y buena legibilidad en entornos empresariales.

| Token | Color | Hex | Uso |
|---|---|---|---|
| `primary` | 🟣 Índigo | `#4F46E5` | Botones principales, headers, badges activos |
| `primaryDark` | 🟣 Índigo oscuro | `#3730A3` | Hover y estados presionados |
| `secondary` | 🟢 Esmeralda | `#10B981` | Tareas completadas, confirmaciones |
| `background` | ⚪ Gris claro | `#F9FAFB` | Fondo general de pantallas |
| `surface` | ⚪ Blanco | `#FFFFFF` | Cards, formularios, modales |
| `textPrimary` | ⚫ Gris oscuro | `#111827` | Títulos y texto principal |
| `textSecondary` | 🩶 Gris medio | `#6B7280` | Subtítulos, placeholders |
| `border` | 🩶 Gris borde | `#E5E7EB` | Bordes de inputs y separadores |
| `danger` | 🔴 Rojo | `#EF4444` | Errores, eliminar, alertas |
| `warning` | 🟡 Ámbar | `#F59E0B` | Prioridad media, advertencias |

---

## 🛠️ Tecnologías y Lenguajes

| Tecnología | Versión | Descripción |
|---|---|---|
| **React Native** | 0.76+ | Framework principal para desarrollo móvil multiplataforma |
| **Expo** | SDK 52+ | Entorno de desarrollo y herramienta de build |
| **JavaScript (ES6+)** | — | Lenguaje principal de programación |
| **JSX** | — | Extensión de sintaxis para la definición de interfaces |
| **CSS-in-JS (StyleSheet)** | — | Estilos mediante la API nativa de React Native |
| **React Navigation** | v6 | Navegación entre pantallas |
| **AsyncStorage** | 2.1+ | Persistencia de datos local por usuario |
| **Random User API** | — | API pública para directorio del equipo con fotos reales |
| **JSONPlaceholder API** | — | API pública para tareas asignadas por miembro |

---

## 💻 Entorno de Desarrollo

| Herramienta | Descripción |
|---|---|
| **Visual Studio Code** | Editor de código principal |
| **Expo Go** | App para previsualización en dispositivo físico |
| **Android Emulator** | Emulador de dispositivo Android (Android Studio) |
| **Git + GitHub** | Control de versiones y repositorio remoto |
| **Node.js** | Entorno de ejecución necesario para Expo y npm |

### Extensiones recomendadas para VS Code

| Extensión | ID | Descripción |
|---|---|---|
| ES7+ React/Redux Snippets | `dsznajder.es7-react-js-snippets` | Snippets para componentes React Native |
| Prettier | `esbenp.prettier-vscode` | Formateador de código automático |
| ESLint | `dbaeumer.vscode-eslint` | Linter para mantener buenas prácticas |
| React Native Tools | `msjsdiag.vscode-react-native` | Soporte oficial de debugging para RN |
| GitLens | `eamodio.gitlens` | Visualización avanzada del historial Git |
| Auto Rename Tag | `formulahendry.auto-rename-tag` | Renombra etiquetas JSX automáticamente |
| Material Icon Theme | `PKief.material-icon-theme` | Íconos visuales para archivos y carpetas |

---

## 📁 Estructura del Proyecto (Segundo Avance)

```
KronoTask/
│
├── assets/                        # Recursos estáticos (imágenes, íconos, splash)
│   └── images/
│
├── src/
│   ├── components/                   # Componentes reutilizables
│   │   ├── TaskCard.jsx              # Tarjeta de tarea con props
│   │   └── UserMenuButton.jsx        # Avatar con menú desplegable de sesión
│   │
│   ├── context/                      # Estado global de la aplicación
│   │   ├── AuthContext.jsx           # Autenticación: login, registro y sesión
│   │   └── TaskContext.jsx           # Tareas con persistencia por usuario
│   │
│   ├── hooks/                        # Hooks personalizados
│   │   └── useApi.js                 # Hook para consumo de APIs con loading/error/data
│   │
│   ├── navigation/                   # Configuración de navegación
│   │   └── AppNavigator.jsx          # Stack Navigator principal
│   │
│   ├── screens/                      # Pantallas de la aplicación
│   │   ├── LoginScreen.jsx           # Pantalla de inicio de sesión
│   │   ├── CreateAccountScreen.jsx   # Pantalla de registro de usuario
│   │   ├── HomeScreen.jsx            # Dashboard principal con lista de tareas
│   │   ├── CreateTaskScreen.jsx      # Formulario para crear nueva tarea
│   │   ├── TaskDetailScreen.jsx      # Detalle y gestión de una tarea
│   │   └── TeamScreen.jsx            # Directorio del equipo (Random User API)
│   │
│   ├── services/                     # Capa de servicios externos
│   │   └── api.js                    # Random User API + JSONPlaceholder
│   │
│   ├── theme/                        # Estilos y tokens globales
│   │    └── colors.js                 # Paleta de colores centralizada
│   │
│   └── utils/                        # Capa de lógica de componentes
│       ├── error.js                  # Lógica de manejo de errores
│       └── normalize.js              # Lógica de normalización
│
├── App.jsx                           # Punto de entrada con AuthProvider + TaskProvider
├── app.json                          # Configuración de Expo
├── package.json                      # Dependencias del proyecto
└── README.md                         # Documentación del proyecto
```

---

## ⚙️ Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalados los siguientes programas antes de continuar:

- [Node.js](https://nodejs.org/) (versión LTS recomendada, 18+)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- Cuenta en [Expo](https://expo.dev/) (gratuita)
- App **Expo Go** instalada en tu dispositivo móvil

---

### Paso 1 — Verificar instalación de Node.js y npm

```bash
node --version
npm --version
```

---

### Paso 2 — Instalar Expo CLI de forma global

```bash
npm install -g expo-cli
```

Verificar instalación:

```bash
expo --version
```

---

### Paso 3 — Crear el proyecto con Expo

```bash
npx create-expo-app@latest proyectoApp
cd proyectoApp
```

---

### Paso 4 — Instalar dependencias de navegación

```bash
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

---

### Paso 5 — Instalar dependencias complementarias

```bash
# Íconos vectoriales
npx expo install @expo/vector-icons

# Manejo de fuentes personalizadas (opcional pero recomendado)
npx expo install expo-font

# Persistencia local — requerido para autenticación y almacenamiento de tareas
npx expo install @react-native-async-storage/async-storage
```

---

### Paso 6 — Ejecutar la aplicación

```bash
npx expo start
```

Luego elige una de las siguientes opciones en la terminal:

| Tecla | Acción |
|---|---|
| `a` | Abrir en emulador Android |
| `i` | Abrir en simulador iOS (solo Mac) |
| `w` | Abrir en navegador web |
| Escanear QR | Visualizar en dispositivo físico con Expo Go |

---

### Credenciales de acceso de prueba

| Campo | Valor |
|---|---|
| Correo | `admin@kronotask.com` |
| Contraseña | `Admin123` |

---

## 📱 Vistas — Avance 2 (Semana 10)

Este segundo avance cuenta con **6 pantallas** funcionales, autenticación local completa, persistencia de datos por usuario y consumo de dos APIs externas en tiempo real.

---

### 1. 🔐 Pantalla de login
**Archivo:** `src/screens/LoginScreen.js`

Pantalla de inicio de sesión con validación de credenciales contra AsyncStorage.

| Elemento | Detalle |
|---|---|
| Campos | Correo corporativo y contraseña |
| Validaciones | Campo vacío, formato de email, mínimo 6 caracteres |
| Autenticación | Verifica credenciales contra usuarios guardados en AsyncStorage |
| Retroalimentación | Banner de error al ingresar credenciales incorrectas, animación de shake |
| Show/hide | Botón para mostrar u ocultar contraseña |
| Navegación | Guard automático redirige al Home si hay sesión activa |
| Componentes | `TextInput`, `TouchableOpacity`, `KeyboardAvoidingView`, `ScrollView`, `Image`, `Animated` |

---

### 2. 👤 Pantalla de crear cuenta
**Archivo:** `src/screens/CreateAccountScreen.jsx`

Formulario de registro empresarial que guarda el usuario en AsyncStorage.

| Elemento | Detalle |
|---|---|
| Campos | Nombre completo, cargo en la empresa, correo corporativo, contraseña y confirmar contraseña |
| Validaciones | Campos obligatorios, solo letras en nombre, formato de email, mínimo 6 caracteres, al menos 1 mayúscula y 1 número, coincidencia de contraseñas |
| Persistencia | Usuario guardado en AsyncStorage con clave `@kronotask_users` |
| Retroalimentación | Indicador de requisitos en tiempo real, confirmación verde al coincidir contraseñas, banner de error si el correo ya existe |
| Animaciones | Shake al error, pantalla de éxito animada al crear cuenta |
| Show/hide | Botón para mostrar u ocultar contraseña en ambos campos |
| Navegación | Guard automático redirige al Home tras el registro |
| Componentes | `TextInput`, `TouchableOpacity`, `KeyboardAvoidingView`, `ScrollView`, `Image`, `Animated` |

---

### 3. 🏠 Pantalla principal (Dashboard)
**Archivo:** `src/screens/HomeScreen.js`

Panel principal con tareas persistidas por usuario y acceso al directorio del equipo.

| Elemento | Detalle |
|---|---|
| Barra superior | Logo y nombre de la app a la izquierda, avatar con menú desplegable a la derecha |
| Menú de usuario | Al tocar el avatar aparece dropdown con info del usuario y opción de cerrar sesión |
| Lista dinámica | Renderizada con `FlatList`, tareas cargadas desde AsyncStorage |
| Filtros | Todas / Pendientes / Completadas |
| Estadísticas | Cards con total, pendientes y completadas por usuario |
| Progreso | Barra animada con porcentaje de tareas completadas |
| Directorio | Banner de acceso rápido a la pantalla del equipo |
| Almacenamiento | Tareas únicas por cuenta — clave `@kronotask_tasks_<userId>` |
| Componentes | `FlatList`, `TouchableOpacity`, `Image`, `Animated`, `ActivityIndicator`, `TaskCard` |

---

### 4. ✏️ Pantalla de crear tarea
**Archivo:** `src/screens/CreateTaskScreen.js`

Formulario interactivo para registrar nuevas tareas persistidas automáticamente en AsyncStorage.

| Elemento | Detalle |
|---|---|
| Campos | Título (máx. 80 caracteres) y descripción (máx. 300 caracteres) |
| Validaciones | Campos obligatorios, mínimo 5 caracteres en título y 10 en descripción |
| Categoría | Selector visual: 💼 Comercial / 🎨 Diseño / 💻 Desarrollo / 📊 Gestión / 📣 Marketing / 🛠️ Soporte |
| Prioridad | Selector visual: 🔴 Alta / 🟡 Media / 🟢 Baja |
| Vista previa | Previsualización en tiempo real de la tarea mientras se escribe |
| Animaciones | Shake al error, animación de entrada del formulario, botón animado |
| Persistencia | Tarea guardada automáticamente en AsyncStorage del usuario activo |
| Componentes | `TextInput`, `TouchableOpacity`, `ScrollView`, `KeyboardAvoidingView`, `Image`, `Animated` |

---

### 5. 🔍 Pantalla de detalle de tarea
**Archivo:** `src/screens/TaskDetailScreen.js`

Vista detallada de una tarea. Cambios de estado se sincronizan automáticamente con AsyncStorage.

| Elemento | Detalle |
|---|---|
| Información | Título, descripción, estado, prioridad, categoría y fecha de creación |
| Header dinámico | Cambia de color índigo a verde según el estado de la tarea |
| Metadatos | Cards con prioridad, fecha de creación y categoría |
| Barra de estado | Indicador visual del flujo: Creada → En curso / Completada |
| Acciones | Marcar como completada / pendiente (`TouchableOpacity`) y eliminar tarea (`Button`) |
| Persistencia | Cambios de estado y eliminación sincronizados con AsyncStorage |
| Animaciones | Fade + slide de entrada, animación del botón de acción, header animado según estado |
| Componentes | `ScrollView`, `TouchableOpacity`, `Button`, `Image`, `Animated`, `Alert` |

---

### 6. 👥 Pantalla de directorio del equipo
**Archivo:** `src/screens/TeamScreen.jsx`

Directorio corporativo con perfiles reales obtenidos de dos APIs externas en tiempo real.

| Elemento | Detalle |
|---|---|
| API principal | Random User API — fotos reales de perfil, nombre, cargo, ciudad, país y edad |
| API secundaria | JSONPlaceholder — tareas asignadas por miembro del equipo |
| Equipo personalizado | Cada cuenta ve un equipo distinto (seed basado en el userId) |
| Fotos de perfil | `Image` con URI de red en tres tamaños: thumbnail, medium y large |
| Estado loading | Skeleton animado mientras se cargan los datos |
| Estado error | Pantalla de error con botón "Reintentar" que relanza la petición |
| Estado vacío | Pantalla con mensaje si no hay miembros disponibles |
| Pull-to-refresh | Desliza hacia abajo para recargar el directorio en tiempo real |
| Modal de detalle | Al tocar un miembro se abre modal con perfil completo y sus tareas |
| Hook personalizado | `useApi` gestiona los estados loading, error y data de cada petición |
| Componentes | `FlatList`, `Image`, `ActivityIndicator`, `RefreshControl`, `Animated`, `Modal` |

### Flujo de navegación

```
App inicia
  ├── Sin sesión  ──▶ LoginScreen
  │                       ├──▶ CreateAccountScreen ──▶ (guard redirige a Home)
  │                       └──▶ (guard redirige a Home al loguearse)
  │
  └── Con sesión ──▶ HomeScreen
                        ├──▶ TeamScreen ──▶ (regresa al Home)
                        ├──▶ CreateTaskScreen ──▶ (regresa al Home)
                        └──▶ TaskDetailScreen ──▶ (regresa al Home)

HomeScreen (avatar) ──▶ Menú desplegable ──▶ Cerrar sesión ──▶ LoginScreen
```

---

## 🔌 APIs Externas Consumidas

| API | Endpoint | Uso | Autenticación |
|---|---|---|---|
| **Random User API** | `randomuser.me/api/?results=10&seed=<userId>` | Directorio del equipo con fotos reales | Sin API key |
| **JSONPlaceholder** | `jsonplaceholder.typicode.com/todos?userId=<id>` | Tareas asignadas por miembro | Sin API key |

---

## 💾 Almacenamiento Local (AsyncStorage)

| Clave | Contenido | Descripción |
|---|---|---|
| `@kronotask_users` | Array de usuarios registrados | Cuentas creadas en la app |
| `@kronotask_session` | Objeto del usuario activo | Sesión activa (sin contraseña) |
| `@kronotask_tasks_<userId>` | Array de tareas del usuario | Tareas únicas por cuenta |

---

## 🗺️ Roadmap del Proyecto

| Avance | Contenido | Estado |
|---|---|---|
| **Avance 1** | Estructura, interfaz, navegación, formularios con validaciones | ✅ Completado |
| **Avance 2** | Hooks, consumo de APIs, persistencia con AsyncStorage, autenticación local | ✅ Completado |
| **Avance 3** | Aún no especificado | 🔜 Pendiente |

---

## 📸 Capturas de Pantalla

A continuación se muestran las principales vistas de la aplicación **KronoTask**, correspondientes a las pantallas desarrolladas en el Avance 2.

---

### 🔐 Pantalla de inicio de sesión

<p align="center">
  <img src="./assets/images/login.png" width="300" />
</p>

---

### 👤 Pantalla de crear cuenta
<p align="center">
  <img src="./assets/images/crearCuenta.png" width="300" />
</p>

---

### 🏠 Pantalla principal (Dashboard)

<p align="center">
  <img src="./assets/images/home.png" width="300" />
</p>

---

### ✏️ Pantalla de creación de tarea

<p align="center">
  <img src="./assets/images/crearTarea.png" width="300" />
</p>

---

### 🔍 Pantalla de detalle de tarea

<p align="center">
  <img src="./assets/images/detalleTarea.png" width="300" />
</p>

---

### 👥 Pantalla de directorio del equipo

<p align="center">
  <img src="./assets/images/equipo.png" width="300" />
</p>

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para el curso de Desarrollo de Aplicaciones Móviles.

---
