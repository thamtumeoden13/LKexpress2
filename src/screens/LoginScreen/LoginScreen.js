import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, Modal } from 'react-native';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

import { AuthContext } from '../../utils'

import styles from './styles';
import { calcWidth } from 'utils/scaleSize';

const LoginScreen = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn, appContext } = useContext(AuthContext);

    const onFooterLinkPress = () => {
        props.navigation.navigate('Registration')
    }
    const onLoginPress = () => {
        signIn({ email, password })
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
                <TextInput
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
                />
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