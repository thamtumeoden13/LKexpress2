import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { CheckBox, Avatar, Input, Icon } from 'react-native-elements'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker';

import ButtonOutline from 'components/common/button/ButtonOutline';
import ButtonOutlineBottom from 'components/common/button/ButtonOutlineBottom';

import { scale, verticalScale, moderateScale, calcHeight, calcWidth } from 'utils/scaleSize'

const { width, height } = Dimensions.get('screen')

const AddRoomCom = (props) => {

    const [state, setState] = useState({
        roomName: '',
        imageBase64: '',
        inputText: '',
        isExists: false
    })
    const [users, setUsers] = useState({
        roots: [],
        chooses: []
    })

    const [errors, setErrors] = useState({
        roomName: '',
    })

    useEffect(() => {
        if (!!props.users) {
            props.users.map(e => {
                e.checked = false
                const phoneNumber = !!e.phoneNumber
                    ? `${e.phoneNumber.substr(0, 3)} ${e.phoneNumber.substr(3, 3)} ${e.phoneNumber.substr(6)}`
                    : ''
                e.phoneNumberFormat = phoneNumber
                return e
            })
            setUsers(prev => { return { ...prev, roots: props.users, chooses: props.users } })
        } else {
            setUsers(prev => { return { ...prev, roots: [], chooses: [] } })
        }
    }, [props.users])

    useEffect(() => {
        const filter = users.chooses.find(e => !!e.checked)
        setState(prev => { return { ...prev, isExists: !!filter ? true : false } })
    }, [users.chooses,])

    useEffect(()=>{
        if (state.inputText) {
            const newData = users.roots.filter((item) => {
                const textData = state.inputText.toUpperCase()
                const itemData = `${item.fullName.toUpperCase()},${item.email.toUpperCase()},${item.phoneNumber.toUpperCase()}`
                return itemData.indexOf(textData) > -1
            })
            setUsers(prev => { return { ...prev, chooses: newData } })
        } else {
            setUsers(prev => { return { ...prev, chooses: users.roots } })
        }
    },[state.inputText])

    const onChangeInput = (name, value) => {
        setState(prev => { return { ...prev, [name]: value } })
    }

    const handlerAdd = () => {
        let errors = {}
        switch (true) {
            case !state.roomName || state.roomName.length <= 0:
                errors.roomName = 'Vui lòng nhập tên'
                break;
            default:
                break;
        }
        if (!!errors && Object.keys(errors).length > 0) {
            setErrors(errors)
            return
        }

        const filter = users.chooses.filter(e=> {return !!e.checked})
        const listUser = filter.map(e=>{
            return {
                address: e.address,
                avatarBase64: e.avatarBase64,
                avatarURL: e.avatarURL,
                currentUpdateLocation: e.currentUpdateLocation,
                currentUpdateTime: e.currentUpdateTime,
                email: e.email,
                fullName: e.fullName,
                id: e.id,
                level: e.level,
                phoneNumber: e.phoneNumber,
                userType: e.userType,
            }
        })

        const result = {
            roomName: state.roomName,
            listUser: listUser
        }
        if (props.addRoom) {
            props.addRoom(result)
        }
    }

    const onChooseUploadFile = () => {
        ImagePicker.openPicker({
            includeBase64: true,
            compressImageQuality: 0.5,
            compressImageMaxWidth: 600,
            compressImageMaxHeight: 800,
        }).then(image => {
            setState(prev => { return { ...prev, imageBase64: image.data } })
        });
    }

    const handlerCheckBox = (index) => {
        let newChooses = [...users.chooses]
        newChooses.map((e, i) => {
            if (i == index) {
                e.checked = !e.checked
            }
            return e
        })
        setUsers(prev => { return { ...prev, chooses: newChooses } })
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerData}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                >
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        width,
                        marginVertical: 10, padding: 10,
                    }}>
                        {!!state.imageBase64 ?
                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center' }}
                                onPress={onChooseUploadFile}
                            >
                                <Image
                                    style={{ width: verticalScale(40), height: verticalScale(40), borderRadius: verticalScale(24) }}
                                    source={{ uri: `data:image/png;base64,${state.imageBase64}` }}
                                />
                                <AntDesignIcon name='edit' size={16} color='#fff' style={{ position: 'absolute', bottom: 0 }} />
                            </TouchableOpacity>
                            :
                            <Avatar
                                // rounded
                                icon={{ name: 'camera', type: 'font-awesome' }}
                                onPress={onChooseUploadFile}
                                activeOpacity={0.7}
                                containerStyle={{
                                    width: verticalScale(40), height: verticalScale(40), borderRadius: verticalScale(24),
                                    justifyContent: 'center',
                                    backgroundColor: '#6a6a6a'
                                }}
                            />
                        }
                        <View style={{ flex: 1 }}>
                            <Input
                                value={state.roomName}
                                onChangeText={input => onChangeInput('roomName', input)}
                                placeholder={'Đặt tên nhóm'}
                                containerStyle={{ height: verticalScale(40), }}
                                inputContainerStyle={styles.inputContainer}
                                inputStyle={styles.inputStyle}
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                blurOnSubmit={false}
                                placeholderTextColor="#6a6a6a"
                                // leftIcon={<Icon name="search" type="font-awesome" color="#6a6a6a" size={scale(14)} />}
                                rightIcon={
                                    state.roomName.length > 0 ?
                                        <TouchableOpacity onPress={() => onChangeInput('roomName', '')} style={{ right: scale(10) }}>
                                            <Icon name="remove" type="font-awesome" color="#6a6a6a" size={scale(14)} />
                                        </TouchableOpacity>
                                        : <View></View>
                                }
                            />
                        </View>
                    </View>
                    <Input
                        value={state.inputText}
                        onChangeText={input => onChangeInput('inputText', input)}
                        placeholder={'Tìm tên hoặc số điện thoại'}
                        containerStyle={{ height: verticalScale(40), }}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.inputStyle}
                        autoFocus={false}
                        autoCapitalize="none"
                        autoCorrect={false}
                        blurOnSubmit={false}
                        placeholderTextColor="#6a6a6a"
                        // leftIcon={<Icon name="search" type="font-awesome" color="#6a6a6a" size={scale(14)} />}
                        rightIcon={
                            state.inputText.length > 0 ?
                                <TouchableOpacity onPress={() => onChangeInput('inputText', '')} style={{ right: scale(10) }}>
                                    <Icon name="remove" type="font-awesome" color="#6a6a6a" size={scale(14)} />
                                </TouchableOpacity>
                                : <View></View>
                        }
                    />
                    <FlatList
                        data={users.chooses}
                        extraData={users.chooses}
                        keyExtractor={(item, index) => item.docRef.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width, height: 64,
                                        borderBottomWidth: 0.5, borderBottomColor: '#6a6a6a'
                                    }}
                                    onPress={() => handlerCheckBox(index)}
                                >
                                    <CheckBox
                                        checked={item.checked}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        style={{ width: 48 }}
                                        onPress={() => handlerCheckBox(index)}
                                    />
                                    <Image
                                        style={{ width: 48, height: 48, borderRadius: 24 }}
                                        source={{ uri: !!item.avatarBase64 ? `data:image/png;base64,${item.avatarBase64}` : item.avatarURL }}
                                        resizeMode={'cover'}
                                    />
                                    <View style={{
                                        flex: 1, justifyContent: 'space-around'
                                    }}>
                                        <Text style={{ color: '#000', paddingLeft: 10, fontSize: 16, lineHeight: 20 }}>{item.fullName}</Text>
                                        <Text style={{ color: '#6a6a6a', paddingLeft: 10, fontSize: 14, lineHeight: 20 }}>{item.phoneNumberFormat}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </KeyboardAwareScrollView>
            </View>
            <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'transparent' }}>
                <ButtonOutlineBottom
                    // title="Đồng ý"
                    onPress={() => handlerAdd()}
                    containerStyle={{ marginVertical: 5 }}
                    disabled={!state.isExists || !state.roomName}
                // buttonStyle={styles.buttonStyle}
                // titleStyle={styles.titleStyle}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    containerData: {
        flex: 1,
        width: '100%',
        // maxHeight: calcHeight('50%'),
        // height:'100%'
    },
    inputContainer: {
        paddingLeft: scale(8),
        borderRadius: scale(4),
        borderWidth: 1,
        borderColor: '#6a6a6a',
        height: verticalScale(40),
    },
    inputStyle: {
        color: '#000',
        fontSize: scale(14),
        height: verticalScale(40),
    }
})

export default AddRoomCom