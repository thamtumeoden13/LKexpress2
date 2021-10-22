/**
 * @format
 */

import React from 'react'
import { AppRegistry, LogBox, Platform } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import InCallManager from 'react-native-incall-manager';

LogBox.ignoreAllLogs()
// import { notificationManager } from './src/utils/NotificationManager'

//background & quit state: messages listener   
messaging().setBackgroundMessageHandler(onBackgroundMessageReceived)

async function onBackgroundMessageReceived(message) {
    console.log('Message handled in the background!', message);
    if (Object.keys(message.data).length > 0 && message.data.type == 'video-join' && !!message.data.roomId) {
        InCallManager.startRingtone("_BUNDLE_");
    }
}

// notifee.onBackgroundEvent(async ({ type, detail }) => {
//     const { notification, pressAction } = detail;
//     console.log('type, detail ', type, detail)
//     switch (type) {
//         case EventType.DISMISSED:
//             console.log('User dismissed notification', detail.notification);
//             break;
//         case EventType.PRESS:
//             console.log('User pressed notification onBackgroundEvent', detail.notification);
//             break;
//         case EventType.ACTION_PRESS:
//             if (detail.pressAction.id == 'reject') {
//                 console.log('reject call with the id: ', detail.pressAction.id);
//                 await notifee.cancelNotification(detail.notification.id);
//             }
//             if (detail.pressAction.id == 'accept') {
//                 console.log('accept call with the id: ', detail.pressAction.id);
//             }
//             break;
//         case EventType.APP_BLOCKED:
//             console.log('User toggled app blocked', detail.blocked);
//             break;
//     }
// });

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }
    return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

