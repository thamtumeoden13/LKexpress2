

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Avatar, Icon, withBadge, Badge } from 'react-native-elements';

export const NotificationBadge = (props) => {
    let valueBadge = 9
    if (props.notifications && props.notifications.length > 0)
        valueBadge = props.notifications.length
    const BadgedIcon = valueBadge > 0 ? withBadge(valueBadge)(Icon) : Icon

    return (
        <View style={styles.notification}>
            <TouchableOpacity onPress={() => props.navigation.navigate("Notification")}>
                {/* <View style={{justifyContent: "center", alignItems: "center"}}>
                    <BadgedIcon
                        status="success" type="font-awesome" name="bell-o"
                    />
                </View> */}
                <Icon
                    type="font-awesome" name="bell-o" color='#615f5f'
                />
                <Badge
                    status="primary"
                    // value="9+"
                    containerStyle={{ position: 'absolute', top: -5, right: -5, width: 10 }}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    notification: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    }
})