import React, { useState, useEffect } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, Keyboard, Modal, SafeAreaView, Alert } from 'react-native'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import FeatherIcon from 'react-native-vector-icons/Feather'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import ButtonOutline from 'components/common/button/ButtonOutline';
import BackIcon from 'components/common/icon/BackIcon';
import HeaderTitle from 'components/common/Header/HeaderTitle';

import { scale, verticalScale, calcHeight, calcWidth } from 'utils/scaleSize'

import styles from './styles';

const db = firestore()
const entityUserRef = db.collection('users')

const UpdateProfileScreen = (props) => {

    const [state, setState] = useState({
        isLoading: false
    })
    const [user, setUser] = useState({})

    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', async () => {
            // setState(prev => { return { ...prev, isLoading: true } })
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            getUsersInfo(user.id)
        });
        return () => {
            focusListener
        }
    }, [])

    useEffect(() => {
        if (props.navigation) {
            props.navigation.setOptions({
                headerTitle: () => <HeaderTitle title={`Cập nhật thông tin`} />,
            });
        }
    }, [props.navigation])

    const getUsersInfo = async (userID) => {
        const querySnapshot = await entityUserRef.where("id", "==", userID).get()
        const users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            return {
                ...user,
                doc: doc.id,
                userID: user.id,
                userName: user.fullName,
                avatarURL: user.avatarURL,
                user: user
            }
        })
        console.log('users', users)
        setUser({ ...users }[0])
        setState(prev => { return { ...prev, isLoading: false } })
    }

    const handlerChangeText = (name, text) => {
        setUser(prev => { return { ...prev, [name]: text } })
    }

    const onUpdateProfile = () => {
        setState(prev => { return { ...prev, isLoading: true } })

        const result = {
            avatarBase64: user.avatarBase64,
            address: user.address,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber
        }

        entityUserRef.doc(user.userID).update(result)
            .then(_doc => {
                Keyboard.dismiss()
                setState(prev => { return { ...prev, isLoading: false } })
                // Alert.alert('success')
                props.navigation.goBack()
            })
            .catch((error) => {
                setState(prev => { return { ...prev, isLoading: false } })
                Alert.alert(error)
            })
    }

    const onChooseUploadFile = () => {
        ImagePicker.openPicker({
            includeBase64: true,
            compressImageQuality: 1,
            compressImageMaxWidth: 600,
            compressImageMaxHeight: 800,
        }).then(image => {
            setUser(prev => { return { ...prev, avatarBase64: image.data } })
        });
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!state.isLoading}
            >
                <SafeAreaView style={{
                    flex: 1,
                    justifyContent: 'center', alignItems: 'center', position: 'absolute',
                    backgroundColor: '#0003',
                    top: 0, bottom: 0, left: 0, right: 0
                }}>
                    <LottieView
                        source={require('@assets/animations/loading.json')}
                        colorFilters={[{
                            keypath: "button",
                            color: "#F00000"
                        }, {
                            keypath: "Sending Loader",
                            color: "#F00000"
                        }]}
                        style={{ width: calcWidth(50), height: calcWidth(50), justifyContent: 'center', alignItems: 'center' }}
                        autoPlay
                        loop
                    />
                </SafeAreaView>
            </Modal>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
            // keyboardShouldPersistTaps="always"
            >
                <TouchableOpacity
                    style={{
                        width: '100%',
                        flexDirection: 'column', alignItems: 'center',
                    }}
                    onPress={() => onChooseUploadFile()}
                >
                    <Image
                        style={styles.logo}
                        source={{ uri: user.avatarURL }}
                    />
                    <View style={{ position: 'absolute', bottom: 0 }}>
                        <FeatherIcon name='edit' size={20} />
                    </View>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder='Họ tên'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('fullName', text)}
                    value={user.fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('email', text)}
                    value={user.email}
                    keyboardType={'email-address'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Số điện thoại'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('phoneNumber', text)}
                    value={user.phoneNumber}
                    keyboardType={'number-pad'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Địa chỉ giao/nhận hàng'
                    onChangeText={(text) => handlerChangeText('address', text)}
                    value={user.address}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onUpdateProfile()}>
                    <Text style={styles.buttonTitle}>{`Update Profile`}</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}
export default UpdateProfileScreen