import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, InteractionManager, Animated, TouchableOpacity } from 'react-native'
// import { withNavigation } from '@react-navigation/compat'
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, scale, verticalScale } from 'utils/scaleSize';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};
const DrawerContentComponents = ({ navigation}) => {
    const [state, setState] = useState({ activeItemKey: 'Home' })

    const gradient = () => {
        return (
            <LinearGradient
                colors={[colors.background1, colors.background2]}
                startPoint={{ x: 1, y: 0 }}
                endPoint={{ x: 0, y: 1 }}
                style={styles.gradient}
            />
        );
    }

    const navigateToScreen = (route) => {
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate(route)
            navigation.closeDrawer()
        })
        setState(prev => { return { ...prev, activeItemKey: route } })
    }

    return (
        <Animated.View style={styles.container}>
            <View style={styles.headerContainer}>
                {gradient()}
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                }}
                >
                    <Text style={styles.headerText}>LKExpress</Text>
                </View>
            </View>
            <View style={styles.screenContainer}>
                <TouchableOpacity onPress={() => navigateToScreen('HomeDrawer')}>
                    <View style={[styles.screenStyle, (state.activeItemKey == 'Home') ? styles.activeBackgroundColor : null]}>
                        <Icon name="home" type="antdesign" size={scale(22)} color={(state.activeItemKey == 'Home') ? '#00adff' : '#000'} />
                        <Text style={[styles.screenTextStyle, (state.activeItemKey == 'Home') ? styles.selectedTextStyle : null]}>{`Trang chủ`}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToScreen('RoomChat')}>
                    <View style={[styles.screenStyle, (state.activeItemKey == 'RoomChat') ? styles.activeBackgroundColor : null]}>
                        <Icon name="sort" type="material" size={scale(22)} color={(state.activeItemKey == 'RoomChat') ? '#00adff' : '#000'} />
                        <Text style={[styles.screenTextStyle, (state.activeItemKey == 'RoomChat') ? styles.selectedTextStyle : null]}>{`Tin nhắn`}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToScreen('Category')}>
                    <View style={[styles.screenStyle, (state.activeItemKey == 'Category') ? styles.activeBackgroundColor : null]}>
                        <Icon name="favorite-border" type="material" size={scale(22)} color={(state.activeItemKey == 'Category') ? '#00adff' : '#000'} />
                        <Text style={[styles.screenTextStyle, (state.activeItemKey == 'Category') ? styles.selectedTextStyle : null]}>{`Danh mục`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}
export default (DrawerContentComponents)
// export default withNavigation(DrawerContentComponents)

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    headerContainer: {
        height: verticalScale(150),
        width: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    headerText: {
        color: '#f8f8f8',
        fontWeight: 'normal',
        fontSize: scale(30),
        textAlign: 'center'
    },
    screenContainer: {
        paddingTop: verticalScale(20),
        width: '100%',
    },
    screenStyle: {
        height: verticalScale(64),
        marginTop: verticalScale(2),
        paddingLeft: moderateScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    screenTextStyle: {
        fontSize: scale(20),
        marginLeft: moderateScale(20),
        textAlign: 'center'
    },
    selectedTextStyle: {
        fontWeight: 'bold',
        color: '#00adff'
    },
    activeBackgroundColor: {
        backgroundColor: '#0002'
    }
});