import React from 'react'
import { LoginScreen, RegistrationScreen, LoginScreen2, LoginSocialScreen, VerifyCode, } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName={"Login"}>
            {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
            <Stack.Screen name="Login" component={LoginScreen2} />
            <Stack.Screen name="VerifyCode" component={VerifyCode} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
        </Stack.Navigator>
    )
}

export default AuthStack;
