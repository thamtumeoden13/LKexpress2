import React, { Component } from 'react';
import { withNavigation } from '@react-navigation/compat'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import TouchableScale from 'react-native-touchable-scale';
import LottieView from 'lottie-react-native';

import { moderateScale, scale } from 'utils/scaleSize';

const CallIcon = (props) => {
    const openBag = () => {
        props.onOpen()
    }

    return (
        <View style={{
            width: moderateScale(44), height: moderateScale(44),
            //  marginRight: moderateScale(10),
            justifyContent: 'center', alignItems: 'center'
        }}>
            <TouchableScale
                onPress={openBag}
                activeScale={0.8}
            >
                <LottieView
                    source={require('@assets/animations/call.json')}
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
        </View>
    )
};

// export default (BagIcon);
export default withNavigation(CallIcon);