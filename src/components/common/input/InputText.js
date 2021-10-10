import React, { useState, useEffect } from 'react';
import { Alert, Pressable } from 'react-native';
import { Input, Icon } from 'react-native-elements';

import { scale, moderateScale, verticalScale, calcWidth, calcHeight } from "utils/scaleSize";

export const InputText = (props) => {
    const [text, setText] = useState(props.text)

    const [state, setState] = useState({
        label: '',
        value: '',
        autoFocus: false,
        upperCase: false
    })
    const [error, setError] = useState('')

    useEffect(() => {
        if (props.onChangeInput) {
            props.onChangeInput(text)
        }
        setError('')
    }, [text])

    useEffect(() => {
        setError(props.error)
    }, [props.error])

    useEffect(() => {
        setState(prev => { return { ...prev, label: !!props.label ? props.label : '' } })
    }, [props.label])

    useEffect(() => {
        setState(prev => { return { ...prev, text: !!props.text ? props.text : '' } })
    }, [props.text])

    useEffect(() => {
        setState(prev => { return { ...prev, autoFocus: !!props.autoFocus ? true : false } })
    }, [props.autoFocus])

    useEffect(() => {
        setState(prev => { return { ...prev, upperCase: !!props.upperCase ? true : false } })
    }, [props.upperCase])

    return (
        <Input
            containerStyle={{
                marginVertical: verticalScale(5),
                marginHorizontal: moderateScale(5),
                // backgroundColor: '#00f'
            }}
            onChangeText={(text) => setText(!!state.upperCase ? text.toUpperCase() : text)}
            value={text}
            inputStyle={{
                marginLeft: moderateScale(10),
                fontSize: scale(14),
                color: '#000'
            }}
            label={!!state.label ? state.label : ''}
            keyboardAppearance="light"
            placeholder={props.placeholder ? props.placeholder : "Nhập ở đây..."}
            autoCapitalize="none"
            autoFocus={state.autoFocus}
            autoCorrect={false}
            // keyboardType="number-pad"
            maxLength={20}
            blurOnSubmit={true}
            placeholderTextColor="#0005"
            errorStyle={{ textAlign: 'left', fontSize: scale(12) }}
            errorMessage={error}
        />
    )
}