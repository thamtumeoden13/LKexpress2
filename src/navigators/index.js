import React, { useContext, useReducer, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Keyboard, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';

import {
    LoginScreen, RegistrationScreen, AuthLoadingScreen,
    HomeScreen, ChatScreen, ChatDetailScreen, 
    RoomScreen, RoomChatScreen,AddRoomScreen,
    PhoneBookScreen, ProfileScreen, UpdateProfileScreen,
    CategoryScreen, CategoryDetailScreen, AddCategoryScreen, ShoppingCartScreen,
    DiaryScreen, DiaryDetailScreen, AddDiaryScreen
} from '../screens'

import DrawerIcon from 'components/common/icon/DrawerIcon'
import BackIcon from 'components/common/icon/BackIcon'
import BagIcon from 'components/common/icon/BagIcon'
import HeaderTitle from 'components/common/Header/HeaderTitle'
import DrawerContentComponents from './DrawerContentComponents'

import { AuthContext } from '../utils'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';

const StackAuth = createStackNavigator();

function AuthStack() {
    return (
        <StackAuth.Navigator initialRouteName={"Login"}>
            <StackAuth.Screen name="Login" component={LoginScreen} />
            <StackAuth.Screen name="Registration" component={RegistrationScreen} />
        </StackAuth.Navigator>
    )
}

const HomeStack = createStackNavigator();

function HomeStackScreen({ navigation }) {
    return (
        <HomeStack.Navigator initialRouteName="HomeDrawer">
            <HomeStack.Screen
                name="HomeDrawer"
                component={HomeScreen}
                options={{
                    headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Trang chủ`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            {/* <HomeStack.Screen name="HomeDetail" component={ChatScreen} /> */}
        </HomeStack.Navigator>
    );
}

const ChatStack = createStackNavigator();
function ChatStackScreen({ navigation }) {
    return (
        <ChatStack.Navigator initialRouteName="Chat">
            <ChatStack.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Tin nhắn`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <ChatStack.Screen
                name="ChatDetail"
                component={ChatDetailScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <ChatStack.Screen
                name="RoomChatDetail"
                component={RoomChatScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
        </ChatStack.Navigator>
    );
}

const RoomChatStack = createStackNavigator();
function RoomChatStackScreen({ navigation }) {
    return (
        <RoomChatStack.Navigator initialRouteName="RoomChat">
            <RoomChatStack.Screen
                name="RoomChat"
                component={RoomScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Phòng chat`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <RoomChatStack.Screen
                name="RoomChatDetail"
                component={RoomChatScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <RoomChatStack.Screen
                name="AddRoom"
                component={AddRoomScreen}
                // options={{
                //     headerLeft: () => <BackIcon navigation={navigation} />,
                //     // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                //     headerRight: () => <BagIcon navigation={navigation} />,
                // }}
            />
        </RoomChatStack.Navigator>
    );
}

const PhoneBookStack = createStackNavigator();
function PhoneBookStackScreen({ navigation }) {
    return (
        <PhoneBookStack.Navigator initialRouteName="PhoneBook">
            <PhoneBookStack.Screen
                name="PhoneBook"
                component={PhoneBookScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Danh bạ`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <PhoneBookStack.Screen
                name="ChatDetail"
                component={ChatDetailScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
        </PhoneBookStack.Navigator>
    );
}

const CategoryStack = createStackNavigator();
function CategoryStackScreen({ navigation }) {
    return (
        <CategoryStack.Navigator initialRouteName="Category">
            <CategoryStack.Screen
                name="Category"
                component={CategoryScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Danh Mục`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <CategoryStack.Screen
                name="CategoryDetail"
                component={CategoryDetailScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Chi tiết`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <CategoryStack.Screen
                name="AddCategory"
                component={AddCategoryScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Thêm Danh Mục`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <CategoryStack.Screen
                name="ShoppingCart"
                component={ShoppingCartScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Giỏ Hàng`} />,
                }}
            />
        </CategoryStack.Navigator>
    );
}

const DiaryStack = createStackNavigator();
function DiaryStackScreen({ navigation }) {
    return (
        <DiaryStack.Navigator initialRouteName="Diary">
            <DiaryStack.Screen
                name="Diary"
                component={DiaryScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Nhật ký`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <DiaryStack.Screen
                name="DiaryDetail"
                component={DiaryDetailScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Bình luận`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <DiaryStack.Screen
                name="AddDiary"
                component={AddDiaryScreen}
                options={{
                    headerTitle: () => <HeaderTitle title={`Thêm nhật ký`} />,
                }}
            />
        </DiaryStack.Navigator>
    );
}

const ProfileStack = createStackNavigator();
function ProfileStackScreen({ navigation }) {
    return (
        <ProfileStack.Navigator initialRouteName="Profile">
            <ProfileStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Cá nhân`} />,
                }}
            />
            <ProfileStack.Screen
                name="UpdateProfile" component={UpdateProfileScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Cập nhật thông tin`} />,
                }}
            />
        </ProfileStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
function TabStack() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
            initialRouteName='Home'
        >
            {/* <Tab.Screen name="Home" component={HomeStackScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialCommunityIcons name="home" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/home.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay
                                loop
                            />
                        </View>
                    )
                }}
            /> */}
            <Tab.Screen name="Chat" component={ChatStackScreen}
                options={{
                    tabBarLabel: 'Tin nhắn',
                    tabBarIcon: ({ color, size }) => (
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
                                autoPlay
                                loop
                            />
                        </View>
                    ),
                    // tabBarBadge: 3,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' }
                }}
            />
            <Tab.Screen name="RoomChat" component={RoomChatStackScreen}
                options={{
                    tabBarLabel: 'Nhóm',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialCommunityIcons name="battlenet" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/group-chat.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(28), height: scale(28), justifyContent: 'center' }}
                                autoPlay
                                loop
                            />
                        </View>
                    ),
                    // tabBarBadge: 3,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' }
                }}
            />
            <Tab.Screen name="PhoneBook" component={PhoneBookStackScreen}
                options={{
                    tabBarLabel: 'Danh bạ',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialCommunityIcons name="battlenet" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/phone-book.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay
                                loop
                            />
                        </View>
                    ),
                    // tabBarBadge: 3,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' }
                }}
            />
            <Tab.Screen name="Category" component={CategoryStackScreen}
                options={{
                    tabBarLabel: 'Danh mục',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialCommunityIcons name="cart-outline" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/products.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay
                                loop
                            />
                        </View>
                    ),
                    // tabBarBadge: 5,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' }
                }}
            />
            <Tab.Screen name="Diary" component={DiaryStackScreen}
                options={{
                    tabBarLabel: 'Nhật ký',
                    tabBarIcon: ({ color, size }) => (
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
                                autoPlay
                                loop
                            />
                        </View>
                    ),
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' }
                }}
            />
            <Tab.Screen name="Profile" component={ProfileStackScreen}
                options={{
                    tabBarLabel: 'Cá nhân',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialCommunityIcons name="account-settings-outline" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/profile.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay
                                loop
                            />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

// const Drawer = createDrawerNavigator();
const Drawer = createStackNavigator();

export default () => {
    const { appContext } = useContext(AuthContext);
    return (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{ headerShown: false }}
                drawerContent={props => <DrawerContentComponents {...props} />}
            >
                {!appContext || appContext.userToken == null ? (
                    // <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
                    <Drawer.Screen name="Login" component={AuthStack} />
                ) : (
                    <>
                        <Drawer.Screen name="Home" component={TabStack} />
                        <Drawer.Screen name="RoomChat" component={RoomChatScreen} />
                        <Drawer.Screen name="Chat" component={ChatScreen} />
                    </>
                )}
            </Drawer.Navigator>
        </NavigationContainer >
    )
}