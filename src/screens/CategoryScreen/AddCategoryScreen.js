import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Image,
    StatusBar,
    Alert,
    Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';

import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import { getRandomColor } from 'utils/function'

import AddCategoryCom from 'components/category/AddCategory'
import BackIcon from 'components/common/icon/BackIcon';
import HeaderTitle from 'components/common/Header/HeaderTitle';

const db = firestore()
const entityRef = db.collection('categories')
const entityProductsRef = db.collection('products')

const AddCategoryScreen = (props) => {

    const [state, setState] = useState({
        userID: '',
        userName: ''
    })

    const [products, setProducts] = useState([])

    useEffect(() => {
        setTimeout(async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.fullName,
                }
            })
        })
        getRealtimeCollection()
    }, [])

    useEffect(() => {
        if (props.navigation) {
            props.navigation.setOptions({
                headerTitle: () => <HeaderTitle title={`Thêm Danh Mục`} />,
            });
        }
    }, [props.navigation])


    const getRealtimeCollection = async () => {
        const querySnapshot = await entityProductsRef.get()
        const products = querySnapshot.docs.map(doc => {
            const product = doc.data()
            return {
                ...product,
                docRef: doc.id
            }
        })
        setProducts(products)
    }


    const addCategory = (result) => {
        let { categoryName, listImage, listProduct } = result
        listImage.map(e => {
            e.createdBy = state.userID
            return e
        })

        const productsRef = listProduct.map(f => { return f.docRef })
        entityRef.add({
            bg: getRandomColor(),
            color: getRandomColor(),
            createdAt: new Date(),
            createdBy: state.userID,
            createdByName: state.userName,
            name: categoryName,
            productsRef: productsRef,
        }).then((docRef) => {
            listProduct.map(product => {
                const newcategoriesRef = [docRef.id, ...product.categoriesRef]
                entityProductsRef.doc(product.docRef).update({
                    categoriesRef: newcategoriesRef
                }).then(_doc => {
                    Keyboard.dismiss()
                }).catch((error) => {
                    alert(error)
                })
            })

        }).catch((error) => {
            alert(error)
        })
        props.navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            < View style={styles.container} >
                <AddCategoryCom
                    products={products}
                    addCategory={addCategory}
                />
            </View >
        </SafeAreaView>
    );
}

export default AddCategoryScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#000"
    },
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
    },
    containerStyleListHorizontal: {
        height: moderateScale(160),
    },
    itemStyleListHorizontal: {
        width: moderateScale(160)
    },
    containerStyleListVertical: {
        height: moderateScale(520),
    },
    itemStyleListVertical: {
        height: moderateScale(260),
        width: calcWidth(45)
    }
});