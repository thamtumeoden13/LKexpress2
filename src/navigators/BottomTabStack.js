import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Keyboard, Alert } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

import DrawerIcon from 'components/common/icon/DrawerIcon'
import BackIcon from 'components/common/icon/BackIcon'
import BagIcon from 'components/common/icon/BagIcon'
import HeaderTitle from 'components/common/Header/HeaderTitle'
import DrawerContentComponents from './DrawerContentComponents'

import { AuthContext } from '../utils'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';


import {
    ChatScreen,
    RoomScreen,
    PhoneBookScreen, ProfileScreen,
    CategoryScreen,
    DiaryScreen,
    VideoRoomScreen,
    CategoryScreen2,
} from '../screens'

import Page from 'screens/Page';

const Tab = createBottomTabNavigator();

const MainStack = () => {

    const navigation = useNavigation()

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                tabBarInactiveTintColor: '#6a6a6a',
                // headerStyle: { backgroundColor: '#e91e63', },
                // tabBarShowLabel: false,
                // tabBarLabelPosition: 'beside-icon'
            }}
        >
            {/* <Tab.Screen name="Home" component={Page}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        // <MaterialCommunityIcons name="home" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/home-boiler-care.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(20), height: scale(20), justifyContent: 'center' }}
                                autoPlay={focused}
                                loop
                            />
                        </View>
                    )
                }}
            /> */}
            <Tab.Screen name="Chat" component={ChatScreen}
                options={{
                    tabBarLabel: 'Tin nhắn',
                    tabBarIcon: ({ color, size, focused }) => (
                        // <MaterialCommunityIcons name="battlenet" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/chat.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay={focused}
                                loop
                            />
                        </View>
                    ),
                    // tabBarBadge: 3,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' },
                    // headerLeft: () => <BackIcon navigation={navigation} />,
                }}
            />
            <Tab.Screen name="RoomChat" component={RoomScreen}
                options={{
                    tabBarLabel: 'Nhóm',
                    tabBarIcon: ({ color, size, focused }) => (
                        // <MaterialCommunityIcons name="battlenet" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/video-conference-icon.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(28), height: scale(28), justifyContent: 'center' }}
                                autoPlay={focused}
                                loop
                            />
                        </View>
                    ),
                    // tabBarBadge: 3,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' }
                }}
            />
            <Tab.Screen name="PhoneBook" component={PhoneBookScreen}
                options={{
                    tabBarLabel: 'Danh bạ',
                    tabBarIcon: ({ color, size, focused }) => (
                        // <MaterialCommunityIcons name="battlenet" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/meta.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay={focused}
                                loop
                            />
                        </View>
                    ),
                    // tabBarBadge: 3,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' }
                }}
            />
            <Tab.Screen name="Category" component={CategoryScreen2}
                options={{
                    tabBarLabel: 'Danh mục',
                    tabBarIcon: ({ color, size, focused }) => (
                        // <MaterialCommunityIcons name="cart-outline" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/shopping-cart.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay={focused}
                                loop
                            />
                        </View>
                    ),
                    // tabBarBadge: 5,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' },
                    headerTitle: () => <HeaderTitle title={`Danh Mục Sản Phẩm`} />,
                }}
            />
            <Tab.Screen name="Diary" component={DiaryScreen}
                options={{
                    tabBarLabel: 'Nhật ký',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/effective-timeline.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(26), height: scale(26), justifyContent: 'center' }}
                                autoPlay={focused}
                                loop
                            />
                        </View>
                    ),
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' },
                    headerTitle: () => <HeaderTitle title={`Nhật Ký`} />,
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarLabel: 'Cá nhân',
                    tabBarIcon: ({ color, size, focused }) => (
                        // <MaterialCommunityIcons name="account-settings-outline" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/profile-loader-setting.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(20), height: scale(20), justifyContent: 'center' }}
                                autoPlay={focused}
                                loop
                            />
                        </View>
                    ),
                    headerTitle: () => <HeaderTitle title={`Thông Tin Cá Nhân`} />,
                }}
            />
        </Tab.Navigator>
    )
}

export default MainStack;
