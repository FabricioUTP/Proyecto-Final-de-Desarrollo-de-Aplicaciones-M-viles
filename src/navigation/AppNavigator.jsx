// src/navigation/AppNavigator.jsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Text, View } from "react-native";

import CreateAccountScreen from "../screens/CreateAccountScreen";
import CreateTaskScreen    from "../screens/CreateTaskScreen";
import HomeScreen          from "../screens/HomeScreen";
import LoginScreen         from "../screens/LoginScreen";
import TaskDetailScreen    from "../screens/TaskDetailScreen";
import TeamScreen          from "../screens/TeamScreen";

import UserMenuButton from "../components/UserMenuButton";
import { useAuth }    from "../context/AuthContext";
import { colors }     from "../theme/colors";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { currentUser } = useAuth();

  // ── Datos que se muestran en el header según el usuario ──
  const displayName  = currentUser?.fullName  ?? "Admin";
  const displayRole  = currentUser?.jobTitle  ?? "Administrador";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle:        { backgroundColor: colors.surface },
          headerTintColor:    colors.primary,
          headerTitleStyle:   { fontWeight: "700", fontSize: 18 },
          headerShadowVisible: true,
          animation:          "slide_from_right",
        }}
      >
        {/* Login — sin header */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Home — header personalizado con usuario y avatar */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title:       "Home",
            headerTitle: () => null,

            // Logo + nombre de la app a la izquierda
            headerLeft: () => (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 4 }}>
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={{ width: 32, height: 32, borderRadius: 8 }}
                  resizeMode="contain"
                />
                <Text style={{ fontSize: 18, fontWeight: "800", color: colors.primary, letterSpacing: 0.5 }}>
                  KronoTask
                </Text>
              </View>
            ),

            // Nombre + rol + avatar a la derecha
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginRight: 4 }}>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{ fontSize: 13, fontWeight: "700", color: colors.textPrimary }}
                    numberOfLines={1}
                  >
                    {displayName}
                  </Text>
                  <Text
                    style={{ fontSize: 11, color: colors.textSecondary }}
                    numberOfLines={1}
                  >
                    {displayRole}
                  </Text>
                </View>
                {/* Avatar con menú desplegable */}
                <UserMenuButton navigation={navigation} />
              </View>
            ),
          })}
        />

        {/* Directorio del equipo */}
        <Stack.Screen
          name="Team"
          component={TeamScreen}
          options={{ headerShown: false }}
        />

        {/* Crear tarea */}
        <Stack.Screen
          name="CreateTask"
          component={CreateTaskScreen}
          options={{ title: "Crear tarea", presentation: "modal" }}
        />

        {/* Crear cuenta */}
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{ title: "Crear cuenta" }}
        />

        {/* Detalle de tarea */}
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ title: "Detalle de tarea" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;