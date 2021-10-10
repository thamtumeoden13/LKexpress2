import React, { Component } from 'react';
import { withNavigation } from '@react-navigation/compat'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import TouchableScale from 'react-native-touchable-scale';
import LottieView from 'lottie-react-native';

import { moderateScale, scale } from 'utils/scaleSize';

const ShoppingCartIcon = (props) => {
    const openShoppingCart = () => {
        props.onOpen()
    }

    return (
        <View style={{
            width: moderateScale(44), height: moderateScale(44),
            //  marginRight: moderateScale(10),
            justifyContent: 'center', alignItems: 'center'
        }}>
            <TouchableScale
                onPress={openShoppingCart}
                activeScale={0.8}
            >
                <LottieView
                    source={require('@assets/animations/shopping-cart.json')}
                    colorFilters={[{
                        keypath: "button",
                        color: "#F00000"
                    }, {
                        keypath: "Sending Loader",
                        color: "#F00000"
                    }]}
                    style={{ width: scale(30), height: scale(30), justifyContent: 'center', }}
                    autoPlay
                    loop
                />
            </TouchableScale>
        </View>
    )
};

export default withNavigation(ShoppingCartIcon);