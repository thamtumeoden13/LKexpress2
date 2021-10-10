import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native'

import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import {
    CarouselMainLayout,
    CarouselStackLayout,
} from 'components/carousel/layout';
import { ENTRIES1, ENTRIES2 } from 'constants/entries';
import { scale, verticalScale, calcHeight, calcWidth } from 'utils/scaleSize'
import ButtonOutline from 'components/common/button/ButtonOutline';
import ButtonOutlineBottom from 'components/common/button/ButtonOutlineBottom';
import { InputText } from 'components/common/input/InputText';
import { formatMoney } from 'utils/function';

const AddCategory = (props) => {

    const [state, setState] = useState({
        categoryID: '',
        categoryName: '',
        isExistsProduct: false
    })
    const [listImage, setListImage] = useState([])

    const [errors, setErrors] = useState({
        categoryID: '',
        categoryName: '',
    })

    const [products, setProducts] = useState([])

    useEffect(() => {
        let products = []
        if (!!props.products && props.products.length > 0) {
            products = props.products.map(e => {
                e.isActived = false
                return e
            })
        }
        setProducts(products)

    }, [props.products])

    useEffect(() => {
        const filter = products.filter(e => { return !!e.isActived })
        setState(prev => { return { ...prev, isExistsProduct: !!filter && filter.length > 0 ? true : false } })
        const listImage = filter.slice().map(e=>{
            e.uri = e.imageUri
            return e
        })
        setListImage(listImage)
    }, [products])

    const onChangeInput = (name, value) => {
        setErrors(prev => { return { ...prev, [name]: '', } })
        setState(prev => { return { ...prev, [name]: value } })
    }

    const onPressItem = (docRef) => {
        let newProducts = products.slice()
        newProducts.map(e => {
            if (e.docRef == docRef) {
                e.isActived = !e.isActived
            }
            return e
        })
        setProducts(newProducts)
    }

    const handlerAdd = () => {
        let errors = {}
        switch (true) {
            case !state.categoryName || state.categoryName.length <= 0:
                errors.categoryName = 'Vui lòng nhập tên'
                break;
            default:
                break;
        }
        if (!!errors && Object.keys(errors).length > 0) {
            setErrors(errors)
            return
        }

        const listProduct = products.filter(e => { return !!e.isActived })

        const result = {
            categoryID: state.categoryID,
            categoryName: state.categoryName,
            listImage: listImage,
            listProduct: listProduct
        }
        if (props.addCategory) {
            props.addCategory(result)
        }
    }


    const onChooseUploadFile = () => {
        ImagePicker.openPicker({
            multiple: true,
            includeBase64: true,
            compressImageQuality: 0.5,
            compressImageMaxWidth: 600,
            compressImageMaxHeight: 800,
        }).then(result => {
            result.map(e => {
                e.base64 = e.data
                return e
            })
            const newImages = [...result, ...listImage]
            setListImage(newImages)
        });
    }

    return (
        <View style={styles.container}>
            <Text style={{
                padding: scale(5), marginTop: verticalScale(10),
                fontSize: scale(20), fontWeight: 'bold', color: '#00f'
            }}>{`Thêm Danh mục`}</Text>
            <View style={styles.containerData}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                >
                    {/* <InputText
                        label={'Mã Danh Mục'}
                        placeholder={'nhập mã danh mục...'}
                        text={state.categoryID}
                        onChangeInput={(value) => onChangeInput('categoryID', value)}
                        error={errors.categoryID}
                        autoFocus={true}
                        upperCase={true}
                    /> */}
                    <InputText
                        label={'Tên Danh Mục'}
                        placeholder={'nhập tên danh mục...'}
                        text={state.categoryName}
                        onChangeInput={(value) => onChangeInput('categoryName', value)}
                        error={errors.categoryName}
                        autoFocus={true}
                    />
                    <View style={{
                        width: '100%',
                        flexDirection: 'column', alignItems: 'flex-start',
                    }}>
                        <ButtonOutline
                            title="Thêm ảnh"
                            onPress={() => onChooseUploadFile()}
                            containerStyle={{ marginVertical: 5 }}
                            titleStyle={{ color: '#00f' }}
                            buttonStyle={{
                                backgroundColor: 'transparent', borderColor: 'transparent',
                                height: verticalScale(40),
                            }}
                        />
                    </View>
                    <FlatList
                        data={products}
                        extraData={products}
                        keyExtractor={(item, index) => item.docRef.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => onPressItem(item.docRef)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: scale(5) }}>
                                        <Image
                                            source={item.imageUri ? { uri: item.imageUri } : { uri: `data:image/png;base64,${item.imageBase64}` }}
                                            style={{ width: scale(48), height: scale(48), borderRadius: scale(24), }}
                                            resizeMode={'contain'}
                                        />
                                        <View style={{ flexDirection: 'column', padding: scale(5) }}>
                                            <Text style={{ color: '#3da4ab', fontSize: scale(14), fontWeight: '500' }}>{item.heading}</Text>
                                            <Text style={{ color: '#4a4e4d', fontSize: scale(10) }}>{formatMoney(item.price, 0)}</Text>
                                        </View>
                                        {!!item.isActived &&
                                            <AntDesignIcon
                                                name='checkcircleo' size={scale(14)}
                                                color={'#00f'}
                                            />
                                        }
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    {!!listImage && listImage.length > 0 &&
                        <CarouselMainLayout
                            data={listImage}
                            loopData={true}
                        // title={`Main Layout`}
                        // subtitle={`Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots`}
                        />
                    }
                </KeyboardAwareScrollView>
            </View>
            <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'transparent' }}>
                <ButtonOutlineBottom
                    // title="Đồng ý"
                    onPress={() => handlerAdd()}
                    containerStyle={{ marginVertical: 5 }}
                    disabled={!listImage || listImage.length <= 0 || !state.isExistsProduct}
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
    }
})

export default AddCategory