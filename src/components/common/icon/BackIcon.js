import React, { Component } from 'react';
import { View } from 'react-native'
import { withNavigation } from '@react-navigation/compat'
import { StackActions } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/SimpleLineIcons';
import TouchableScale from 'react-native-touchable-scale';
import LottieView from 'lottie-react-native';
import { moderateScale, scale } from 'utils/scaleSize';

const BackIcon = ({ navigation }) => {
    const openDrawer = () => {
        console.log('BackIcon', navigation)
        navigation.dispatch(StackActions.popToTop());
    }

    return (
        // <View style={{
        //     width: moderateScale(44), height: moderateScale(44),
        //     justifyContent: 'center', alignItems: 'center',
        //     position:'absolute'
        // }}>
        <TouchableScale
            onPress={openDrawer}
            activeScale={0.8}
            style={{
                width: moderateScale(44), height: moderateScale(44),
                justifyContent: 'center', alignItems: 'center',
                left: moderateScale(-20)
            }}
        >
            <LottieView
                source={require('@assets/animations/backward.json')}
                colorFilters={[{
                    keypath: "button",
                    color: "#F00000"
                }, {
                    keypath: "Sending Loader",
                    color: "#F00000"
                }]}
                style={{ width: scale(25), height: scale(25), justifyContent: 'center', }}
                autoPlay
                loop
            />
        </TouchableScale>
        // </View>
    )
};

// export default (BackIcon);
export default withNavigation(BackIcon);