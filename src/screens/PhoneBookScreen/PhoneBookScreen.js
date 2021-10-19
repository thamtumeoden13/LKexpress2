import React, { useEffect, useState, useCallback, useRef, forwardRef, createRef } from 'react'
import {
    FlatList, Keyboard, SafeAreaView, StyleSheet,
    Image, TouchableOpacity, View, Dimensions, Text,
    Animated, findNodeHandle
} from 'react-native'
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import faker from 'faker'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import HeaderSearchInput from 'components/common/Header/SearchInput'
import BagIcon from 'components/common/icon/BagIcon'
import FlatListAnimation from 'components/common/listCommon/FlatListAnimation'

import styles from './styles';

faker.seed(10)

const DATA = [...Array(30).keys()].map((_, i) => {
    return {
        key: faker.datatype.uuid(),
        image: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.datatype.number(60)}.jpg`,
        name: faker.name.findName(),
        jobTitle: faker.name.jobTitle(),
        email: faker.internet.email()
    };
})

const images = {
    user: 'https://images.pexels.com/photos/2578370/pexels-photo-2578370.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    customer: 'https://images.pexels.com/photos/3973557/pexels-photo-3973557.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
}

const db = firestore()
const entityChatRef = db.collection('chats')
const entityUserRef = db.collection('users')

const PhoneBook = (props) => {
    const ref = useRef()

    const [state, setState] = useState({
        userID: '',
        connectID: '',
        userName: '',
        avatarURL: '',
        user: {},
        page: 0,
        isDataFetchedUserList: false,
    })
    const [users, setUsers] = useState([])
    const [usersFilter, setUsersFilter] = useState([])
    const [usersCustomer, setUsersCustomer] = useState([])
    const [usersFilterCustomer, setUsersFilterCustomer] = useState([])

    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.fullName,
                    avatarURL: user.avatarURL,
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
            const queryUserList = entityUserRef.where("id", "!=", state.userID)
            const unsubscribeUserList = queryUserList.onSnapshot(getRealtimeCollectionUserList, err => Alert.alert(error))
            return () => {
                unsubscribeUserList()
            }
        }
    }, [state.userID])

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: () =>
                <HeaderSearchInput
                    placeholder={'Tìm bạn bè, Số điện thoại'}
                    handerSearchInput={(value) => onHanderSearchInput(value)}
                />,
            headerRight: () => <BagIcon />,
        });
    }, [props.navigation, users])

    const onHanderSearchInput = (searchInput) => {
        if (searchInput) {
            const newData = users.filter((item) => {
                const textData = searchInput.toUpperCase()
                const itemData = `${item.fullName.toUpperCase()},${item.email.toUpperCase()},${item.phoneNumber.toUpperCase()}`
                return itemData.indexOf(textData) > -1
            })
            const newDataCustomer = usersCustomer.filter((item) => {
                const textData = searchInput.toUpperCase()
                const itemData = `${item.fullName.toUpperCase()},${item.email.toUpperCase()},${item.phoneNumber.toUpperCase()}`
                return itemData.indexOf(textData) > -1
            })
            setUsersFilter(newData)
            setUsersFilterCustomer(newDataCustomer)
        } else {
            setUsersFilter(users)
            setUsersFilterCustomer(usersCustomer)
        }
    }

    const checkExistsCollection = async (document, documentRevert) => {
        const isExistsCollection = await entityChatRef.doc(document).collection('messages').get()
        const isExistsCollectionRevert = await entityChatRef.doc(documentRevert).collection('messages').get()
        if (isExistsCollection.docs.length > 0) return document
        if (isExistsCollectionRevert.docs.length > 0) return documentRevert
        return ''
    }

    const getRealtimeCollectionUserList = async (querySnapshot) => {
        let users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            const phoneNumber = !!user.phoneNumber
                ? `${user.phoneNumber.substr(0, 3)} ${user.phoneNumber.substr(3, 3)} ${user.phoneNumber.substr(6)}`
                : ''
            return {
                ...user,
                doc: doc.id,
                name: user.fullName,
                jobTitle: phoneNumber,
                email: user.email,
                image: user.avatarURL
            }
        })
        const filterUsers = users.filter(e => e.userType == 1)
        const filterCustomers = users.filter(e => e.userType == 2)

        setUsers(filterUsers)
        setUsersFilter(filterUsers)
        setUsersCustomer(filterCustomers)
        setUsersFilterCustomer(filterCustomers)
        setState(prev => { return { ...prev, isDataFetchedUserList: true } })
    }

    const onHandlerConnectRoom = async (userConnect) => {
        let document = `${userConnect.id}|${state.userID}`
        let documentRevert = `${state.userID}|${userConnect.id}`
        const existsCollection = await checkExistsCollection(document, documentRevert)
        if (!!existsCollection) {
            const pushAction = StackActions.push('ChatDetail', { id: existsCollection })
            props.navigation.dispatch(pushAction)
            return
        }
        onCreateNewConnect(state.user, userConnect)
    }
    const onCreateNewConnect = (user, userConnect) => {
        const _id = 1
        const currentValue = {
            currentID: user.id,
            currentUser: user.email,
            currentAvatar: user.avatarURL,
            currentMessage: 'Hello, World!',
            currentMessageID: _id,
            currentCreatedAt: new Date()
        }
        const document = `${user.id}|${userConnect.id}`
        entityChatRef.doc(document).set(currentValue)
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })

        entityChatRef.doc(document).collection('users')
            .doc().set(user)
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
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

        entityChatRef.doc(document).collection('messages')
            .doc().set(data)
            .then((doc) => {
                Keyboard.dismiss()
                props.navigation.navigate(`ChatDetail`, { id: document })
            })
            .catch((error) => {
                alert(error)
            })
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItemUser = ({ item }) => (
        <ListItem
            Component={TouchableScale}
            friction={90} //
            tension={100} // These props are passed to the parent component (here TouchableScale)
            activeScale={0.95} //
            linearGradientProps={{
                colors: ['#fff', '#fff'],
                start: { x: 1, y: 0 },
                end: { x: 0.2, y: 0 },
            }}
            ViewComponent={LinearGradient} // Only if no expo
            style={{
                borderTopColor: '#6a6a6a', borderTopWidth: 0.2,
            }}
            containerStyle={{ paddingVertical: verticalScale(10) }}
            onPress={() => onHandlerConnectRoom(item)}
        >
            <Avatar rounded source={{ uri: item.avatarURL }} />
            <ListItem.Content>
                <ListItem.Title style={{ color: '#0a043c', fontWeight: '300', fontSize: scale(16), lineHeight: scale(22) }}>
                    {item.email}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(12), lineHeight: scale(16) }}>
                    {`${item.fullName}`}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron name="addusergroup" type='antdesign' color="#0a043c" />
        </ListItem>
    )

    const tabs = Object.keys(images).map((key) => ({
        key: key,
        title: key == 'user' ? 'Danh Bạ' : 'Đối tác / CTV',
        image: images[key],
        ref: createRef()
    }))
    const { width, height } = Dimensions.get('screen')
    const scrollX = useRef(new Animated.Value(0)).current

    const Indicator = ({ measures, scrollX }) => {
        console.log(measures)
        const inputRange = tabs.map((_, index) => index * width)
        const indicatorWidth = scrollX.interpolate({
            inputRange,
            outputRange: measures.map(measure => measure.width)
        })
        const translateX = scrollX.interpolate({
            inputRange,
            outputRange: measures.map(measure => measure.x)
        })
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    height: 2,
                    width: indicatorWidth,
                    left: 0,
                    backgroundColor: '#000',
                    bottom: 5,
                    transform: [{ translateX }]
                }}
            />
        )
    }

    const Tab = forwardRef(({ item, fontSize, onItemPress }, ref) => {
        return (
            <TouchableOpacity onPress={onItemPress}>
                <View ref={ref} style={{ justifyContent: 'center', height: 48 }}>
                    <Text style={{ color: '#000', fontSize, textTransform: 'uppercase' }}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    })

    const Tabs = ({ data, scrollX, onItemPress }) => {
        const containerRef = useRef()
        const [measures, setMeasures] = useState([])
        useEffect(() => {
            let m = []
            data.forEach(item => {
                item.ref.current.measureLayout(containerRef.current,
                    (x, y, width, height) => {
                        m.push({
                            x, y, width, height
                        })

                        if (m.length === data.length) {
                            setMeasures(m)
                        }
                    }
                )
            })
        }, [])

        return (
            <View style={{ position: 'absolute', width, height: 48 }}>
                <View ref={containerRef} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', }}>
                    {data.map((item, index) => {
                        return (
                            <Tab key={item.key} item={item} fontSize={30 / data.length} ref={item.ref} onItemPress={() => onItemPress(index)} />
                        )
                    })}
                </View>
                {!!measures && measures.length > 0 && <Indicator measures={measures} scrollX={scrollX} />}
            </View>
        )
    }

    const onItemPress = useCallback(itemIndex => {
        ref?.current?.scrollToOffset({
            offset: itemIndex * width
        })
    })

    return (
        <View style={{ flex: 1, backgroundColor: 'rgb(250,222,249)' }} >
            <FlatList
                ref={ref}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={({ key }) => key.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                contentContainerStyle={{ marginTop: 48 }}
                data={tabs}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ width, height }}>
                            {!!state.isDataFetchedUserList ?
                                <>
                                    {item.key == 'user' && !!usersFilter && usersFilter.length > 0 &&
                                        <FlatListAnimation result={usersFilter} onHandlerConnectRoom={onHandlerConnectRoom} />
                                    }
                                    {item.key == 'customer' && !!usersFilterCustomer && usersFilterCustomer.length > 0 &&
                                        <FlatListAnimation result={usersFilterCustomer} onHandlerConnectRoom={onHandlerConnectRoom} />
                                    }
                                </>
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <LottieView
                                        source={require('@assets/animations/890-loading-animation.json')}
                                        colorFilters={[{
                                            keypath: "button",
                                            color: "#F00000"
                                        }, {
                                            keypath: "Sending Loader",
                                            color: "#F00000"
                                        }]}
                                        style={{ width: calcWidth(30), height: calcWidth(30), justifyContent: 'center' }}
                                        autoPlay
                                        loop
                                    />
                                </View>
                            }
                        </View>
                    )
                }}
            />
            <Tabs data={tabs} scrollX={scrollX} onItemPress={onItemPress} />

            {/* } */}
            {/* {!!state.isDataFetchedUserList ?
                <>
                    {!!usersFilter && usersFilter.length > 0 &&
                        // <FlatList
                        //     keyExtractor={keyExtractor}
                        //     data={usersFilter}
                        //     extraData={usersFilter}
                        //     renderItem={renderItemUser}
                        // />
                        <FlatListAnimation result={usersFilter} />
                    }
                </>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        source={require('@assets/animations/890-loading-animation.json')}
                        colorFilters={[{
                            keypath: "button",
                            color: "#F00000"
                        }, {
                            keypath: "Sending Loader",
                            color: "#F00000"
                        }]}
                        style={{ width: calcWidth(30), height: calcWidth(30), justifyContent: 'center' }}
                        autoPlay
                        loop
                    />
                </View>
            } */}
        </View>
    )
}

export default PhoneBook