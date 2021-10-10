

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { Avatar, Icon, withBadge, Badge } from 'react-native-elements';

export const SignOutIcon = (props) => {

    const onSignOut = () => {
        Alert.alert(
            'Đăng Xuất',
            'Bạn có muốn kết thúc phiên đăng nhập này không?',
            [
                {
                    text: 'KHÔNG',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'ĐỒNG Ý', onPress: () => props.navigation.navigate("ReSignIn")
                },
            ],
            { cancelable: false },
        );
    }

    return (
        <View style={styles.signOut}>
            <TouchableOpacity onPress={onSignOut}>
                <Icon
                    type="font-awesome" name="power-off" color='#615f5f'
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    signOut: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    }
})