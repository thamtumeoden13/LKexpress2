import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Image } from 'react-native'
import IonsIcon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import TouchableScale from 'react-native-touchable-scale';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';

import { moderateScale, scale, verticalScale } from 'utils/scaleSize';
import { formatCount, formatDistanceToNowVi } from 'utils/function'

const Header = ({ fullName, imgURL, imgBase64, dateCreated }) => {

    return (
        <View style={{
            height: verticalScale(48), width: '100%',
            flexDirection: 'row', alignItems: 'center',
            marginVertical: scale(10),
            paddingHorizontal: scale(10)
        }}>
            <Image
                source={{ uri: !!imgBase64 ? `data:image/png;base64,${imgBase64}` : imgURL }}
                style={{ width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24) }}
                resizeMode={'cover'}
            />
            <View style={{ flexDirection: 'column', paddingHorizontal: moderateScale(10) }}>
                <View style={{ flexDirection: 'row', width: '100%', }}>
                    <Text style={{ fontSize: scale(14), fontWeight: '500', padding: scale(5) }}>{fullName}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', }}>
                    <AntDesignIcon name='user' size={14} style={{ marginRight: scale(5) }} />
                    <Text style={{ color: '#6a6a6a', fontSize: scale(12) }}>{`${formatDistanceToNowVi(dateCreated)}, `}</Text>
                    <Text style={{ color: '#6a6a6a', fontSize: scale(12) }}>{`lúc ${getHours(dateCreated)}:${getMinutes(dateCreated)}`}</Text>
                </View>
            </View>
        </View>
    )
}

export default Header