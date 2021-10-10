import React, { useState, useEffect, useRef, } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableHighlight, FlatList, TouchableOpacity } from 'react-native'
import IonsIcon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import TouchableScale from 'react-native-touchable-scale';

import FlatListAnimationCarousel from 'components/common/listCommon/FlatListAnimationCarousel'

import { calcHeight, scale, verticalScale, calcWidth, moderateScale } from 'utils/scaleSize';
import { formatCount, formatDistanceToNowVi } from 'utils/function'

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const DATA = [
    'https://images.pexels.com/photos/2578370/pexels-photo-2578370.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/3973557/pexels-photo-3973557.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/3493731/pexels-photo-3493731.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/5478144/pexels-photo-5478144.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/2904176/pexels-photo-2904176.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/2265247/pexels-photo-2265247.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/6272196/pexels-photo-6272196.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/605223/pexels-photo-605223.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
]

const Content = ({ title, content, images, onPressItem }) => {

    const [state, setState] = useState({
        like: false,
        dislike: false,
        isShowMore: false,
        title: title,
        content: content,
        contentSubStr: '',
        images: images
    })

    useEffect(() => {
        let contentSubStr = state.content
        let isShowMore = false
        if (!!state.content && state.content.length > 100) {
            contentSubStr = state.content.substring(0, 100)
            isShowMore = true
        }
        setState(prev => { return { ...prev, contentSubStr, isShowMore } })
    }, [state.content])

    const onHandlerContent = () => {
        setState(prev => { return { ...prev, contentSubStr: prev.content, isShowMore: false } })
    }

    return (
        <View>
            <TouchableOpacity
                style={{ padding: scale(10) }}
                onPress={onPressItem}
            >
                {!!state.title && <Text style={{ fontSize: scale(16), fontWeight: 'bold', }}>{state.title}</Text>}
                {!!state.contentSubStr &&
                    <>
                        <Text style={{ fontSize: scale(12), fontWeight: '300', }}>{state.contentSubStr}</Text>
                        {!!state.isShowMore &&
                            <TouchableOpacity onPress={onHandlerContent}>
                                <Text style={{ fontSize: scale(12), fontWeight: '300', color: 'blue' }}>{`Xem thêm...`}</Text>
                            </TouchableOpacity>
                        }
                    </>
                }
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
                {!!images && images.length > 0 &&
                    <View style={{ height: calcHeight(30), width: calcWidth(90), alignItems: 'center' }}>
                        <FlatListAnimationCarousel
                            result={images}
                            containWith={calcWidth(90)}
                        />
                    </View>
                }
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