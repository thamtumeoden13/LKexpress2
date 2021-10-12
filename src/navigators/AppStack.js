import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Keyboard, Alert } from 'react-native'

import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerIcon from 'components/common/icon/DrawerIcon'
import BackIcon from 'components/common/icon/BackIcon'
import BagIcon from 'components/common/icon/BagIcon'
import HeaderTitle from 'components/common/Header/HeaderTitle'
import DrawerContentComponents from './DrawerContentComponents'

import HomeTabs from './BottomTabStack'

import {
    VideoCallScreen, VideoJoinScreen,
    ChatDetailScreen, RoomChatScreen, AddRoomScreen,
    CategoryDetailScreen, AddCategoryScreen, ShoppingCartScreen,
    DiaryDetailScreen, AddDiaryScreen, UpdateProfileScreen
} from '../screens'


const Stack = createNativeStackNavigator();

const MainStack = () => {
    const navigation = useNavigation();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerBackTitle: null,
                headerBackTitleVisible: false,
                headerBackVisible: false,
            }}
        >
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ title: 'Phòng chat', }} />
            <Stack.Screen name="VideoCall" component={VideoCallScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                    // headerBackTitleVisible: false,
                    // headerBackVisible: false,
                    headerShown: true,
                }}
            />
            <Stack.Screen name="VideoJoin" component={VideoJoinScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                    // headerBackTitleVisible: false,
                    // headerBackVisible: false,
                    headerShown: true,
                }}
            />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                    // headerBackTitleVisible: false,
                    // headerBackVisible: false,
                    headerShown: true,
                }}
            />
            <Stack.Screen name="RoomChatDetail" component={RoomChatScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                    headerShown: true
                }}
            />
            <Stack.Screen name="AddRoom" component={AddRoomScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                    headerShown: true
                }}
            />
            <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Danh Mục`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                    headerShown: true
                }}
            />
            <Stack.Screen name="AddCategory" component={AddCategoryScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Thêm Danh Mục`} />,
                    headerShown: true
                }}
            />
            <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Giỏ Hàng`} />,
                    headerShown: true
                }}
            />
            <Stack.Screen name="DiaryDetail" component={DiaryDetailScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Bình luận`} />,
                    headerShown: true
                }}
            />
            <Stack.Screen name="AddDiary" component={AddDiaryScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Thêm nhật ký`} />,
                    headerShown: true
                }}
            />
            <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Cập nhật thông tin`} />,
                    headerShown: true
                }}
            />
        </Stack.Navigator>
    );
}

export default MainStack;
