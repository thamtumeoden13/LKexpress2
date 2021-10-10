import React, { Component } from 'react';
import { withNavigation } from '@react-navigation/compat'
import { View } from 'react-native'
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import { moderateScale, scale } from 'utils/scaleSize';

const ActionSheetIcon = (props) => {
    const openBag = () => {
        console.log('openBag', props)
        props.onOpen()
        // navigation.openDrawer()
    }

    return (
        <View style={{
            width: moderateScale(44), height: moderateScale(44), marginRight: moderateScale(10),
            justifyContent: 'center', alignItems: 'center'
        }}>
            <AntDesignIcons
                name='addusergroup'
                size={scale(20)}
                color='black'
                onPress={openBag}
            />
        </View>
    )
};

// export default (BagIcon);
export default withNavigation(ActionSheetIcon);