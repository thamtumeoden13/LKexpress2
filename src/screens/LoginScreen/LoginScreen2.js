import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, Modal } from 'react-native';
import { Image, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { AuthContext } from '../../utils'

import styles from './styles';
import { calcWidth } from 'utils/scaleSize';
import { validatePhoneNumber } from 'utils/function'

const db = firestore()
const entityUserRef = db.collection('users')

const LoginScreen = (props) => {
    const [user, setUser] = useState({})
    const [phone, setPhone] = useState('')

    const { appContext } = useContext(AuthContext);

    const onFooterLinkPress = () => {
        props.navigation.navigate('Registration')
    }
    // const onLoginPress = () => {
    //     signIn({ email, password })
    // }

    const onLoginPress = async () => {
        try {
            console.log('phone', phone)
            if (validatePhoneNumber(phone)) {
                let phoneNumberCheck = phone.startsWith('0') ? phone : '0' + phone;
                const querySnapshot = await entityUserRef.where("phoneNumber", "==", phoneNumberCheck).get()
                console.log('querySnapshot.docs', querySnapshot.docs)
                if (querySnapshot.docs.length > 0) {
                    let users = querySnapshot.docs.map((doc) => {
                        const user = doc.data()
                        return { ...user, id: doc.id }
                    })
                    let phoneNumber = phone.startsWith('0') ? phone.replace('0', '+84') : '+84' + phone;
                    props.navigation.navigate('VerifyCode', { phone: phoneNumber, user: users[0] });
                    return;
                } else {
                    Alert.alert('Tài khoản chưa được đăng kí', 'Vui lòng đăng ký lần đầu bằng gmail trước tiên!')
                    return;
                }
            }
            throw new Error();
        } catch (error) {
            console.log(error.code, error);
            Alert.alert('Đăng nhập thất bại');
            // dispatch(actions.loading(false));
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!appContext.isLoading}
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
                keyboardShouldPersistTaps="always"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
            >
                <Image
                    style={styles.logo}
                    source={require('@assets/bootsplash_logo.png')}
                />
                {/* <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    keyboardType={'email-address'}
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                /> */}
                <View style={{
                    backgroundColor: '#F4F5F6',
                    borderRadius: 23,
                    flexDirection: 'row'
                }}>
                    <Text style={{ fontWeight: 'bold', padding: 16, fontSize: 14, lineHeight: 16 }}>+84</Text>
                    <TextInput
                        placeholder="Nhập số điện thoại của bạn..."
                        keyboardType='phone-pad'
                        style={{ color: '#000', width: 900 }}
                        onChangeText={(text) => setPhone(text)}
                        value={phone}
                    />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}
                >
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen