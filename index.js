/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import App from './src/components/screens/App';

export default function Main() {
    return (
        <App/>
    );
}

AppRegistry.registerComponent(appName, () => App);
