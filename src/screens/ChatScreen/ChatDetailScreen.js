import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react'
import {
    FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity,
    View, KeyboardAvoidingView, Alert, ScrollView
} from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request } from 'react-native-permissions';
import ActionSheet from 'react-native-actions-sheet';
import firestore from '@react-native-firebase/firestore';

import { notificationManager } from 'utils/NotificationManager'
import HeaderTitle from 'components/common/Header/HeaderTitle'
import ActionSheetIcon from 'components/common/icon/ActionSheetIcon'

import styles from './styles';
import BackIcon from 'components/common/icon/BackIcon';
import CallIcon from 'components/common/icon/CallIcon';

const ChatDetailScreen = ({ route, navigation }) => {

    const db = firestore()
    const entityChatRef = db.collection('chats')
    const entityUserRef = db.collection('users')
    const entityVideRoomRef = db.collection('videorooms')

    const actionSheetRef = useRef();
    const scrollViewRef = useRef();

    const onHasReachedTop = hasReachedTop => {
        if (hasReachedTop)
            scrollViewRef.current?.setNativeProps({
                scrollEnabled: hasReachedTop,
            });
    };

    const onClose = () => {
        scrollViewRef.current?.setNativeProps({
            scrollEnabled: false,
        });
        setState(prev => { return { ...prev, actionSheetType: 0 } })
    };

    const onOpen = () => {
        scrollViewRef.current?.setNativeProps({
            scrollEnabled: false,
        });
    };
    const [state, setState] = useState({
        userID: '',
        connectID: '',
        documentID: '',
        userName: '',
        avatarURL: '',
        level: '',
        user: {},
        userConnect: {},
        actionSheetType: 0,
        latitude: null,//10.851836,
        longitude: null,//106.797520
        geolocation: '',
    })
    const [messages, setMessages] = useState([])

    useEffect(() => {
        setTimeout(async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            const documentID = route.params.id
            const split = documentID.split('|')
            const connectID = split.find(e => e != user.id)
            setState(prev => {
                return {
                    ...prev,
                    documentID,
                    connectID,
                    userID: user.id,
                    userName: user.fullName,
                    avatarURL: user.avatarURL,
                    level: user.level,
                    user
                }
            })
        })
        requestLocationPermission()
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <BackIcon navigation={navigation} />,
        });
    }, [navigation])

    useEffect(() => {
        if (!!state.connectID && state.connectID.length > 0) {
            getUsersInfo()
        }
    }, [state.connectID])

    useEffect(() => {
        if (state.documentID) {
            navigation.setOptions({
                headerRight: () => <CallIcon navigation={navigation} onOpen={() => onCallOrJoin(state.documentID, state.userID)} />,
            });
        }
    }, [state.documentID])

    useEffect(() => {

        if (!!state.documentID) {
            const unsubscribe = entityVideRoomRef.onSnapshot((snapshot) => {
                if (snapshot) {
                    snapshot.docChanges().forEach(change => {
                        const room = change.doc.data()
                        const roomID = change.doc.id
                        if (change.type == 'added' && roomID == state.documentID && room.roomMasterID != state.userID) {
                            handlerOpenVideoCallModal(room.displayName)
                        }
                    })
                }
            })
            return () => {
                unsubscribe();
            }
        }
    }, [state.documentID])

    useEffect(() => {
        // let unsubscribe
        if (!!state.userConnect && Object.keys(state.userConnect).length > 0) {
            navigation.setOptions({
                headerTitle: () => <HeaderTitle title={`${state.userConnect.fullName}`} />,
            });
            const query = entityChatRef
                .doc(`${state.documentID}`)
                .collection('messages')
            const unsubscribe = query.onSnapshot(getRealtimeCollection, err => Alert.alert(error));
            return () => {
                unsubscribe();
            }
        }
    }, [state.userConnect])

    const getRealtimeCollection = (querySnapshot) => {
        let messagesFireStore = []
        querySnapshot.docChanges().forEach(change => {
            const message = change.doc.data()
            if (change.type === "added") {
                messagesFireStore.push({
                    ...message,
                    createdAt: message.createdAt.toDate(),
                    user: {
                        _id: message.user._id,
                        name: message.user.name,
                        avatar: message.user.avatar,
                    }
                })
            }
            if (change.type === "modified") {
                console.log("Modified message: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed message: ", change.doc.data());
            }
        })
        messagesFireStore.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        appendMessages(messagesFireStore, state.user, state.userConnect)
    }

    const getUsersInfo = async () => {
        const querySnapshot = await entityUserRef.where("id", "==", state.connectID).get()
        let users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            return { ...user, doc: doc.id }
        })
        setState(prev => { return { ...prev, userConnect: users[0] } })
    }

    const appendMessages = useCallback((messages, user, userConnect) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        if (!!messages && messages.length > 0 && user.id != messages[0].authorID) {
            handlerLocalPushNotify(messages[0], state.userConnect)
        }
    }, [messages, state.userConnect])

    const handlerLocalPushNotify = (message, userConnect) => {
        const options = {
            soundName: "default",
            playSound: true,
            vibrate: true
        }
        notificationManager.showNotification(
            Math.random(),
            `${userConnect.fullName}`,
            `${message.text}`,
            {}, // data
            options //options
        )
    }

    const onSend = (messages = []) => {
        const { text, _id, createdAt } = messages[0]
        const currentValue = {
            currentID: state.userID,
            currentUser: state.userName,
            currentAvatar: state.avatarURL,
            currentMessage: text,
            currentMessageID: _id,
            currentCreatedAt: createdAt
        }
        entityChatRef.doc(`${state.documentID}`).set(currentValue)
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })

        const data = {
            _id: _id,
            authorID: state.userID,
            createdAt: createdAt,
            text: text,
            geolocation: state.geolocation,
            user: {
                _id: state.userID,
                name: state.userName,
                avatar: state.avatarURL
            },
        }
        entityChatRef.doc(`${state.documentID}`).collection('messages')
            .doc().set(data)
            .then((doc) => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })
        entityUserRef.doc(state.userID)
            .update({
                currentUpdateLocation: state.geolocation
            })
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })
    }

    const handlerLongPressMessage = (action, message) => {
        actionSheetRef.current?.show()
    }

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (response === 'granted') {
                localCurrentPosition()
            }
        }
        else {
            const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (response === 'granted') {
                localCurrentPosition()
            }
        }
    }

    const localCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setState(prev => {
                    return {
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        geolocation: `${position.coords.latitude},${position.coords.longitude}`,
                    }
                })
                console.log('geolocation', `${position.coords.latitude},${position.coords.longitude}`)
            },
            (error) => {
                setState(prev => {
                    return {
                        ...prev,
                        latitude: null,//10.851836,
                        longitude: null,//106.797520
                        geolocation: state.geolocation,
                    }
                })
                console.log('geolocation-error', error)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const onCallOrJoin = (documentID, userID) => {
        console.log('documentID', documentID, userID)
        navigation.navigate('VideoCall',
            {
                roomID: documentID,
                roomMasterID: userID,
                displayName: 'Người Gọi...'
            },
        )
    }

    const options = [
        'Cancel',
        'Apple',
        <Text style={{ color: 'yellow' }}>Banana</Text>,
        'Watermelon',
        <Text style={{ color: 'red' }}>Durian</Text>
    ]

    const handlerOpenVideoCallModal = async (displayName) => {
        navigation.navigate('VideoCallKeepModal', {
            roomID: state.documentID,
            displayName: displayName,
        })
    }

    const chat = <GiftedChat
        messages={messages}
        user={{
            _id: state.userID,
            name: state.userName,
            avatarURL: state.avatarURL
        }}
        onSend={onSend}
        // onLongPress={handlerLongPressMessage}
        onPressAvatar={() => Alert.alert('yyy')}
    />

    return (
        <SafeAreaView style={{ flex: 1 }} >
            {chat}
            <ActionSheet
                initialOffsetFromBottom={0.6}
                ref={actionSheetRef}
                onOpen={onOpen}
                statusBarTranslucent
                bounceOnOpen={true}
                bounciness={4}
                gestureEnabled={true}
                onClose={onClose}
                defaultOverlayOpacity={0.3}
            >
                <ScrollView
                    ref={scrollViewRef}
                    nestedScrollEnabled={true}
                    onScrollEndDrag={() =>
                        actionSheetRef.current?.handleChildScrollEnd()
                    }
                    onScrollAnimationEnd={() =>
                        actionSheetRef.current?.handleChildScrollEnd()
                    }
                    onMomentumScrollEnd={() =>
                        actionSheetRef.current?.handleChildScrollEnd()
                    }
                    style={styles.scrollview}>
                    <View style={styles.containerActionSheet}>
                        {['#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71'].map(
                            color => (
                                <TouchableOpacity
                                    onPress={() => {
                                        actionSheetRef.current?.hide();
                                    }}
                                    key={color}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 100,
                                        backgroundColor: color,
                                    }}
                                />
                            ),
                        )}
                    </View>
                    {/*  Add a Small Footer at Bottom */}
                    <View style={styles.footer} />
                </ScrollView>
            </ActionSheet>
        </SafeAreaView>
    )
}

export default ChatDetailScreen