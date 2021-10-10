
import React, { useEffect, useState, version } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native'
import { SearchBar, Input, Icon } from 'react-native-elements';
import { withNavigation } from '@react-navigation/compat'

import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';

const SearchInput = (props) => {

    const [state, setState] = useState({
        placeholder: 'Vui lòng nhập',
    })

    const [input, setInput] = useState('')

    useEffect(() => {
        setState(prev => { return { ...prev, placeholder: !!props.placeholder ? props.placeholder : state.placeholder } })
    }, [props.placeholder])

    const onChangeValue = (value) => {
        setInput(value)
        if (props.handerSearchInput) {
            props.handerSearchInput(value, state.users, state.usersFilter)
        }
    }

    return (
        <View style={styles.searchBar}>
            <Input
                value={input}
                onChangeText={input => onChangeValue(input)}
                placeholder={state.placeholder}
                containerStyle={{ height: verticalScale(32), }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputStyle}
                autoFocus={false}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                placeholderTextColor="#6a6a6a"
                leftIcon={<Icon name="search" type="font-awesome" color="#6a6a6a" size={scale(14)} />}
                rightIcon={
                    input.length > 0 ?
                        <TouchableOpacity onPress={() => onChangeValue('')} style={{ right: scale(10) }}>
                            <Icon name="remove" type="font-awesome" color="#6a6a6a" size={scale(14)} />
                        </TouchableOpacity>
                        : <View></View>
                }
            />
        </View>
    )
}
export default withNavigation(SearchInput);

const styles = StyleSheet.create({
    searchBar: {
        width: calcWidth(70),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        paddingLeft: scale(8),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: '#6a6a6a',
        height: verticalScale(32),
    },
    inputStyle: {
        marginLeft: moderateScale(10),
        color: '#000',
        fontSize: scale(14),
        height: verticalScale(32),
    }
})