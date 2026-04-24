# KronoTask

**KronoTask** es una aplicación móvil empresarial para gestionar tareas diarias con interfaz responsive, validaciones de formulario y navegación entre pantallas.

## ?? Evaluación de la aplicación

Esta aplicación cumple los criterios de la rúbrica con:

- Estructura de proyecto ordenada y clara en `src/`
- Uso de componentes básicos `View`, `Text`, `TextInput`, `TouchableOpacity` y estilos nativos
- Componente reutilizable `TaskCard` con props para renderizar tareas
- Navegación entre `Login`, `Home`, `CreateTask` y `TaskDetail`
- Formulario con validación y retroalimentación visible al usuario
- Documentación con ejecución y características

## ?? Estructura del proyecto

```
Proyecto-Final-de-Desarrollo-de-Aplicaciones-M-viles/
+-- App.jsx
+-- app.json
+-- package.json
+-- README.md
+-- src/
    +-- components/
    �   +-- TaskCard.jsx
    +-- context/
    �   +-- TaskContext.jsx
    +-- navigation/
    �   +-- AppNavigator.jsx
    +-- screens/
    �   +-- CreateTaskScreen.jsx
    �   +-- HomeScreen.jsx
    �   +-- LoginScreen.jsx
    �   +-- TaskDetailScreen.jsx
    +-- theme/
        +-- colors.js
```

## ?? Tecnologías

- React Native
- Expo
- React Navigation
- JavaScript (ES6+)
- Expo Vector Icons

## ?? Instalación y ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/FabricioUTP/Proyecto-Final-de-Desarrollo-de-Aplicaciones-M-viles.git
cd Proyecto-Final-de-Desarrollo-de-Aplicaciones-M-viles
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta la app:

```bash
npm start
```

4. En la terminal de Expo selecciona:

- `a` para abrir en emulador Android
- `i` para iOS (macOS)
- `w` para web
- O escanea el QR con Expo Go

## ?? Flujo de la aplicación

### 1. Login

- Pantalla `src/screens/LoginScreen.jsx`
- Validaciones: correo obligatorio, formato email, mínimo 6 caracteres de contraseña
- Credenciales de acceso de prueba:
  - Email: `admin@kronotask.com`
  - Contraseña: `admin123`
- Navega a `Home` al iniciar sesión

### 2. Home

- Pantalla `src/screens/HomeScreen.jsx`
- Muestra lista de tareas con `FlatList`
- Filtros: Todas, Pendientes, Completadas
- Progreso y estadísticas dinámicas
- Botón flotante para crear nueva tarea
- Cada tarea abre `TaskDetail`

### 3. Crear tarea

- Pantalla `src/screens/CreateTaskScreen.jsx`
- Formulario con campos:
  - Título
  - Descripción
  - Categoría
  - Prioridad
- Validaciones visibles por campo
- Guarda tarea en estado global con contexto

### 4. Detalle de tarea

- Pantalla `src/screens/TaskDetailScreen.jsx`
- Muestra información de la tarea seleccionada
- Permite cambiar el estado entre pendiente/completada
- Permite eliminar la tarea

## ? Funcionalidades implementadas

- Contexto global de tareas con `TaskContext.jsx`
- Componente reutilizable `TaskCard.jsx`
- Navegación completa entre pantallas principales
- Validaciones de formulario en `Login` y `CreateTask`
- Estado de tareas editables y persistencia en memoria durante la sesión

## ?? Buenas prácticas incluidas

- Componentes desacoplados y reutilizables
- Uso de `useState`, `useEffect`, `useMemo` y contexto
- Estilos consistentes en `src/theme/colors.js`
- Interfaz responsive con Flexbox y `ScrollView`

## ?? Cómo validar el proyecto

- Ejecuta `npm install`
- Ejecuta `npm start`
- Inicia en emulador Android con `npm run android`

> Nota: Si los paquetes no están instalados localmente, instala dependencias antes de ejecutar.
