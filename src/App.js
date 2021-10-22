import 'react-native-gesture-handler';
import React, { useEffect, useState, useReducer, useRef, useMemo } from 'react'
import { Alert, YellowBox, LogBox, AppState, Platform, Keyboard, View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { decode, encode } from 'base-64'
import CodePush from "react-native-code-push";
import { PERMISSIONS, request, openSettings, checkNotifications } from 'react-native-permissions';
import RNExitApp from 'react-native-exit-app';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

import AppContainer from './navigators/index'

import { ModalCenterAlert } from "./components/common/modal/ModalCenterAlert";
import OpenSetting from './components/app/modalInputForm/OpenSetting';

import { AuthContext } from './utils'
import { moderateScale, verticalScale, scale, calcHeight, calcWidth } from 'utils/scaleSize';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

LogBox.ignoreLogs(['VirtualizedLists', 'Warning:...'])
LogBox.ignoreAllLogs(true)
console.error = (error) => error.apply

const toastConfig = {
    success_custom: (internalState) => (
        <View style={{
            flexDirection: 'row',
            width: calcWidth('90%'), maxHeight: verticalScale(120),
            backgroundColor: '#fff',
            padding: moderateScale(10),
            borderLeftWidth: scale(10),
            borderTopWidth: scale(1),
            borderRightWidth: scale(1),
            borderBottomWidth: scale(1),
            borderColor: 'limegreen',
            borderTopLeftRadius: scale(10),
            borderBottomLeftRadius: scale(10),
        }}>
            <Icon name='checkcircleo' type='antdesign' color='limegreen' size={scale(12)}
                containerStyle={{
                    justifyContent: 'center',
                    marginRight: moderateScale(10)
                }}

                activeOpacity={0.7}
            />
            <View style={{ paddingHorizontal: moderateScale(10) }}>
                <Text style={{ color: '#000', fontSize: scale(14), fontWeight: 'bold' }} numberOfLines={1}>{internalState.text1}</Text>
                <Text style={{ color: '#000', fontSize: scale(12) }} numberOfLines={4}>{internalState.text2}</Text>
            </View>
        </View>
    ),
    info_custom: (internalState) => (
        <View style={{
            flexDirection: 'row',
            width: calcWidth('90%'), maxHeight: verticalScale(120),
            backgroundColor: '#fff',
            padding: moderateScale(10),
            borderLeftWidth: scale(10),
            borderTopWidth: scale(1),
            borderRightWidth: scale(1),
            borderBottomWidth: scale(1),
            borderColor: 'dodgerblue',
            borderTopLeftRadius: scale(10),
            borderBottomLeftRadius: scale(10),
        }}>
            <Icon name='infocirlceo' type='antdesign' color='dodgerblue' size={scale(12)}
                containerStyle={{
                    justifyContent: 'center',
                    marginRight: moderateScale(10)
                }}

                activeOpacity={0.7}
            />
            <View style={{ paddingHorizontal: moderateScale(10) }}>
                <Text style={{ color: '#000', fontSize: scale(14), fontWeight: 'bold' }} numberOfLines={1}>{internalState.text1}</Text>
                <Text style={{ color: '#000', fontSize: scale(12) }} numberOfLines={4}>{internalState.text2}</Text>
            </View>
        </View>
    ),
    error_custom: (internalState) => (
        <View style={{
            flexDirection: 'row',
            width: calcWidth('90%'), maxHeight: verticalScale(120),
            backgroundColor: '#fff',
            padding: moderateScale(10),
            borderLeftWidth: scale(10),
            borderTopWidth: scale(1),
            borderRightWidth: scale(1),
            borderBottomWidth: scale(1),
            borderColor: 'crimson',
            borderTopLeftRadius: scale(10),
            borderBottomLeftRadius: scale(10),
        }}>
            <Icon name='closecircleo' type='antdesign' color='crimson' size={scale(12)}
                containerStyle={{
                    justifyContent: 'center',
                    marginRight: moderateScale(10)
                }}

                activeOpacity={0.7}
            />
            <View style={{ paddingHorizontal: moderateScale(10) }}>
                <Text style={{ color: '#000', fontSize: scale(14), fontWeight: 'bold' }} numberOfLines={1}>{internalState.text1}</Text>
                <Text style={{ color: '#000', fontSize: scale(12) }} numberOfLines={4}>{internalState.text2}</Text>
            </View>
        </View>
    ),
};
const entityUserRef = firestore().collection('users')

const App = (props) => {

    const appState = useRef(AppState.currentState);

    const [alert, setAlert] = useState({
        isVisible: false,
        disabledIcon: false,
        modalAlert: {
            type: 'error',
            title: '',
            content: '',
        },
        typeModalInputForm: -1
    })

    const [state, setState] = useState({
        locationPermissionDenied: false,
        notificationPermissionDenied: false,
    })

    const DATA = [
        {
            price: 200000,
            quantity: 1,
            title: 'Headphone',
            thumbnail: 'https://images.pexels.com/photos/2578370/pexels-photo-2578370.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
        },
        {
            price: 300000,
            quantity: 1,
            title: 'SmartPhone 1',
            thumbnail: 'https://images.pexels.com/photos/3973557/pexels-photo-3973557.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
        },
        {
            price: 250000,
            quantity: 3,
            title: 'SmartPhone 2',
            thumbnail: 'https://images.pexels.com/photos/3493731/pexels-photo-3493731.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
        },
        {
            price: 400000,
            quantity: 1,
            title: 'SmartPhone 3',
            thumbnail: 'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
        },
    ]

    const [stateContext, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isLoading: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isLoading: false,
                        userToken: null,
                    };
                case 'LOADING':
                    return {
                        ...prevState,
                        isLoading: !!action.isLoading,
                    };
                case 'ADD_SHOPPING_CART':
                    return {
                        ...prevState,
                        shoppingCartList: [...prevState.shoppingCartList, action.shoppingCartItem],
                    };
                case 'UPDATE_SHOPPING_CART':
                    return {
                        ...prevState,
                        shoppingCartList: action.shoppingCartList,
                    };
                case 'REMOVE_SHOPPING_CART':
                    const filter = prevState.shoppingCartList.filter((e, i) => i != action.index)

                    return {
                        ...prevState,
                        shoppingCartList: filter,
                    }
                case 'SHOW_TOAST':
                    const { title, body, duration } = action.result
                    return {
                        ...prevState,
                        isVisibleToast: true,
                        toastResult: { title, body, duration }
                    }
                case 'HIDE_TOAST':
                    return {
                        ...prevState,
                        isVisibleToast: false,
                        toastResult: {}
                    }
            }
        },
        {
            isLoading: false,
            userToken: null,
            isVisibleToast: false,
            toastResult: {},
            shoppingCartList: DATA
        }
    )

    const authContext = useMemo(() => ({
        signIn: async ({ email, password }) => {
            console.log('email, password', email, password)
            dispatch({ type: 'LOADING', isLoading: true })
            auth()
                .signInWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid
                    const usersRef = firestore().collection('users')
                    usersRef
                        .doc(uid)
                        .get()
                        .then(firestoreDocument => {
                            if (!firestoreDocument.exists) {
                                Alert.alert("User does not exist anymore.")
                                return;
                            }
                            const user = firestoreDocument.data()
                            AsyncStorage.setItem('User', JSON.stringify(user))
                            dispatch({ type: 'SIGN_IN', token: JSON.stringify(user) });
                            dispatch({ type: 'LOADING', isLoading: false })
                        })
                        .catch(error => {
                            dispatch({ type: 'LOADING', isLoading: false })
                            Alert.alert(JSON.stringify(error))
                        });
                })
                .catch(error => {
                    dispatch({ type: 'LOADING', isLoading: false })
                    Alert.alert(JSON.stringify(error))
                })
        },
        signInWithPhone: async (data) => {
            // dispatch({ type: 'LOADING', isLoading: true })
            console.log('data', data)
            await AsyncStorage.setItem('User', JSON.stringify(data))
            dispatch({ type: 'SIGN_IN', token: JSON.stringify(data) });
            dispatch({ type: 'LOADING', isLoading: false })
        },
        signOut: () => {
            dispatch({ type: 'SIGN_OUT' })
            AsyncStorage.removeItem('User')
        },
        signUp: async (result) => {
            dispatch({ type: 'LOADING', isLoading: true })

            const { email, password, fullName, avatarURL, avatarBase64, phoneNumber, address } = result
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid
                    const data = {
                        id: uid,
                        email,
                        fullName,
                        avatarURL,
                        avatarBase64,
                        phoneNumber,
                        address,
                        level: 2
                    };
                    const usersRef = firestore().collection('users')
                    usersRef
                        .doc(uid)
                        .set(data)
                        .then(async () => {
                            // const user = firestoreDocument.data()
                            await AsyncStorage.setItem('User', JSON.stringify(data))
                            dispatch({ type: 'SIGN_IN', token: JSON.stringify(data) });
                        })
                        .catch((error) => {
                            Alert.alert(JSON.stringify(error))
                        });
                })
                .catch((error) => {
                    dispatch({ type: 'LOADING', isLoading: false })
                    Alert.alert(JSON.stringify(error))
                });
        },
        addShoppingCart: async (item) => {
            dispatch({ type: 'ADD_SHOPPING_CART', shoppingCartItem: item })
            const message = {
                title: 'Thêm vào giỏ hàng',
                body: 'Thành công',
                duration: 1000
            }
            dispatch({ type: 'SHOW_TOAST', result: message })
        },
        updateShoppingCart: async (result) => {
            dispatch({ type: 'UPDATE_SHOPPING_CART', shoppingCartList: result })
            const message = {
                title: 'Cập nhật giỏ hàng',
                body: 'Thành công',
                duration: 2000
            }
            dispatch({ type: 'SHOW_TOAST', result: message })
        },
        removeShoppingCart: async (index) => {
            dispatch({ type: 'REMOVE_SHOPPING_CART', index: index })
            const message = {
                title: 'Cập nhật giỏ hàng',
                body: 'Thành công',
                duration: 2000
            }
            dispatch({ type: 'SHOW_TOAST', result: message })
        },
        showToast: async (message) => {
            dispatch({ type: 'SHOW_TOAST', result: !!message ? message : {} })
        },
        hideToast: async () => {
            dispatch({ type: 'HIDE_TOAST' })
        },
        appContext: stateContext
    }), [stateContext])

    useEffect(() => {
        const appStateChange = AppState.addEventListener('change', _handleAppStateChange)
        const appLocationState = AppState.addEventListener('change', checkMultiPermission)
        const bootstrapAsync = async () => {
            let userToken;
            try {
                userToken = await AsyncStorage.getItem('User');
                if (!!userToken) {
                    dispatch({ type: 'RESTORE_TOKEN', token: JSON.stringify(userToken) });
                }
            } catch (e) {
                // Restoring token failed
            }
        };
        bootstrapAsync();
        getAppVersion();
        return () => {
            appStateChange;
            appLocationState;
            unsubscribe;
        };
    }, [])

    useEffect(() => {
        if (!!state.locationPermissionDenied || !!state.notificationPermissionDenied) {
            preOpenSettingPermission()
        }
    }, [state.locationPermissionDenied, state.notificationPermissionDenied])

    useEffect(() => {
        if (!!stateContext.isVisibleToast) {
            const { title, body, duration } = stateContext.toastResult
            onHandlerToast(true, 'success_custom', title, body, duration)
        } else {
            onHandlerToast(false)
        }
    }, [stateContext.isVisibleToast, stateContext.toastResult])

    const _handleAppStateChange = (nextAppState) => {
        console.log("AppState", appState.current, nextAppState);

        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
            console.log("App has come to the foreground!");
            requestLocationPermission()
            requestPermission()
        }
        appState.current = nextAppState;
    };

    const requestPermission = async () => {
        try {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
                getToken();
            }
        } catch (error) {
            console.log('permission rejected');
        }
    }

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (response !== 'granted') {
                preOpenSettingPermission()
            }
            else {
                onCloseModalAlert()
            }
        }
        else {
            const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (response !== 'granted') {
                preOpenSettingPermission()
            }
            else {
                onCloseModalAlert()
            }
        }
    }

    const checkMultiPermission = async () => {
        if (Platform.OS === 'ios') {
            const response1 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            const response2 = await checkNotifications();
            const response3 = await request(PERMISSIONS.IOS.CAMERA);
            if (response1 !== 'granted' || response2.status !== 'granted' || response3 !== 'granted') {
                setState(prev => {
                    return {
                        ...prev,
                        locationPermissionDenied: response1 !== 'granted' ? true : false,
                        notificationPermissionDenied: response2.status !== 'granted' ? true : false,
                        cameraPermissionDenied: response3 !== 'granted' ? true : false,
                    }
                })
                preOpenSettingPermission()
            }
        }
        else {
            const response1 = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            const response2 = await checkNotifications();
            const response3 = await request(PERMISSIONS.ANDROID.CAMERA);
            if (response1 !== 'granted' || response2.status !== 'granted' || response3 !== 'granted') {
                setState(prev => {
                    return {
                        ...prev,
                        locationPermissionDenied: response1 !== 'granted' ? true : false,
                        notificationPermissionDenied: response2.status !== 'granted' ? true : false,
                        cameraPermissionDenied: response3 !== 'granted' ? true : false,
                    }
                })
                preOpenSettingPermission()
            }
        }
    }

    const preOpenSettingPermission = () => {
        setAlert(prev => {
            return {
                ...prev,
                isVisible: true,
                modalAlert: { type: 'warning' },
                typeModalInputForm: 1,
                disabledIcon: true
            }
        })
    }

    const openSettingPermission = (status) => {
        setTimeout(() => {
            if (!!status) {
                openSettings()
            }
            else {
                RNExitApp.exitApp();
            }
        }, 500);
    }

    const renderModalInputForm = (typeModalInputForm) => {
        let ModalInputForm
        switch (typeModalInputForm) {
            case 1:
                ModalInputForm = (
                    <OpenSetting
                        openSetting={openSettingPermission}
                        locationPermissionDenied={state.locationPermissionDenied}
                        notificationPermissionDenied={state.notificationPermissionDenied}
                    />
                )
                break;
            default:
                ModalInputForm = null
                break;
        }
        return ModalInputForm
    }

    const onCloseModalAlert = () => {
        setAlert(prev => {
            return {
                ...prev,
                isVisible: false,
                modalAlert: {
                    type: 'error',
                    content: ''
                },
                typeModalInputForm: -1
            }
        })
    }

    const onRegister = (token) => {
        // console.log('[Notification] registered', token)
    }

    const onNotification = (notify) => {
        // console.log('[Notification] onNotification', notify)
    }

    const onOpenNotification = (notify) => {
        // console.log('[onOpenNotification] registered', notify)
        // Alert.alert('Open notification')
    }

    const onHandlerToast = (status, type, title, body, duration) => {
        const initialType = ["success", "error", "info", "success_custom", "info_custom", "error_custom"];
        const isExists = initialType.includes(type)
        if (!!status) {
            Toast.show({
                type: `${!!type && isExists ? type : 'success'}`,
                position: 'bottom',
                text1: `${!!title ? title : 'Hello'}`,
                text2: `${!!body ? body : 'This is some something 👋'}`,
                visibilityTime: !!duration && duration > 0 ? duration : 3000,
                autoHide: !!duration && duration == -1 ? false : true,
                topOffset: Platform.OS === 'ios' ? 50 : 30,
                onShow: () => { },
                onHide: () => { }
            });
        }
        else {
            Toast.hide({
                onHide: () => { }
            });
        }
    }
    const getAppVersion = async () => {
        const [config, update] = await Promise.all([
            CodePush.getConfiguration(),
            CodePush.getUpdateMetadata()
        ]);
        let version = ''
        console.log('config, update', config, update)
        if (!update) {
            version = config.appVersion;
        }
        else {
            version = `${config.appVersion} build ${update.label}`
        }
        checkForUpdate();
        await AsyncStorage.setItem('appVersion', version);
        const fcmToken = await messaging().getToken();
        console.log('fcmToken', fcmToken)
    }

    const checkForUpdate = async () => {
        // setState(prev => { return { ...prev, isFetched: false } })
        let metadata = null
        let isError = false
        await CodePush.checkForUpdate()
            .then((update) => {
                metadata = update
            }).catch(err => {
                metadata = err
                isError = true
            });
        console.log(isError, metadata)
        if (!isError && !!metadata && !!metadata.isMandatory) {
            // const appNewVersion = `${metadata.appVersion} build ${metadata.label}`
            // const appNewVersionDescription = `${metadata.description}`
            sync();
        }
    }

    const codePushStatusDidChange = (syncStatus) => {
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                // setState(prev => { return { ...prev, syncMessage: "Đang kiểm tra bản cập nhật." } });
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                // setState(prev => { return { ...prev, syncMessage: "Đang tải xuống gói cập nhật" } });
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                // setState(prev => { return { ...prev, syncMessage: "Awaiting user action." } });
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                // setState(prev => { return { ...prev, syncMessage: "Đang cài đặt bản cập nhật." } });
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                // setState(prev => { return { ...prev, syncMessage: "Ứng dụng được cập nhật", progress: false } });
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                // setState(prev => { return { ...prev, syncMessage: "Người dùng đã hủy cập nhật.", progress: false } });
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                preCodePushSync(true)
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                preCodePushSync(false)
                break;
        }
    }

    const codePushDownloadDidProgress = (progress) => {
        // setState(prev => { return { ...prev, progress } });
    }

    /** Update is downloaded silently, and applied on restart (recommended) */
    const sync = () => {
        // setState(prev => { return { ...prev, disabled: true } })
        CodePush.sync(
            {},
            codePushStatusDidChange,
            codePushDownloadDidProgress
        );
    }

    const preCodePushSync = (status) => {
        if (!!status) {
            setState(prev => {
                return {
                    ...prev,
                    syncMessage: "Đã cài đặt bản cập nhật và vui lòng khởi động lại ứng dụng.",
                }
            })
            setAlert(prev => {
                return {
                    ...prev,
                    isVisible: true,
                    modalAlert: { type: 'info' },
                    typeModalInputForm: 2,
                    disabledIcon: true,
                }
            })
        }
        else {
            setAlert(prev => {
                return {
                    ...prev,
                    isVisible: true,
                    modalAlert: {
                        type: 'warning',
                        title: 'Lỗi cập nhật ứng dụng',
                        content: 'Vui lòng kiểm trạng tình trạng mạng',
                    },
                }
            })
        }
    }

    const { isVisible, disabledIcon, typeModalInputForm, modalAlert } = alert
    return (
        <AuthContext.Provider value={authContext}>
            <AppContainer />
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            <ModalCenterAlert
                isVisible={isVisible}
                disabledIcon={disabledIcon}
                typeModal={modalAlert.type}
                titleModal={modalAlert.title}
                contentModal={modalAlert.content}
                childComponent={renderModalInputForm(typeModalInputForm)}
                onCloseModalAlert={onCloseModalAlert}
            />
        </AuthContext.Provider>
    );
}

// export default App
let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };
export default CodePush(codePushOptions)(App)