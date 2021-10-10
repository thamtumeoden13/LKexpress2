import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';

import { scale, moderateScale, verticalScale, calcWidth, calcHeight } from "utils/scaleSize";
import { BACKGROUND_COLOR_BLUE, BACKGROUND_COLOR_YELLOW } from 'constants/colors'

const ButtonOutlineBottom = (props) => {
    const [state, setState] = useState({
        title: 'Xác nhận',
        isLoading: false,
        disabled: false
    })

    const handlerPress = () => {
        setState(prev => {
            return {
                ...prev,
                disabled: true
            }
        })
        setTimeout(() => {
            setState(prev => {
                return {
                    ...prev,
                    disabled: false
                }
            })
        }, 1000);
        if (props.onPress)
            props.onPress()
    }

    useEffect(() => {
        setState(prev => {
            return {
                ...prev,
                disabled: !!props.disabled ? true : !!state.disabled
            }
        })
    }, [state.disabled])

    useEffect(() => {
        setState(prev => {
            return {
                ...prev,
                title: !!props.title ? props.title : 'Xác nhận'
            }
        })
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

    return (
        <Button
            TouchableComponent={TouchableScale}
            friction={90} //
            tension={100} // These props are passed to the parent component (here TouchableScale)
            activeScale={0.95} //
            title={state.title}
            // linearGradientProps={{
            //     colors: [BACKGROUND_COLOR_BLUE, BACKGROUND_COLOR_BLUE],
            //     start: [1, 0],
            //     end: [0.2, 0],
            // }}
            // ViewComponent={LinearGradient}
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
        width: '100%',
        marginVertical: verticalScale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStyle: {
        backgroundColor: BACKGROUND_COLOR_BLUE,
        borderWidth: scale(2),
        borderColor: 'transparent',
        borderRadius: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
        width: calcWidth(90),
        height: verticalScale(48),
    },
    titleStyle: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '600',
        color: BACKGROUND_COLOR_YELLOW, //'#ff0'
        fontSize: scale(16),
    }
})

export default ButtonOutlineBottom