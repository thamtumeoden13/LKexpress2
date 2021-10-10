import React, { Component } from 'react';
import { withNavigation } from '@react-navigation/compat'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { moderateScale, scale } from 'utils/scaleSize';

const BagIcon = ({ navigation }) => {
    const openBag = () => {
        console.log('openBag')
        // navigation.openDrawer()
    }

    return (
        <View style={{
            width: moderateScale(44), height: moderateScale(44), 
            // marginRight: moderateScale(10),
            justifyContent: 'center', alignItems: 'center'
        }}>
            <Icon
                name='bell'
                size={scale(16)}
                color='black'
                onPress={openBag}
            />
        </View>
    )
};

// export default (BagIcon);
export default withNavigation(BagIcon);