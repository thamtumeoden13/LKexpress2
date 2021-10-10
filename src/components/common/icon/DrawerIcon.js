import React, { Component } from 'react';
import { withNavigation } from '@react-navigation/compat'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { moderateScale, scale } from 'utils/scaleSize';

const DrawerIcon = ({ navigation }) => {
    const openDrawer = () => {
        console.log('openDrawer', navigation)
        navigation.openDrawer()
    }

    return (
        <View style={{
            width: moderateScale(44), height: moderateScale(44),
            //  marginLeft: moderateScale(10),
            justifyContent: 'center', alignItems: 'center'
        }}>
            <Icon
                name='menu'
                size={scale(16)}
                color='black'
                onPress={openDrawer} />
        </View>
    )
};

// export default (DrawerIcon);
export default withNavigation(DrawerIcon);