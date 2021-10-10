import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

import { scale, verticalScale, calcHeight, calcWidth } from 'utils/scaleSize'
import ButtonOutline from 'components/common/button/ButtonOutline';
import { InputText } from 'components/common/input/InputText';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

const AddCategory = (props) => {

    const [state, setState] = useState({
        categoryID: '',
        categoryName: '',
    })
    const [errors, setErrors] = useState({
        categoryID: '',
        categoryName: '',
    })

    const onChangeInput = (name, value) => {
        setErrors(prev => { return { ...prev, [name]: value, } })
        setState(prev => { return { ...prev, [name]: value } })
    }
    
    const handlerAddCategory = () => {

    }

    return (
        <View style={styles.container}>
            <Text style={{ padding: scale(5), fontSize: scale(16), fontWeight: '500' }}>{`Thêm Danh mục`}</Text>
            <View style={styles.containerData}>
                <KeyboardAwareScrollView
                    // contentContainerStyle={{
                    //     flexDirection: 'column',
                    //     marginVertical: verticalScale(5),
                    //     // flexGrow: 1,
                    // }}
                    showsHorizontalScrollIndicator={true}
                    persistentScrollbar={true}
                >
                    <InputText
                        label={'Mã Danh Mục'}
                        placeholder={'nhập mã danh mục...'}
                        text={state.categoryID}
                        onChangeInput={(value) => onChangeInput('categoryID', value)}
                        error={errors.categoryID}
                        autoFocus={true}
                    />
                    <InputText
                        label={'Tên Danh Mục'}
                        placeholder={'nhập tên danh mục...'}
                        text={state.categoryName}
                        onChangeInput={(value) => onChangeInput('categoryName', value)}
                        error={errors.categoryName}
                        autoFocus={true}
                    />
                </KeyboardAwareScrollView>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                <ButtonOutline
                    title="Đồng ý"
                    onPress={() => handlerAddCategory()}
                    buttonStyle={styles.buttonStyle}
                    titleStyle={styles.titleStyle}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: verticalScale(80),
        maxHeight: calcHeight('70%'),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerData: {
        width: '100%',
        maxHeight: calcHeight('50%'),
        // height:'100%'
    }
})

export default AddCategory