import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, Modal } from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
// import * as actions from '../../actions';
// import { useDispatch } from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../utils'
import styles from './styles2';
import { calcWidth } from 'utils/scaleSize';

export default function VerifyCode(props) {
  const { route } = props;
  let countDownTimer = useRef(null);
  // const dispatch = useDispatch();
  const navigation = useNavigation();
  const { phone, user } = route.params;
  const [value, setValue] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  const [secondResend, setSecondSend] = useState(60);

  const { signInWithPhone, appContext } = useContext(AuthContext);

  const onCountDownResend = () => {
    countDownTimer = setInterval(() => {
      setSecondSend((secondResend) => secondResend - 1);
    }, 1000);
  };

  const [propsVerify, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const refVerify = useBlurOnFulfill({ value, cellCount: 6 });
  const verifyPhoneNumber = async () => {
    try {
      const confirm = await auth().signInWithPhoneNumber(phone);
      console.log(confirm);
      setConfirmResult(confirm);
      return true;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    onCountDownResend();
    // dispatch(actions.loading(true));
    verifyPhoneNumber()
      .then(res => {
        // dispatch(actions.loading(false));
      })
      .catch(err => {
        console.log(err);
        // dispatch(actions.loading(false));
      });
  }, []);

  const onFulfill = (val) => {
    if (confirmResult && val.length == 6) {
      // dispatch(actions.loading(true));
      confirmResult.confirm(val)
        .then(res => {
          console.log('DATA', res);
          if (res.user && res.user._user) {
            signInWithPhone(user)
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const resendOtp = () => {
    setSecondSend(60);
    verifyPhoneNumber();
  };

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
        <View style={{ alignItems: 'center' }}>
          <Image
            style={styles.logo}
            source={require("@assets/bootsplash_logo.png")}
          />
          <Text style={styles.title}>{`Xác nhận tài khoản`}</Text>
          <Text style={styles.loginText}>{`Vui lòng nhập mã xác nhận đc gửi tới số điện thoại ${phone}`}</Text>
        </View>
        <CodeField
          ref={refVerify}
          {...propsVerify}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={(val) => {
            setValue(val);
            if (val.length === 6) {
              onFulfill(val);
            }
          }}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View style={styles.cell}>
              <Text
                key={index}
                style={styles.focusCell}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
        <View style={{ width: '100%', marginTop: 16, paddingHorizontal: 16, alignItems: 'flex-end' }}>
          {secondResend > 0 ? (
            <Text style={styles.resend}>
              {'Vui lòng đợi ' + secondResend + ' giây để gửi lại'}
            </Text>
          ) : (
            <>
              <TouchableOpacity activeOpacity={0.8} onPress={resendOtp}>
                <Text style={styles.resend}>
                  Gửi lại mã
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>

    </SafeAreaView>
  );
}
