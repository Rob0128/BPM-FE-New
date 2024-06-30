/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import 'react-native-gesture-handler';
import {name as appName} from './app.json';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
AppRegistry.registerComponent(appName, () => App);
