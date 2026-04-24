import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
          title: "KronoTask",
          headerLeft: () => null, 
          gestureEnabled: false, 
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
