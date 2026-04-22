# 📋 KronoTask
### Aplicación Móvil de Gestión de Tareas Empresariales

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" />
</p>

---

## 📌 Descripción del Proyecto

**KronoTask** es una aplicación móvil multiplataforma orientada a la gestión de tareas dentro de un entorno empresarial. Permite a los usuarios organizar, visualizar y dar seguimiento a sus actividades diarias de manera eficiente, facilitando la productividad y el control operativo.

Desarrollada con **React Native** y **Expo**, la aplicación implementa buenas prácticas en estructuración de código, diseño responsivo y organización de componentes, con un flujo de navegación claro e intuitivo.

> 🎓 Proyecto desarrollado para el curso universitario de **Desarrollo de Aplicaciones Móviles** — Avance de Proyecto Final 01 (Semana 5)

---

## 👥 Equipo de Desarrollo

| # | Nombre Completo | Rol |
|---|---|---|
| 1 | Fabricio Manuel Munives Santamaría | Desarrollador Mobile / Frontend |
| 2 | Elmer Diego Falla Samaniego | Desarrollador Mobile / Frontend |

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
│   └── logo.png
│
├── src/
│   ├── components/                # Componentes reutilizables
│   │   └── TaskCard.jsx           # Tarjeta de tarea con props
│   │
│   ├── screens/                   # Pantallas de la aplicación
│   │   ├── LoginScreen.jsx        # Pantalla de inicio de sesión
│   │   ├── HomeScreen.jsx         # Dashboard principal con lista de tareas
│   │   ├── CreateTaskScreen.jsx   # Formulario para crear nueva tarea
│   │   └── TaskDetailScreen.jsx   # Detalle y gestión de una tarea
│   │
│   ├── navigation/                # Configuración de navegación
│   │   └── AppNavigator.jsx       # Stack Navigator principal
│   │
│   └── theme/                     # Estilos y tokens globales
│       └── colors.js              # Paleta de colores centralizada
│
├── App.jsx                         # Punto de entrada de la aplicación
├── app.json                       # Configuración de Expo
├── package.json                   # Dependencias del proyecto
└── README.md                      # Documentación del proyecto
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
npx create-expo-app KronoTask
cd KronoTask
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
# Íconos vectoriales (incluido en Expo)
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

## 🔥 Backend y Base de Datos (Implementación futura — Avance 2 y 3)

KronoTask utilizará **Firebase** como plataforma de backend y **Cloud Firestore** como base de datos NoSQL.

### ¿Por qué Firebase?

- Integración nativa con React Native / Expo
- Autenticación de usuarios lista para usar (email, Google)
- Base de datos en tiempo real y sin necesidad de servidor propio
- Escalable y gratuito en el tier inicial

### Instalación de Firebase (referencia para avances futuros)

```bash
npx expo install firebase
```

### Configuración inicial (referencia)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Inicializar proyecto
firebase init
```

| Servicio Firebase | Uso en KronoTask |
|---|---|
| **Authentication** | Login con correo/contraseña o Google |
| **Cloud Firestore** | Almacenamiento de tareas por usuario |
| **Firebase Hosting** | Despliegue del panel web (futuro) |
| **Cloud Functions** | Notificaciones y lógica de servidor |

---

## 📱 Vistas — Avance 1 (Semana 5)

Este primer avance cuenta con **4 pantallas** funcionales conectadas mediante navegación con React Navigation.

---

### 1. 🔐 Login Screen
**Archivo:** `src/screens/LoginScreen.js`

Pantalla de inicio de sesión empresarial. Implementa un formulario con validaciones en tiempo real.

| Elemento | Detalle |
|---|---|
| Campos | Correo corporativo y contraseña |
| Validaciones | Campo vacío, formato de email, mínimo 6 caracteres en contraseña |
| Retroalimentación | Mensajes de error visibles bajo cada campo |
| Navegación | Redirige al Home al ingresar credenciales válidas |
| Componentes | `TextInput`, `TouchableOpacity`, `KeyboardAvoidingView`, `ScrollView` |

---

### 2. 🏠 Home Screen (Dashboard)
**Archivo:** `src/screens/HomeScreen.js`

Panel principal de la aplicación. Muestra la lista de tareas del usuario con opciones de filtrado y un contador de progreso.

| Elemento | Detalle |
|---|---|
| Lista dinámica | Renderizada con `FlatList` y estado `useState` |
| Filtros | Todas / Pendientes / Completadas |
| Contador | Badge que muestra tareas completadas vs. total |
| Acciones | Cambiar estado de tarea directamente desde la lista |
| Navegación | Accede a Crear Tarea (FAB) y Detalle de Tarea (tap en card) |
| Componentes | `FlatList`, `TouchableOpacity`, `TaskCard` |

---

### 3. ✏️ Create Task Screen
**Archivo:** `src/screens/CreateTaskScreen.js`

Formulario interactivo para registrar nuevas tareas con validaciones y selección de prioridad.

| Elemento | Detalle |
|---|---|
| Campos | Título y descripción |
| Validaciones | Campos obligatorios, mínimo 5 caracteres en el título |
| Prioridad | Selector visual: 🔴 Alta / 🟡 Media / 🟢 Baja |
| Acción | Agrega la tarea al listado y retorna al Home |
| Componentes | `TextInput`, `TouchableOpacity`, `ScrollView`, `KeyboardAvoidingView` |

---

### 4. 🔍 Task Detail Screen
**Archivo:** `src/screens/TaskDetailScreen.js`

Vista detallada de una tarea seleccionada. Permite cambiar su estado o eliminarla.

| Elemento | Detalle |
|---|---|
| Información | Título, descripción, estado actual y prioridad |
| Acciones | Marcar como completada / pendiente y eliminar tarea |
| Estado | Actualización sincronizada con la lista del Home |
| Componentes | `ScrollView`, `TouchableOpacity`, badges de estado dinámicos |

---

### Flujo de navegación

```
LoginScreen
    └──▶ HomeScreen
              ├──▶ CreateTaskScreen ──▶ (regresa al Home)
              └──▶ TaskDetailScreen ──▶ (regresa al Home)
```

---

## 🗺️ Roadmap del Proyecto

| Avance | Contenido | Estado |
|---|---|---|
| **Avance 1** | Estructura, interfaz, navegación, formularios con validaciones | ✅ En curso |
| **Avance 2** | (Todavía no hay tareas asignadas) | 🔜 Pendiente |
| **Avance 3** | (Todavía no hay tareas asignadas) | 🔜 Pendiente |

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para el curso de Desarrollo de Aplicaciones Móviles.

---

<p align="center">Desarrollado por <strong>Fabricio Munives</strong> y <strong>Elmer Falla</strong></p>
