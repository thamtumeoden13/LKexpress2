import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements';
import { scale, moderateScale, verticalScale, calcWidth, calcHeight } from "../../../utils/scaleSize";
import { BACKGROUND_COLOR_BLUE, BACKGROUND_COLOR_YELLOW } from '../../../constants/colors'

const ButtonOutline = (props) => {

    const [state, setState] = useState({
        title: 'Xác nhận',
        isLoading: false,
        disabled: false,
        isAutoEnabled: false
    })

    const handlerPress = () => {
        setState(prev => {
            if (!prev.isAutoEnabled) {
                setTimeout(() => {
                    setState(prev1 => { return { ...prev1, disabled: false } })
                }, 1000)
            }
            return { ...prev, disabled: true }
        })
        if (props.onPress) {
            props.onPress()
        }
    }

    useEffect(() => {
        setState(prev => {
            return {
                ...prev,
                disabled: !!props.disabled ? true : state.disabled
            }
        })
    }, [state.disabled])

    useEffect(() => {
        setState(prev => { return { ...prev, title: !!props.title ? props.title : 'Xác nhận' } })
    }, [props.title])

    useEffect(() => {
        setState(prev => {
            return {
                ...prev,
                isLoading: !!props.isLoading ? true : false
            }
        })
    }, [props.isLoading])

    useEffect(() => {
        setState(prev => {
            return {
                ...prev,
                disabled: !!props.disabled ? true : false
            }
        })
    }, [props.disabled])

    useEffect(() => {
        setState(prev => {
            return {
                ...prev,
                isAutoEnabled: !!props.isAutoEnabled ? true : false
            }
        })
    }, [props.isAutoEnabled])

    return (
        <Button
            title={!!props.title ? props.title : 'Xác nhận'}
            activeOpacity={0.7}
            underlayColor="transparent"
            onPress={handlerPress}
            loadingProps={{
                size: 'large',
                color: '#000',
                hidesWhenStopped: true,
            }}
            buttonStyle={[styles.buttonStyle, props.buttonStyle]}
            containerStyle={[styles.containerStyle, props.containerStyle]}
            titleStyle={[styles.titleStyle, props.titleStyle]}
            disabled={state.disabled}
            icon={!!props.icon ? props.icon : null}
        />
    )
}
const styles = StyleSheet.create({
    containerStyle: {
        marginVertical: verticalScale(20),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: moderateScale(10)
    },
    buttonStyle: {
        height: verticalScale(48),
        width: moderateScale(150),
        backgroundColor: BACKGROUND_COLOR_BLUE,
        borderWidth: scale(2),
        borderColor: 'transparent',
        borderRadius: scale(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleStyle: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '600',
        color: BACKGROUND_COLOR_YELLOW, //'#ffee00'
        fontSize: scale(16),
    }
})

export default ButtonOutline