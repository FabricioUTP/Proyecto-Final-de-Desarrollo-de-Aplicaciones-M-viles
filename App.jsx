// App.jsx
import { registerRootComponent } from "expo";
import { AuthProvider } from "./src/context/AuthContext";
import { TaskProvider } from "./src/context/TaskContext";
import AppNavigator   from "./src/navigation/AppNavigator";
import { configureNotificationHandler } from "./src/utils/notifications";
import ErrorBoundary from "./src/components/ErrorBoundary";

configureNotificationHandler();

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <AppNavigator />
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

registerRootComponent(App);