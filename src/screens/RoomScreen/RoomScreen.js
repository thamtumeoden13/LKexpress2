import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import format from 'date-fns/format'
import { vi } from 'date-fns/locale/vi'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import HeaderSearchInput from 'components/common/Header/SearchInput'
import AddIcon from 'components/common/icon/AddIcon'

import styles from './styles';

const RoomScreen = (props) => {
    const db = firestore()
    const entityRef = db.collection('rooms')
    const entityUserRef = db.collection('users')

    const [state, setState] = useState({
        userID: '',
        connectID: '',
        userName: '',
        user: {},
        level: '',
        page: 0,
        isDataFetchedRoomList: false,
    })
    const [rooms, setRooms] = useState([])
    const [roomsFilter, setRoomsFilter] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.fullName,
                    user: user,
                    level: user.level,
                }
            })
            // const unsubscribeRoomList = entityRef.onSnapshot(getRealtimeCollectionRoomList, err => Alert.alert(error))
            // const queryUserList = entityUserRef.where("id", "!=", state.userID)
            // const unsubscribeUserList = queryUserList.onSnapshot(getRealtimeCollectionUserList, err => Alert.alert(error))
            // return () => {
            //     unsubscribeRoomList()
            //     // unsubscribeUserList()
            // }
        });
        return () => {
            focusListener
        }
    }, [])

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: () =>
                <HeaderSearchInput
                    placeholder={'Tìm nhóm'}
                    handerSearchInput={(value) => onHanderSearchInput(value)}
                />,
        });
    }, [props.navigation, rooms])

    useEffect(() => {
        console.log('state.level', state.level)
        if (state.level == 1) {
            props.navigation.setOptions({
                headerRight: () => <AddIcon navigation={props.navigation} onOpen={() => addNewRoom()} />,
            });
        }
    }, [state.level])

    useEffect(() => {
        if (!!state.userID) {
            const unsubscribeRoomList = entityRef.onSnapshot(getRealtimeCollectionRoomList, err => Alert.alert(error))
            // const queryUserList = entityUserRef.where("id", "!=", state.userID)
            // const unsubscribeUserList = queryUserList.onSnapshot(getRealtimeCollectionUserList, err => Alert.alert(error))
            return () => {
                unsubscribeRoomList()
                // unsubscribeUserList()
            }
        }
    }, [state.userID])

    const addNewRoom = () => {
        const pushAction = StackActions.push('AddRoom')
        props.navigation.dispatch(pushAction)
    }

    const onHanderSearchInput = (searchInput) => {
        if (searchInput) {
            const newData = rooms.filter((item) => {
                const textData = searchInput.toUpperCase()
                const itemData = `${item.roomID.toUpperCase()}}`
                return itemData.indexOf(textData) > -1
            })
            setRoomsFilter(newData)
        } else {
            setRoomsFilter(rooms)
        }
    }

    const getRealtimeCollectionRoomList = async (querySnapshot) => {
        const reads = querySnapshot.docs.map(async (doc) => {
            const room = doc.data()
            const querySnapshot2 = await entityRef.doc(doc.id).collection('users').where("id", "==", state.userID).get()
            if (querySnapshot2.docs.length > 0) {
                return {
                    ...room,
                    roomRef: doc.id,
                    name: room.currentUser,
                    subtitle: room.currentMessage,
                    avatarURL: room.currentAvatar,
                }
            }
        })
        let result = await Promise.all(reads)
        const rooms = result.filter(e => { return !!e && Object.keys(e).length > 0 });
        setRooms(rooms)
        setRoomsFilter(rooms)
        setState(prev => { return { ...prev, isDataFetchedRoomList: true } })
    }

    const onHandlerJoinRoom = (roomID) => {
        const pushAction = StackActions.push('RoomChatDetail', { id: roomID })
        props.navigation.dispatch(pushAction)
    }

    const keyExtractor = (item, index) => item.roomRef.toString()

    const renderItemRoomChat = ({ item }) => {
        return (
            <ListItem
                Component={TouchableScale}
                friction={90} //
                tension={100} // These props are passed to the parent component (here TouchableScale)
                activeScale={0.95} //
                linearGradientProps={{
                    colors: ['#fff', '#fff'], //007580
                    start: { x: 1, y: 0 },
                    end: { x: 0.2, y: 0 },
                }}
                ViewComponent={LinearGradient} // Only if no expo
                style={{
                    borderTopColor: '#6a6a6a', borderTopWidth: 0.2,
                    // borderBottomColor: '#007580', borderBottomWidth: 1,
                }}
                containerStyle={{ paddingVertical: verticalScale(10) }}
                onPress={() => onHandlerJoinRoom(item.roomID)}
            >
                <Avatar rounded source={{ uri: item.currentAvatar }} />
                <ListItem.Content>
                    <ListItem.Title style={{ color: '#000', fontWeight: '300', fontSize: scale(16), lineHeight: scale(22) }}>
                        {`Nhóm: ${item.roomID}`}
                    </ListItem.Title>
                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                        <ListItem.Subtitle style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(12), lineHeight: scale(16) }}>
                            {`${item.currentMessage}`}
                        </ListItem.Subtitle>
                        <ListItem.Subtitle style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(10), lineHeight: scale(16) }}>
                            {` • ${format(item.currentCreatedAt.toDate(), 'yyyy-MM-dd HH:mm', { locale: vi })}`}
                        </ListItem.Subtitle>
                    </View>
                </ListItem.Content>
                <ListItem.Chevron color="#fff" />
            </ListItem>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }} >
            {!state.isDataFetchedRoomList ?
                <View style={{ flex: 1, justifyContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        source={require('@assets/animations/890-loading-animation.json')}
                        colorFilters={[{
                            keypath: "button",
                            color: "#F00000"
                        }, {
                            keypath: "Sending Loader",
                            color: "#F00000"
                        }]}
                        style={{ width: calcWidth(30), height: calcWidth(30) }}
                        autoPlay
                        loop
                    />
                </View>
                :
                <>
                    {!!roomsFilter && roomsFilter.length > 0 &&
                        <FlatList
                            keyExtractor={keyExtractor}
                            data={roomsFilter}
                            extraData={roomsFilter}
                            renderItem={renderItemRoomChat}
                        />
                    }
                </>
            }
        </SafeAreaView>
    )
}

export default RoomScreen