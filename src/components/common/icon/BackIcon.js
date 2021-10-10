import React, { Component } from 'react';
import { withNavigation } from '@react-navigation/compat'
import { StackActions } from '@react-navigation/native';

import { View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { moderateScale, scale } from 'utils/scaleSize';

const BackIcon = ({ navigation }) => {
    const openDrawer = () => {
        console.log('BackIcon', navigation)
        navigation.dispatch(StackActions.popToTop());
    }

    return (
        <View style={{
            width: moderateScale(44), height: moderateScale(44), marginLeft: moderateScale(10),
            justifyContent: 'center', alignItems: 'center'
        }}>
            <Icon
                name='arrow-left'
                size={scale(16)}
                color='black'
                onPress={openDrawer} />
        </View>
    )
};

// export default (BackIcon);
export default withNavigation(BackIcon);