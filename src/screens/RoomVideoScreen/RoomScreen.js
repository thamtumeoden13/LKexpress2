import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const screens = {
    ROOM: 'JOIN_ROOM',
    CALL: 'CALL',
    JOIN: 'JOIN',
}
export default function RoomScreen() {

    const [roomId, setRoomId] = useState('');
    const navigation = useNavigation()

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