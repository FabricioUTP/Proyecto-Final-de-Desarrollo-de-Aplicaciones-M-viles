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

## 📁 Estructura del Proyecto (Primer Avance)

```
KronoTask/
│
├── assets/                        # Recursos estáticos (imágenes, íconos, splash)
│   └── images/
│
├── src/
│   ├── components/                   # Componentes reutilizables
│   │   └── TaskCard.jsx              # Tarjeta de tarea con props
│   │
│   ├── context/                      # Manejo de estado global de la aplicación
│   │   └── TaskContext.jsx           # Contexto de tareas
│   │
│   ├── screens/                      # Pantallas de la aplicación
│   │   ├── LoginScreen.jsx           # Pantalla de inicio de sesión
│   │   ├── CreateAccountScreen.jsx   # Pantalla de registro de usuario
│   │   ├── HomeScreen.jsx            # Dashboard principal con lista de tareas
│   │   ├── CreateTaskScreen.jsx      # Formulario para crear nueva tarea
│   │   └── TaskDetailScreen.jsx      # Detalle y gestión de una tarea
│   │
│   ├── navigation/                   # Configuración de navegación
│   │   └── AppNavigator.jsx          # Stack Navigator principal
│   │
│   └── theme/                        # Estilos y tokens globales
│       └── colors.js                 # Paleta de colores centralizada
│
├── App.jsx                           # Punto de entrada de la aplicación
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

# Almacenamiento local (para el Avance 2)
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

## 📱 Vistas — Avance 1 (Semana 5)

Este primer avance cuenta con **5 pantallas** funcionales conectadas mediante navegación con React Navigation.

---

### 1. 🔐 Pantalla de login
**Archivo:** `src/screens/LoginScreen.js`

Pantalla de inicio de sesión empresarial. Implementa un formulario con validaciones en tiempo real.

| Elemento | Detalle |
|---|---|
| Campos | Correo corporativo y contraseña |
| Validaciones | Campo vacío, formato de email, mínimo 6 caracteres, al menos 1 mayúscula y 1 número |
| Retroalimentación | Mensajes de error visibles, animación de shake al error |
| Show/hide | Botón para mostrar u ocultar contraseña |
| Navegación | Redirige al Home al ingresar credenciales válidas |
| Componentes | `TextInput`, `TouchableOpacity`, `KeyboardAvoidingView`, `ScrollView`, `Image`, `Animated` |

---

### 2. 👤 Pantalla de crear cuenta
**Archivo:** `src/screens/CreateAccountScreen.jsx`

Formulario de registro empresarial con validaciones avanzadas en tiempo real.

| Elemento | Detalle |
|---|---|
| Campos | Nombre completo, cargo en la empresa, correo corporativo, contraseña y confirmar contraseña |
| Validaciones | Campos obligatorios, solo letras en nombre, formato de email, mínimo 6 caracteres, al menos 1 mayúscula y 1 número en contraseña, coincidencia de contraseñas |
| Retroalimentación | Mensajes de error visibles, indicador de requisitos de contraseña en tiempo real, confirmación verde al coincidir contraseñas |
| Animaciones | Shake del formulario al error, animación de éxito al crear cuenta |
| Show/hide | Botón para mostrar u ocultar contraseña en ambos campos |
| Navegación | Redirige al Home al crear cuenta exitosamente |
| Componentes | `TextInput`, `TouchableOpacity`, `KeyboardAvoidingView`, `ScrollView`, `Image`, `Animated` |

---

### 3. 🏠 Pantalla principal (Dashboard)
**Archivo:** `src/screens/HomeScreen.js`

Panel principal de la aplicación. Muestra la lista de tareas del usuario con opciones de filtrado y un contador de progreso.

| Elemento | Detalle |
|---|---|
| Barra superior | Logo y nombre de la app a la izquierda, avatar y nombre del usuario a la derecha |
| Lista dinámica | Renderizada con `FlatList` y estado `useState` |
| Filtros | Todas / Pendientes / Completadas |
| Estadísticas | Cards con total, pendientes y completadas |
| Progreso | Barra animada con porcentaje de tareas completadas |
| Acciones | Cambiar estado de tarea directamente desde la lista |
| Navegación | Accede a Crear Tarea (FAB) y Detalle de Tarea (tap en card) |
| Componentes | `FlatList`, `TouchableOpacity`, `Image`, `Animated`, `TaskCard` |

---

### 4. ✏️ Pantalla de crear tarea
**Archivo:** `src/screens/CreateTaskScreen.js`

Formulario interactivo para registrar nuevas tareas con validaciones y selección de prioridad.

| Elemento | Detalle |
|---|---|
| Campos | Título (máx. 80 caracteres) y descripción (máx. 300 caracteres) |
| Validaciones | Campos obligatorios, mínimo 5 caracteres en título y 10 en descripción |
| Categoría | Selector visual: 💼 Comercial / 🎨 Diseño / 💻 Desarrollo / 📊 Gestión / 📣 Marketing / 🛠️ Soporte |
| Prioridad | Selector visual: 🔴 Alta / 🟡 Media / 🟢 Baja |
| Vista previa | Previsualización en tiempo real de la tarea mientras se escribe |
| Animaciones | Shake al error, animación de entrada del formulario, botón animado |
| Componentes | `TextInput`, `TouchableOpacity`, `ScrollView`, `KeyboardAvoidingView`, `Image`, `Animated` |

---

### 5. 🔍 Pantalla de detalle de tarea
**Archivo:** `src/screens/TaskDetailScreen.js`

Vista detallada de una tarea seleccionada. Permite cambiar su estado o eliminarla.

| Elemento | Detalle |
|---|---|
| Información | Título, descripción, estado, prioridad, categoría y fecha de creación |
| Header dinámico | Cambia de color índigo a verde según el estado de la tarea |
| Metadatos | Cards con prioridad, fecha de creación y categoría |
| Barra de estado | Indicador visual del flujo: Creada → En curso / Completada |
| Acciones | Marcar como completada / pendiente (`TouchableOpacity`) y eliminar tarea (`Button`) |
| Animaciones | Fade + slide de entrada, animación del botón de acción |
| Componentes | `ScrollView`, `TouchableOpacity`, `Button`, `Image`, `Animated`, `Alert` |

---

### Flujo de navegación

```
LoginScreen
    ├──▶ CreateAccountScreen ──▶ HomeScreen
    └──▶ HomeScreen
              ├──▶ CreateTaskScreen ──▶ (regresa al Home)
              └──▶ TaskDetailScreen ──▶ (regresa al Home)
```

---

## 🗺️ Roadmap del Proyecto

| Avance | Contenido | Estado |
|---|---|---|
| **Avance 1** | Estructura, interfaz, navegación, formularios con validaciones | ✅ Completado |
| **Avance 2** | (Todavía no hay tareas asignadas) | 🔜 Pendiente |
| **Avance 3** | (Todavía no hay tareas asignadas) | 🔜 Pendiente |

---

## 📸 Capturas de Pantalla

A continuación se muestran las principales vistas de la aplicación **KronoTask**, correspondientes a las pantallas desarrolladas en el Avance 1.

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

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para el curso de Desarrollo de Aplicaciones Móviles.

---