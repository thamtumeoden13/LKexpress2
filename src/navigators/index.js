import React, { useContext, } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from 'react-native-splash-screen'

import AppStack from './AppStack'
import AuthStack from './AuthStack'

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
            // drawerContent={props => <DrawerContentComponents {...props} />}
            >
                {!appContext || appContext.userToken == null ?
                    <Stack.Screen name="Auth" component={AuthStack} />
                    :
                    <Stack.Screen name="App" component={AppStack} />
                }
            </Stack.Navigator>
        </NavigationContainer >
    )
}