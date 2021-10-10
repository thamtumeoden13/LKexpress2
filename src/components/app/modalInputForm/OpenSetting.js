import React, { Component, useState, useEffect, Fragment } from 'react'
import { Alert, View, Text, StyleSheet, StatusBar, UIManager, Linking, Platform, Dimensions } from 'react-native';
import ButtonOutline from '../../../components/common/button/ButtonOutline';
import { scale, moderateScale, verticalScale, calcWidth, calcHeight } from "../../../utils/scaleSize";
const OpenSetting = (props) => {

    const [state, setState] = useState({
        locationPermissionDenied: false,
        notificationPermissionDenied: false,
    })

    useEffect(() => {
        setState(prev => {
            return {
                ...prev,
                locationPermissionDenied: !!props.locationPermissionDenied ? props.locationPermissionDenied : false
            }
        })
    }, [props.locationPermissionDenied])

    useEffect(() => {
        setState(prev => {
            return {
                ...prev,
                notificationPermissionDenied: !!props.notificationPermissionDenied ? props.notificationPermissionDenied : false
            }
        })
    }, [props.notificationPermission])

    const handlerTwoFactorAuth = (status) => {
        if (props.openSetting) {
            props.openSetting(status)
        }
    }

    return (
        <Fragment>
            <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#000', fontSize: scale(16) }}>{`Yêu cầu cấp quyền ứng dụng`}</Text>
                {!!state.locationPermissionDenied && <Text style={{ color: '#f00', fontSize: scale(18), fontWeight: '600', padding: moderateScale(5) }}>{`Cho phép "Tận Tâm" truy cập vị trí`}</Text>}
                {!!state.notificationPermissionDenied && <Text style={{ color: '#f00', fontSize: scale(18), fontWeight: '600', padding: moderateScale(5) }}>{`Cho phép "Tận Tâm" nhận thông báo`}</Text>}
                <Text style={{ color: '#000', fontSize: scale(14), }}>{`Nhấn "ĐỒNG Ý" để vào cài đặt`}</Text>
                <Text style={{ color: '#000', fontSize: scale(14), }}>{`nhấn "TỪ CHỐI" để thoát ứng dụng`}</Text>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                    <ButtonOutline
                        title="Từ chối"
                        onPress={() => handlerTwoFactorAuth(false)}
                        buttonStyle={styles.buttonStyleIgnore}
                        titleStyle={styles.titleStyle}
                    />
                    <ButtonOutline
                        title="Đồng ý"
                        onPress={() => handlerTwoFactorAuth(true)}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.titleStyle}
                    />
                </View>
            </View>
        </Fragment>
    )
}
export default OpenSetting

const styles = StyleSheet.create({
    container: {
        minHeight: verticalScale(80),
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#fff',
    },
    containerButton: {
        // height: 40,
        height: verticalScale(40),
        justifyContent: "center",
        alignItems: 'center',
        marginVertical: moderateScale(5)
    },
    buttonStyle: {
        width: moderateScale(150),
        justifyContent: "center",
        alignItems: 'center',
    },
    buttonStyleIgnore: {
        width: moderateScale(150),
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#0005',
    },
    titleStyle: {
        fontSize: scale(14),
        fontWeight: '600'
    },
    row: {
        width: "100%",
        height: verticalScale(24),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(10)
    },
    row2: {
        width: "100%",
        height: verticalScale(64),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(10),
        alignItems: 'center'
    },
    row3: {
        width: "100%",
        height: verticalScale(24),
        paddingHorizontal: moderateScale(10),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomDescription: {
        maxHeight: verticalScale(32),
        fontStyle: 'italic',
        fontSize: scale(12),
        color: '#f00', textAlign: "left"
    },
    containerDataAction: {
        height: verticalScale(64),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        // backgroundColor: '#ff0'
    },
});