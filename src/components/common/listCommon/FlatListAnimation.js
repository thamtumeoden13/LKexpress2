import React, { useRef, useState, useEffect } from 'react'
import {
    View, Text, Image, StyleSheet, Animated, TouchableOpacity, Alert, Linking
} from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesignIcons from 'react-native-vector-icons/AntDesign'
import AnimatedAppearance from '../button/AnimatedAppearance'

const BG_IMG = 'https://images.pexels.com/photos/2033997/pexels-photo-2033997.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
const SPACING = 20
const AVATAR_SIZE = 70
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3

const FlatListAnimation = ({ result, onHandlerConnectRoom }) => {

    const [data, setData] = useState([])
    const scrollY = useRef(new Animated.Value(0)).current

    useEffect(() => {
        setData(!!result ? result : [])
    }, [result])

    const handlerCallPhone = (phone) => {
        let url = '';
        if (Platform.OS === 'android') {
            url = `tel://${phone}`;
        } else {
            url = `telprompt:${phone}`;
        }
        Linking.canOpenURL(url)
            .then((supported) => {
                // if (!supported) {
                //     console.error('Can\'t handle url: ' + url);
                // } else {
                //     return Linking.openURL(url)
                //         .then((data) => console.log("then", data))
                //         .catch((err) => { throw err; });
                // }
                return Linking.openURL(url)
                    .then((data) => console.log("then", data))
                    .catch((err) => { throw err; });
            })
            .catch((err) => {
                // this.onHandlerToast(true, 'error_custom', 'Lỗi gọi điện thoại', 'Không thể gọi điện thoại! vui lòng thao tác bằng tay')
                console.log('An error occurred url', err)
            });
    }

    const handlerChatWithFriend = (item) => {
        console.log('handlerChatWithFriend', item)
        onHandlerConnectRoom(item)
    }

    const handlerShowLocation = (location) => {
        if (location) {
            const url = `maps://?q=${location.replace(/ /g, '')}`
            Linking.canOpenURL(url)
                .then((supported) => {
                    return Linking.openURL(url)
                        .then((data) => console.log("then", data))
                        .catch((err) => { throw err; });
                })
                .catch((err) => {
                    // this.onHandlerToast(true, 'error_custom', 'Lỗi gọi điện thoại', 'Không thể gọi điện thoại! vui lòng thao tác bằng tay')
                    console.log('An error occurred url', err)
                });
        }
    }

    const renderItem = ({ item, index }) => {

        const inputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 2),
        ]
        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0]
        })

        const opacityInputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 1),
        ]
        const opacity = scrollY.interpolate({
            inputRange: opacityInputRange,
            outputRange: [1, 1, 1, 0]
        })

        return (
            <AnimatedAppearance index={index}>
                <Animated.View style={{
                    flexDirection: 'row', borderRadius: SPACING / 2,
                    padding: SPACING, marginBottom: SPACING,
                    backgroundColor: '#fff9',
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: SPACING / 2
                    },
                    shadowOpacity: .3,
                    shadowRadius: SPACING,
                    transform: [{ scale }],
                    opacity
                }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: AVATAR_SIZE, height: AVATAR_SIZE,
                            borderRadius: AVATAR_SIZE,
                            marginRight: SPACING / 2
                        }}
                    />
                    <View style={{ flex: 1 }}>
                        {!!item.name && <Text style={{ fontSize: 22, fontWeight: '600', lineHeight: 30 }}>{item.name}</Text>}
                        {!!item.jobTitle && <Text style={{ fontSize: 18, opacity: 0.7, fontStyle: 'italic', lineHeight: 20 }}>{item.jobTitle}</Text>}
                        {!!item.email && <Text style={{ fontSize: 14, opacity: 0.8, color: '#00f' }}>{item.email}</Text>}
                        {!!item.address && <Text style={{ fontSize: 12, opacity: 0.8, color: '#000' }}>{item.address}</Text>}
                        <View style={{ paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ alignItems: 'flex-start', width: '30%' }} onPress={() => handlerCallPhone(item.phoneNumber)}>
                                <SimpleLineIcons name='phone' size={20} color={'#000'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignItems: 'flex-start', width: '30%' }} onPress={() => handlerChatWithFriend(item)}>
                                <AntDesignIcons name='message1' size={20} color={'#000'} />
                            </TouchableOpacity>
                            {item.userType == 1 &&
                                <TouchableOpacity style={{ alignItems: 'flex-start', width: '30%' }} onPress={() => handlerShowLocation(item.currentUpdateLocation)}>
                                    <SimpleLineIcons name='location-pin' size={20} color={'#000'} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </Animated.View>
            </AnimatedAppearance>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Image
                source={{ uri: BG_IMG }}
                style={StyleSheet.absoluteFill}
                blurRadius={50}
            />
            <Animated.FlatList
                data={data}
                extraData={data}
                keyExtractor={({ key }) => key}
                renderItem={renderItem}
                contentContainerStyle={{ padding: SPACING }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            />
        </View>
    )
}

export default FlatListAnimation