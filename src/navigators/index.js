import React, { useContext, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity, Alert } from 'react-native'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from 'react-native-splash-screen'
import messaging from '@react-native-firebase/messaging';
import InCallManager from 'react-native-incall-manager';

import AppStack from './AppStack'
import AuthStack from './AuthStack'

import { VideoCallScreen, VideoJoinScreen, VideoCallModal } from '../screens'

import { AuthContext } from '../utils'

const Stack = createStackNavigator();

export default () => {
    const { appContext } = useContext(AuthContext);
    const navigationRef = useNavigationContainerRef();

    useEffect(() => {
        notificationOpenedApp()

        const onMessageReceived = async (message) => {
            console.log('message-onMessageReceived', message)
            if (Object.keys(message.data).length > 0 && message.data.type == 'video-join' && !!message.data.roomID) {
                InCallManager.startRingtone("_BUNDLE_");
                navigationRef.navigate('VideoCallKeepModal', {
                    roomID: message.data.roomID,
                    displayName: message.data.displayName,
                })
            }
        }

        const unsubscribe = messaging().onMessage(onMessageReceived);
        return () => {
            unsubscribe;
        }
    }, [])

    const notificationOpenedApp = () => {
        messaging()
            .onNotificationOpenedApp(remoteMessage => {
                console.log(
                    'Notification caused app to open from background state:',
                    remoteMessage,
                );
                if (Object.keys(remoteMessage.data).length > 0 && remoteMessage.data.type == 'video-join' && !!remoteMessage.data.roomID) {
                    navigationRef.navigate('VideoCallKeepModal', {
                        roomID: remoteMessage.data.roomID,
                        displayName: remoteMessage.data.displayName,
                    })
                }
            });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage,
                    );
                    // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
                    if (Object.keys(remoteMessage.data).length > 0 && remoteMessage.data.type == 'video-join' && !!remoteMessage.data.roomID) {
                        navigationRef.navigate('VideoCallKeepModal', {
                            roomID: remoteMessage.data.roomID,
                            displayName: remoteMessage.data.displayName,
                        })
                    }
                }
                // setLoading(false);
            });
    }

    const onReady = () => {
        SplashScreen.hide();
    }

    return (
        <NavigationContainer onReady={onReady} ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
            >
                <Stack.Group>
                    {!appContext || appContext.userToken == null ?
                        <Stack.Screen name="Auth" component={AuthStack} />
                        :
                        <Stack.Screen name="App" component={AppStack} />
                    }
                </Stack.Group>
                <Stack.Group screenOptions={{ presentation: 'modal' }}>
                    <Stack.Screen name="VideoCallKeepModal" component={VideoCallModal} />
                    <Stack.Screen name="VideoCallModal" component={VideoCallScreen} />
                    <Stack.Screen name="VideoJoinModal" component={VideoJoinScreen} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer >
    )
}