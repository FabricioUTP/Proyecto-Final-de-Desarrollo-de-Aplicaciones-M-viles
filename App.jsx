// App.jsx
import { registerRootComponent } from 'expo';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

registerRootComponent(App);