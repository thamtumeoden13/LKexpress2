import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, View, TextInput, Clipboard, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const screens = {
    ROOM: 'JOIN_ROOM',
    CALL: 'CALL',
    JOIN: 'JOIN',
}
export default function RoomScreen() {
    const [state, setState] = useState({
        appVersion: '',
        fcmToken: ''
    })
    const [roomId, setRoomId] = useState('');
    const navigation = useNavigation()

    useEffect(() => {
        getAppVersion()
        setTimeout(async () => {
            const fcmToken = await messaging().getToken();
            setState(prev => { return { ...prev, fcmToken } })
            console.log('state.fcmToken', fcmToken)
        });
    }, [])

    const onCallOrJoin = (screen) => {
        if (roomId.length > 0) {
            switch (screen) {
                case screens.CALL:
                    navigation.navigate('VideoCall', { roomId: roomId })
                    break;

                case screens.JOIN:
                    navigation.navigate('VideoJoin', { roomId: roomId })
                    break;
            }
            return;
        }
    }

    const getAppVersion = async () => {
        let version = await AsyncStorage.getItem('appVersion');
        console.log('version', version)
        setState(prev => { return { ...prev, appVersion: version } })
    }

    const onPress = async () => {
        // navigation.navigate('VideoCallKeepModal', { roomId: roomId })
        Clipboard.setString(state.fcmToken)
    }

    return (
        <>
            <Text style={styles.heading} >Chọn Phòng</Text>
            <TextInput style={styles.input} value={roomId} onChangeText={setRoomId} />
            <View style={styles.buttonContainer} >
                <Button title="Join Screen" onPress={() => onCallOrJoin(screens.JOIN)} />
            </View>
            <View style={styles.buttonContainer} >
                <Button title="Call Screen" onPress={() => onCallOrJoin(screens.CALL)} />
            </View>
            <TouchableOpacity onPress={onPress} >
                <Text style={{ width: '100%', height: 48, textAlign: 'center' }}>{state.appVersion}</Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    heading: {
        marginVertical: 10,
        alignSelf: 'center',
        fontSize: 30,
    },
    input: {
        margin: 20,
        height: 40,
        backgroundColor: '#aaa'
    },
    buttonContainer: {
        margin: 5
    }
});