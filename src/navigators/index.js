import React, { useContext, } from 'react'
import { View, Text, Button, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from 'react-native-splash-screen'

import AppStack from './AppStack'
import AuthStack from './AuthStack'

import { VideoCallScreen, VideoJoinScreen, VideoCallModal } from '../screens'

import { AuthContext } from '../utils'

const Stack = createStackNavigator();

export default () => {
    const { appContext } = useContext(AuthContext);
    const onReady = () => {
        SplashScreen.hide();
    }
    return (
        <NavigationContainer onReady={onReady}>
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