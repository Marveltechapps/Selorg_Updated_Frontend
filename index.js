/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';
import App from './App';
import { name as appName } from './app.json';

// Enable native screens BEFORE any components are rendered
// This must be called at the very top level
enableScreens(true);

AppRegistry.registerComponent(appName, () => App);
