// App.jsx
import { registerRootComponent } from "expo";
import { AuthProvider } from "./src/context/AuthContext";
import { TaskProvider } from "./src/context/TaskContext";
import AppNavigator   from "./src/navigation/AppNavigator";

const App = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppNavigator />
      </TaskProvider>
    </AuthProvider>
  );
};

registerRootComponent(App);