import { registerRootComponent } from 'expo';
import AppNavigator from './src/navigation/AppNavigator';
import { TaskProvider } from './src/context/TaskContext';

const App = () => {
  return (
    <TaskProvider>
      <AppNavigator />
    </TaskProvider>
  );
};

registerRootComponent(App);
