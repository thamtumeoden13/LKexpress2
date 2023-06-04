
import React, { useContext, useEffect, useState } from 'react';

import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Keyboard, Alert, FlatList } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
// import TouchableScale from 'react-native-touchable-scale';
import LottieView from 'lottie-react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import EntypoIcon from 'react-native-vector-icons/Entypo'

import TouchableScale from 'components/common/button/TouchableScale';
import AnimatedAppearance from 'components/common/button/AnimatedAppearance';

import { AuthContext } from '../../utils'
import { notificationManager } from '../../utils/NotificationManager'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import styles from './styles';

const HomeScreen = (props) => {

    const db = firestore()
    const entityRef = db.collection('rooms')
    const entityUserRef = db.collection('users')
    const entityChatRef = db.collection('chats')

    const [state, setState] = useState({
        roomID: '',
        userID: '',
        userName: '',
        avatarURL: '',
        connectUser: '',
        level: '',
        user: {},
        userConnect: {},
        isDataFetched: false
    })

    useEffect(() => {
        setTimeout(async () => {
            const userToken = await AsyncStorage.getItem('SocialUser');
            const user = JSON.parse(userToken)
            console.log('[user]', user)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.name,
                    avatarURL: user.picture.data.url,
                    email: user.email,
                    user: user
                }
            })
        })
    }, [])

    const DATA = [1, 2, 3, 4, 5, 6]
    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={{ flexDirection: 'column' }}   > */}
            <View style={styles.cirle} />
            <View style={{ margintop: verticalScale(64), paddingVertical: verticalScale(20) }}>
                <Image
                    source={!!state.avatarURL ? { uri: state.avatarURL } : require('@assets/bootsplash_logo.png')}
                    style={{
                        width: moderateScale(100), height: moderateScale(100),
                        borderRadius: moderateScale(50), alignSelf: 'center'
                    }}
                />
                <Text style={{ alignSelf: 'center' }}>{state.email}</Text>
                <Text style={{ alignSelf: 'center' }}>{state.userName}</Text>
            </View>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                height: verticalScale(48), paddingHorizontal: moderateScale(8)
            }}>
                <Text style={{ flex: 1, fontSize: scale(18), fontWeight: 'bold' }}>
                    {`Campaigns`}
                </Text>
                <TouchableOpacity style={{
                    width: moderateScale(40), height: moderateScale(40),
                    borderRadius: moderateScale(20), marginRight: moderateScale(8),
                    backgroundColor: '#f1f2f3',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <AntDesignIcon name='areachart' size={scale(18)} />
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: moderateScale(40), height: moderateScale(40),
                    borderRadius: moderateScale(20), marginRight: moderateScale(8),
                    backgroundColor: '#f1f2f3',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <AntDesignIcon name='areachart' size={scale(18)} />
                </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                height: verticalScale(48), paddingHorizontal: moderateScale(8)
            }}>
                <TouchableOpacity style={{
                    width: moderateScale(120), height: moderateScale(40),
                    borderRadius: moderateScale(8), marginRight: moderateScale(8),
                    backgroundColor: '#f1f2f3',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <Text style={{ fontSize: scale(14), fontWeight: '500' }}>{'Last 7 Days'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: moderateScale(96), height: moderateScale(40),
                    borderRadius: moderateScale(8), marginRight: moderateScale(8),
                    backgroundColor: '#f1f2f3',
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                }}>
                    <AntDesignIcon name='areachart' size={scale(18)} />
                    <Text style={{ marginLeft: moderateScale(8), fontSize: scale(14), fontWeight: '500' }}>{'Filter'}</Text>
                </TouchableOpacity>
            </View>
            {/* </View> */}
            <FlatList
                data={DATA}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ flexGrow: 1, marginTop: verticalScale(8) }}
                renderItem={({ item, index }) => {
                    return (
                        <AnimatedAppearance index={index}>
                            <TouchableScale
                                // onPress={onhandlePress}
                                disabled={false}
                                scaleTo={0.97}
                            >
                                <View style={{
                                    height: verticalScale(160),
                                    borderRadius: scale(16),
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    marginHorizontal: scale(16),
                                    marginVertical: verticalScale(8),
                                    shadowColor: '#000',
                                    shadowOpacity: 0.2,
                                    shadowOffset: { width: 4, height: 4 },
                                    padding: moderateScale(8)
                                }}>
                                    <View style={{ flexDirection: 'row', width: '100%', height: verticalScale(24), justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <EntypoIcon name='dot-single' size={scale(14)} color={'green'} />
                                            <Text style={{ fontSize: scale(10) }}>{`Active`}</Text>
                                        </View>
                                        <MaterialCommunityIcon name='dots-vertical' size={scale(14)} />
                                    </View>
                                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                        <Image
                                            source={{ uri: state.avatarURL }}
                                            resizeMode='cover'
                                            style={{ width: scale(48), height: scale(48), borderRadius: scale(8) }}
                                        />
                                        <Text style={{ marginLeft: moderateScale(8), fontWeight: '500', fontSize: scale(14) }}>{`Conversions for flash sale`}</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                                        marginTop: verticalScale(8)
                                    }}>
                                        <View style={{
                                            flex: 1, flexDirection: 'column', justifyContent: 'center',
                                            height: verticalScale(48), paddingRight: moderateScale(4)
                                        }}>
                                            <Text style={{ fontSize: scale(14), fontWeight: '500' }}>{`261`}</Text>
                                            <Text style={{ fontSize: scale(12), fontWeight: '300' }}>{`Website purchases`}</Text>
                                        </View>
                                        <View style={{
                                            flex: 1, flexDirection: 'column', justifyContent: 'center',
                                            height: verticalScale(48), paddingRight: moderateScale(4)
                                        }}>
                                            <Text style={{ fontSize: scale(14), fontWeight: '500' }}>{`$0.02`}</Text>
                                            <Text style={{ fontSize: scale(12), fontWeight: '300' }}>{`cost per post`}</Text>
                                        </View>
                                        <View style={{
                                            flex: 1, flexDirection: 'column', justifyContent: 'center',
                                            height: verticalScale(48), paddingRight: moderateScale(4)
                                        }}>
                                            <Text style={{ fontSize: scale(14), fontWeight: '500' }}>{`$62.40`}</Text>
                                            <Text style={{ fontSize: scale(12), fontWeight: '300' }}>{`Spent`}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableScale>
                        </AnimatedAppearance>
                    )
                }}
            />
        </SafeAreaView>
    )
}

export default HomeScreen