/**
 * @format
 */

import React from 'react'
import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

LogBox.ignoreAllLogs()
// import { notificationManager } from './src/utils/NotificationManager'

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    const { notification, data, messageId } = remoteMessage
    const { title, body } = notification
    const { PushMessageTypeID } = data
});


function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }
    return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

