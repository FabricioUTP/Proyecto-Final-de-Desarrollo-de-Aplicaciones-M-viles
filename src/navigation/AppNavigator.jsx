// src/navigation/AppNavigator.jsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Image, Text, View } from "react-native";

import CreateAccountScreen from "../screens/CreateAccountScreen";
import CreateTaskScreen from "../screens/CreateTaskScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import TeamScreen from "../screens/TeamScreen";

import UserMenuButton from "../components/UserMenuButton";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { currentUser, authLoading } = useAuth();

  // ── Mientras AsyncStorage carga la sesión ────────────────
  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, gap: 12 }}>
        <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
          <Text style={{ fontSize: 32, fontWeight: "900", color: "#fff" }}>K</Text>
        </View>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ fontSize: 14, color: colors.textSecondary, fontWeight: "500" }}>
          Cargando KronoTask...
        </Text>
      </View>
    );
  }

  const displayName = currentUser?.fullName ?? "Admin";
  const displayRole = currentUser?.jobTitle ?? "Administrador";

  return (
  <NavigationContainer>
    <Stack.Navigator
    screenOptions={{
      headerStyle:         { backgroundColor: colors.surface },
      headerTintColor:     colors.primary,
      headerTitleStyle:    { fontWeight: "700", fontSize: 18 },
      headerShadowVisible: true,
      animation:           "slide_from_right",
    }}
    >
      {currentUser ? (
          // ── USUARIO LOGUEADO → pantallas de la app ───────
          <>
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title:       "Home",
                headerTitle: () => null,
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
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginRight: 4 }}>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textPrimary }} numberOfLines={1}>
                        {displayName}
                      </Text>
                      <Text style={{ fontSize: 11, color: colors.textSecondary }} numberOfLines={1}>
                        {displayRole}
                      </Text>
                    </View>
                    <UserMenuButton navigation={navigation} />
                  </View>
                ),
              })}
            />

            <Stack.Screen
              name="Team"
              component={TeamScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="CreateTask"
              component={CreateTaskScreen}
              options={{ title: "Crear tarea", presentation: "modal" }}
            />

            <Stack.Screen
              name="TaskDetail"
              component={TaskDetailScreen}
              options={{ title: "Detalle de tarea" }}
            />
          </>
        ) : (
          // ── SIN SESIÓN → pantallas de autenticación ──────
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="CreateAccount"
              component={CreateAccountScreen}
              options={{ title: "Crear cuenta" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;