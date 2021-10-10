import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import styles from './styles';

const AuthLoadingScreen = (props) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const usersRef = firestore().collection('users');
        auth().onAuthStateChanged(user => {
            if (user) {
                console.log('user', user)
                usersRef
                    .doc(user.uid)
                    .get()
                    .then((document) => {
                        const userData = document.data()
                        console.log('userData', userData)
                        setLoading(false)
                        // setUser(userData)
                        props.navigation.navigate('Home', { user: userData })
                    })
                    .catch((error) => {
                        setLoading(false)
                        props.navigation.navigate('Login')
                    });
            } else {
                setLoading(false)
                props.navigation.navigate('Login')
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.buttonText}>{`Đang lấy dữ liệu`}</Text>
            </View>
        </View>
    )
}

export default AuthLoadingScreen