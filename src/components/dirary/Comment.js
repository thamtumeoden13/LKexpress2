import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import IonsIcon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import TouchableScale from 'react-native-touchable-scale';

import { moderateScale, scale, verticalScale } from 'utils/scaleSize';
import { formatCount, formatDistanceToNowVi } from 'utils/function'

const Commment = ({ totalComment = 0, totalLike = 0, totalView = 0, onPressItem }) => {

    const [state, setState] = useState({
        isReady: false,
        status: false,
        quality: 0,
        error: '',
        like: false,
        textComment: '',
    })

    const onHandlerLike = (type) => {
        setState(prev => {
            return {
                ...prev,
                [type]: !prev[type],
            }
        })
    }

    return (
        <View >
            <View style={{
                flexDirection: 'row',
                width: '100%',
                padding: scale(5),
                justifyContent: 'space-around',
                alignItems: 'flex-end',
                borderBottomWidth: scale(1),
                height: verticalScale(64),
            }}>
                <TouchableScale
                    style={{ height: '100%', justifyContent: 'center' }}
                    onPress={() => onHandlerLike('like')}
                >
                    <AntDesignIcon
                        name='like2' size={20}
                        color={!!state.like ? '#185ADB' : '#171717'}
                        style={{ width: moderateScale(48) }}
                    />
                    <Text style={{ fontSize: 12, color: !!state.like ? '#185ADB' : '#171717' }}>{`${formatCount(totalLike)} lượt thích`}</Text>
                </TouchableScale>
                <TouchableScale style={{ height: '100%', justifyContent: 'center' }}>
                    <AntDesignIcon
                        name='eye' size={20}
                        color={'#171717'}
                        style={{ width: moderateScale(48) }}
                    />
                    <Text style={{ fontSize: 12, color: !!state.dislike ? '#185ADB' : '#171717' }}>{`${formatCount(totalView)} lượt xem`}</Text>
                </TouchableScale>
                <TouchableScale
                    style={{ height: '100%', justifyContent: 'center' }}
                    onPress={onPressItem}
                >
                    <View >
                        <IonsIcon name='chatbox-ellipses-outline' size={20} style={{ marginRight: scale(5) }} />
                        <Text style={{ color: '#6a6a6a', fontSize: scale(14) }}>{`${formatCount(totalComment)} bình luận`}</Text>
                    </View>
                </TouchableScale>
            </View>
        </View>
    )
}

export default Commment

const styles = StyleSheet.create({
    footer: {
        height: 100,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    placeholder: {
        height: 15,
        backgroundColor: '#f0f0f0',
        marginVertical: 15,
        borderRadius: 5,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    btnLeft: {
        width: 30,
        height: 30,
        backgroundColor: '#f0f0f0',
        borderRadius: 100,
    },
    input: {
        width: '90%',
        minHeight: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    container: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    scrollview: {
        width: '100%',
        padding: 12,
    },
    btn: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#fe8a71',
        paddingHorizontal: 10,
        borderRadius: 5,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0.3 * 4, height: 0.5 * 4 },
        shadowOpacity: 0.2,
        shadowRadius: 0.7 * 4,
    },
    safeareview: {
        justifyContent: 'center',
        flex: 1,
    },
    btnTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
});