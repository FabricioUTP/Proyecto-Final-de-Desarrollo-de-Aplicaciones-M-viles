import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Text, View } from "react-native";

import CreateAccountScreen from "../screens/CreateAccountScreen";
import CreateTaskScreen from "../screens/CreateTaskScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";

import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
        headerShadowVisible: true,
        animation: "slide_from_right",
      }}
    >

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
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
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textPrimary }}>
                  Admin
                </Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                  Administrador
                </Text>
              </View>
              <Image
                source={require("../../assets/images/avatar.png")}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.primaryLight,
                }}
                resizeMode="contain"
              />
            </View>
          )
        }}
      />

      <Stack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{
          title: "Crear tarea",
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{
          title: "Crear cuenta",
        }}
      />

      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          title: "Detalle de tarea",
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
