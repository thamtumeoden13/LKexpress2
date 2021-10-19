import React, { useState, useContext } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import FeatherIcon from 'react-native-vector-icons/Feather'

import { AuthContext } from '../../utils'
import { listDataElement } from '../../constants/dataTest'

import styles from './styles';

const RegistrationScreen = ({ navigation }) => {
    const [state, setState] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: '',
        confirmPassword: '',
        avatarURL: listDataElement[Math.floor(Math.random() * (listDataElement.length - 1))].avatar_url,
        avatarBase64: ''
    })
    const { signUp } = useContext(AuthContext);
    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const handlerChangeText = (name, text) => {
        setState(prev => { return { ...prev, [name]: text } })
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

    const onRegisterPress = () => {
        // if (state.password !== state.confirmPassword) {
        //     alert("Passwords don't match.")
        //     return
        // }
        // const { email, password, fullName, avatarURL, avatarBase64, phoneNumber, address } = state
        // const result = { email, password, fullName, avatarURL, avatarBase64, phoneNumber, address }
        signUp(state)
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                bounces={false}
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
                        source={!!state.avatarBase64 ? { uri: `data:image/png;base64,${state.avatarBase64}` } : { uri: state.avatarURL }}
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
                    value={state.fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('email', text)}
                    value={state.email}
                    keyboardType={'email-address'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Số điện thoại'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('phoneNumber', text)}
                    value={state.phoneNumber}
                    keyboardType={'number-pad'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    // secureTextEntry
                    placeholder='Mật khẩu'
                    onChangeText={(text) => handlerChangeText('password', text)}
                    value={state.password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Địa chỉ'
                    onChangeText={(text) => handlerChangeText('address', text)}
                    value={state.address}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    editable={false}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}
export default RegistrationScreen