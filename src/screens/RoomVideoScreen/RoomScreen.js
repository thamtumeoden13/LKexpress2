import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const screens = {
    ROOM: 'JOIN_ROOM',
    CALL: 'CALL',
    JOIN: 'JOIN',
}
export default function RoomScreen() {
    const [state, setState] = useState({
        appVersion: ''
    })
    const [roomId, setRoomId] = useState('');
    const navigation = useNavigation()

    useEffect(() => {
        getAppVersion()
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
            <View >
                <Text style={{ width: '100%', height: 48, textAlign: 'center' }}>{state.appVersion}</Text>
            </View>
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