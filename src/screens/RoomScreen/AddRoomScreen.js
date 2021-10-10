import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Image,
    StatusBar,
    Alert,
    Keyboard
} from 'react-native';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AddRoomCom from 'components/room/AddRoom'
import HeaderTitle from 'components/common/Header/HeaderTitle'

import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import BackIcon from 'components/common/icon/BackIcon';

const db = firestore()
const entityRef = db.collection('rooms')
const entityUserRef = db.collection('users')

const AddRoomScreen = (props) => {

    const [state, setState] = useState({
        userID: '',
        userName: '',
        avatarURL: '',
        user: ''
    })

    const [users, setUsers] = useState([])
    const [usersFilter, setUsersFilter] = useState([])

    useEffect(() => {
        setTimeout(async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.fullName,
                    avatarURL: user.avatarURL,
                    user
                }
            })
        })
    }, [])

    useEffect(() => {
        if (!!state.userID) {
            const queryUserList = entityUserRef.where("id", "!=", state.userID)
            const unsubscribeUserList = queryUserList.onSnapshot(getRealtimeCollectionUserList, err => Alert.alert(error))
            return () => {
                unsubscribeUserList()
            }
        }
    }, [state.userID])


    useEffect(() => {
        if (props.navigation) {
            props.navigation.setOptions({
                headerTitle: () => <HeaderTitle title={`Thêm mới`} />,
            });
        }
    }, [props.navigation])

    const getRealtimeCollectionUserList = async (querySnapshot) => {
        let users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            const phoneNumber = !!user.phoneNumber
                ? `${user.phoneNumber.substr(0, 3)} ${user.phoneNumber.substr(3, 3)} ${user.phoneNumber.substr(6)}`
                : ''
            return {
                ...user,
                docRef: doc.id,
                name: user.fullName,
                jobTitle: phoneNumber,
                email: user.email,
                image: user.avatarURL
            }
        })
        console.log('users', users)
        setUsers(users)
        setUsersFilter(users)
        setState(prev => { return { ...prev, isDataFetchedUserList: true } })
    }
    const addRoom = (result) => {
        let { roomName, listUser } = result
        const _id = 1
        const currentValue = {
            roomID: roomName,
            roomName: roomName,
            currentUser: state.userName,
            currentAvatar: state.avatarURL,
            currentMessage: 'Hello, World!',
            currentMessageID: _id,
            currentCreatedAt: new Date()
        }
        entityRef.doc(`${roomName}`).set(currentValue)
            .then((_doc) => {
                const users = [...listUser, state.user]
                users.map(user => {
                    entityRef.doc(`${roomName}`).collection('users')
                        .doc().set(user)
                        .then(_doc => {
                            Keyboard.dismiss()
                        })
                        .catch((error) => {
                            alert(error)
                        })
                })

                const data = {
                    _id: _id,
                    authorID: state.userID,
                    createdAt: new Date(),
                    text: 'Hello, World!',
                    user: {
                        _id: state.userID,
                        name: state.userName,
                        avatar: state.avatarURL
                    },
                }
                entityRef.doc(`${roomName}`).collection('messages')
                    .doc().set(data)
                    .then((doc) => {
                        Keyboard.dismiss()
                    })
                    .catch((error) => {
                        alert(error)
                    })
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })
        props.navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container} >
                <AddRoomCom
                    users={users}
                    addRoom={addRoom}
                />
            </View >
        </SafeAreaView>
    );
}

export default AddRoomScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#000"
    },
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
    },
    containerStyleListHorizontal: {
        height: moderateScale(160),
    },
    itemStyleListHorizontal: {
        width: moderateScale(160)
    },
    containerStyleListVertical: {
        height: moderateScale(520),
    },
    itemStyleListVertical: {
        height: moderateScale(260),
        width: calcWidth(45)
    }
});