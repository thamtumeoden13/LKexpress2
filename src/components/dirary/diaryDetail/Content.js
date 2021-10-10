import React, { useState, useEffect, useRef, } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableHighlight, FlatList, TouchableOpacity } from 'react-native'

import FlatListAnimationCarousel from 'components/common/listCommon/FlatListAnimationCarousel'

import { calcHeight, scale, verticalScale, calcWidth, moderateScale } from 'utils/scaleSize';

const Content = ({ title, content, images }) => {

    return (
        <View>
            <View style={{ padding: scale(10) }}>
                {!!title && <Text style={{ fontSize: scale(16), fontWeight: 'bold', }}>{title}</Text>}
                {!!content && <Text style={{ fontSize: scale(12), fontWeight: '300', }}>{content}</Text>}
            </View>
            <View style={{ height: calcHeight(50) }}>
                <FlatListAnimationCarousel
                    result={images}
                />
            </View>
        </View>
    )
}

export default Content

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    btn: {
        margin: 2,
        padding: 2,
        backgroundColor: "aqua",
    },
    btnDisable: {
        margin: 2,
        padding: 2,
        backgroundColor: "gray",
    },
    btnText: {
        margin: 2,
        padding: 2,
    }
});