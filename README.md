# KronoTask

**KronoTask** es una aplicaci�n m�vil empresarial para gestionar tareas diarias con interfaz responsive, validaciones de formulario y navegaci�n entre pantallas.

## ?? Evaluaci�n de la aplicaci�n

Esta aplicaci�n cumple los criterios de la r�brica con:

- Estructura de proyecto ordenada y clara en `src/`
- Uso de componentes b�sicos `View`, `Text`, `TextInput`, `TouchableOpacity` y estilos nativos
- Componente reutilizable `TaskCard` con props para renderizar tareas
- Navegaci�n entre `Login`, `Home`, `CreateTask` y `TaskDetail`
- Formulario con validaci�n y retroalimentaci�n visible al usuario
- Documentaci�n con ejecuci�n y caracter�sticas

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

## ?? Tecnolog�as

- React Native
- Expo
- React Navigation
- JavaScript (ES6+)
- Expo Vector Icons

## ?? Instalaci�n y ejecuci�n

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

## ?? Flujo de la aplicaci�n

### 1. Login

- Pantalla `src/screens/LoginScreen.jsx`
- Validaciones: correo obligatorio, formato email, m�nimo 6 caracteres de contrase�a
- Credenciales de acceso de prueba:
  - Email: `admin@kronotask.com`
  - Contrase�a: `admin123`
- Navega a `Home` al iniciar sesi�n

### 2. Home

- Pantalla `src/screens/HomeScreen.jsx`
- Muestra lista de tareas con `FlatList`
- Filtros: Todas, Pendientes, Completadas
- Progreso y estad�sticas din�micas
- Bot�n flotante para crear nueva tarea
- Cada tarea abre `TaskDetail`

### 3. Crear tarea

- Pantalla `src/screens/CreateTaskScreen.jsx`
- Formulario con campos:
  - T�tulo
  - Descripci�n
  - Categor�a
  - Prioridad
- Validaciones visibles por campo
- Guarda tarea en estado global con contexto

### 4. Detalle de tarea

- Pantalla `src/screens/TaskDetailScreen.jsx`
- Muestra informaci�n de la tarea seleccionada
- Permite cambiar el estado entre pendiente/completada
- Permite eliminar la tarea

## ? Funcionalidades implementadas

- Contexto global de tareas con `TaskContext.jsx`
- Componente reutilizable `TaskCard.jsx`
- Navegaci�n completa entre pantallas principales
- Validaciones de formulario en `Login` y `CreateTask`
- Estado de tareas editables y persistencia en memoria durante la sesi�n

## ?? Buenas pr�cticas incluidas

- Componentes desacoplados y reutilizables
- Uso de `useState`, `useEffect`, `useMemo` y contexto
- Estilos consistentes en `src/theme/colors.js`
- Interfaz responsive con Flexbox y `ScrollView`

## ?? C�mo validar el proyecto

- Ejecuta `npm install`
- Ejecuta `npm start`
- Inicia en emulador Android con `npm run android`

> Nota: Si los paquetes no est�n instalados localmente, instala dependencias antes de ejecutar.
