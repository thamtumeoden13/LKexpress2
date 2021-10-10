import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Image } from 'react-native'
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
                source={{ uri: !!imgBase64 ? `data:image/png;base64,${imgBase64}` : 'https://images.pexels.com/photos/8066167/pexels-photo-8066167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' }}
                style={{ width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24) }}
                resizeMode={'cover'}
            />
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', width: '100%', paddingLeft: moderateScale(10) }}>
                    <Text style={{ fontSize: scale(16), fontWeight: '500', }}>{fullName}</Text>
                </View>
                {!!dateCreated && <View style={{ flexDirection: 'row', width: '100%', paddingLeft: moderateScale(10) }}>
                    <Text style={{ color: '#6a6a6a', fontSize: scale(12) }}>{`${formatDistanceToNowVi(dateCreated)}`}</Text>
                    <Text style={{ color: '#6a6a6a', fontSize: scale(12) }}>{` lúc ${getHours(dateCreated)}:${getMinutes(dateCreated)}`}</Text>
                </View>}
            </View>
        </View>
    )
}

export default Header