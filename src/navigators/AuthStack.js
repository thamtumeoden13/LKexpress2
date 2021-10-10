import React from 'react'
import { LoginScreen, RegistrationScreen } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack= createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName={"Login"}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
        </Stack.Navigator>
    )
}

export default AuthStack;
