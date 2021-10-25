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
import { notificationManager } from 'utils/NotificationManager'

import styles from './styles';
import AddIcon from 'components/common/icon/AddIcon';
import BackIcon from 'components/common/icon/BackIcon';

const ChatScreen = (props) => {
    const db = firestore()
    const entityRef = db.collection('rooms')
    const entityChatRef = db.collection('chats')
    const entityUserRef = db.collection('users')

    const [state, setState] = useState({
        userID: '',
        connectID: '',
        userName: '',
        user: {},
        page: 0,
        isDataFetchedRoomList: false,
        isDataFetchedChatList: false,
    })
    const [rooms, setRooms] = useState([])
    const [usersByChat, setUsersByChat] = useState([])
    const [users, setUsers] = useState([])
    const [allChats, setAllChats] = useState([])
    const [allChatsFilter, setAllChatsFilter] = useState([])

    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.fullName,
                    user: user
                }
            })
        });
        return () => {
            focusListener
        }
    }, [])

    useEffect(() => {
        if (!!state.userID) {
            const unsubscribeRoomList = entityRef.onSnapshot(getRealtimeCollectionRoomList, err => Alert.alert(error))
            const queryUserList = entityUserRef.where("id", "!=", state.userID)
            const unsubscribeUserList = queryUserList.onSnapshot(getRealtimeCollectionUserList, err => Alert.alert(error))
            return () => {
                unsubscribeRoomList()
                unsubscribeUserList()
            }
        }
    }, [state.userID])

    useEffect(() => {
        props.navigation.setOptions({
                headerTitle: () =>
                <HeaderSearchInput
                    placeholder={'Tìm tin nhắn, bạn bè'}
                    handerSearchInput={(value) => onHanderSearchInput(value)}
                />,
            headerRight: () => null,
        });
    }, [props.navigation, allChats])

    useEffect(() => {
        if (!!users && users.length > 0) {
            const unsubscribeChatList = entityChatRef.onSnapshot(getRealtimeCollectionChatList, err => Alert.alert(error))
            return () => {
                unsubscribeChatList()
            }
        }
    }, [users])

    useEffect(() => {
        let allChats = [...rooms, ...usersByChat]
        allChats.sort((a, b) => b.currentCreatedAt.toDate().getTime() - a.currentCreatedAt.toDate().getTime())
        setAllChats(allChats)
        setAllChatsFilter(allChats)
    }, [rooms, usersByChat])

    const onHanderSearchInput = (searchInput) => {
        if (searchInput) {
            const newData = allChats.filter((item) => {
                const textData = searchInput.toUpperCase()
                const itemData = `${item.currentMessage.toUpperCase()},${item[`${item.type == 1 ? 'currentUser' : 'roomID'}`].toUpperCase()}`
                return itemData.indexOf(textData) > -1
            })
            setAllChatsFilter(newData)
        } else {
            setAllChatsFilter(allChats)
        }
    }

    const getRealtimeCollectionRoomList = async (querySnapshot) => {
        const reads = querySnapshot.docs.map(async (doc) => {
            const room = doc.data()
            const docID = doc.id
            console.log('room', room)
            const querySnapshot2 = await entityRef.doc(doc.id).collection('users')
                .where("id", "==", state.userID)
                .get()
            if (querySnapshot2.docs.length > 0) {
                return {
                    ...room,
                    docID: docID,
                    name: room.currentUser,
                    subtitle: room.currentMessage,
                    avatarURL: room.currentAvatar,
                    type: 2
                }
            }
        })
        let result = await Promise.all(reads)
        const rooms = result.filter(e => { return !!e && Object.keys(e).length > 0 });
        console.log('rooms', rooms)
        setRooms(rooms)
        setState(prev => { return { ...prev, isDataFetchedRoomList: true } })
    }

    const getRealtimeCollectionChatList = async (querySnapshot) => {
        let UsersByChat = []
        querySnapshot.forEach((doc) => {
            const user = doc.data()
            const docID = doc.id
            const querySnapshot2 = doc.id.split('|')
            if (querySnapshot2.includes(state.userID)) {
                const connectID = querySnapshot2.find(e => e != state.userID)
                UsersByChat.push({
                    ...user,
                    docID: docID,
                    name: user.currentUser,
                    subtitle: user.currentMessage,
                    avatarURL: user.currentAvatar,
                    userConnect: {},
                    connectID: connectID,
                    connectName: '',
                    connectAvatarURL: '',
                })
            }
        });
        UsersByChat.map(e => {
            const find = users.find(f => e.connectID == f.id)
            e.userConnect = find
            e.connectName = find.email
            e.connectAvatarURL = find.avatarURL
            e.type = 1
            return e
        })
        setUsersByChat(UsersByChat)
        setState(prev => { return { ...prev, isDataFetchedChatList: true } })
    }

    const getRealtimeCollectionUserList = async (querySnapshot) => {
        let users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            return { ...user, doc: doc.id }
        })
        setUsers(users)
        // const options = {
        //     soundName: "default",
        //     playSound: true,
        //     vibrate: true
        // }
        // notificationManager.showNotificationSchedule(
        //     Math.random(),
        //     `Alert`,
        //     `Init Notification`,
        //     `${new Date()}`,
        //     {}, // data
        //     options //options
        // )
    }

    const onHandlerJoinRoom = (roomID) => {
        // const pushAction = StackActions.push('RoomChatDetail', { id: roomID })
        props.navigation.navigate('RoomChatDetail', { id: roomID })
    }

    const onHandlerConnectRoom = (docID) => {
        // const pushAction = StackActions.push('ChatDetail', { id: docID })
        props.navigation.navigate('ChatDetail', { id: docID })
    }

    const keyExtractor = (item, index) => item.docID.toString()

    const renderItemRoomChat = (item) => {
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
                style={{ borderTopColor: '#6a6a6a', borderTopWidth: 0.2, }}
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
                    {/* <ListItem.Subtitle style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(12) }}>
                    {`•${formatDistanceToNow(item.currentCreatedAt.toDate(), { locale: vi })}`}
                </ListItem.Subtitle> */}
                </ListItem.Content>
                <ListItem.Chevron color="#fff" />
            </ListItem>
        )
    }

    const renderItemChat = (item) => {
        return (
            <ListItem
                Component={TouchableScale}
                friction={90} //
                tension={100} // These props are passed to the parent component (here TouchableScale)
                activeScale={0.95} //
                linearGradientProps={{
                    colors: ['#fff', '#fff'], //0278ae
                    start: { x: 1, y: 0 },
                    end: { x: 0.2, y: 0 },
                }}
                ViewComponent={LinearGradient} // Only if no expo
                style={{
                    // marginTop: verticalScale(5),
                    borderTopColor: '#000', borderTopWidth: 0.5,
                    // borderBottomColor: '#0278ae', borderBottomWidth: 1,
                }}
                containerStyle={{ paddingVertical: verticalScale(10) }}
                onPress={() => onHandlerConnectRoom(item.docID)}
            >
                <Avatar rounded source={{ uri: item.connectAvatarURL }} />
                <ListItem.Content>
                    <ListItem.Title style={{ color: '#000', fontWeight: '300', fontSize: scale(16), lineHeight: scale(22) }}>
                        {item.currentUser}
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

    const renderItem = ({ item }) => {
        let renderItemComponent
        switch (true) {
            case item.type == 1:
                renderItemComponent = renderItemChat(item)
                break;
            case item.type == 2:
                renderItemComponent = renderItemRoomChat(item)
                break;
        }
        return renderItemComponent
    }

    return (
        <SafeAreaView style={{ flex: 1 }} >
            {!state.isDataFetchedChatList || !state.isDataFetchedRoomList ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
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
                    {!!allChatsFilter && allChatsFilter.length > 0 &&
                        <FlatList
                            keyExtractor={keyExtractor}
                            data={allChatsFilter}
                            extraData={allChatsFilter}
                            renderItem={renderItem}
                        />
                    }
                </>
            }
        </SafeAreaView>
    )
}

export default ChatScreen