import React, { useContext, useState, useEffect, useCallback } from 'react';
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
import { StackActions } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import ShoppingCartIcon from 'components/common/icon/ShoppingCartIcon'
import HeaderTitle from 'components/common/Header/HeaderTitle'
import HeadPhoneCarousel from 'components/common/listCommon/HeadPhoneCarousel'

import { AuthContext } from '../../utils'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import BackIcon from 'components/common/icon/BackIcon';

const db = firestore()
const entityRef = db.collection('categories')
const entityProductsRef = db.collection('products')

const CategoryDetailScreen = (props) => {

    const [state, setState] = useState({
        isLoading: true,
        categoryID: '',
        categoryName: ''
    })
    const [categories, setCategories] = useState([])

    const { addShoppingCart } = useContext(AuthContext)

    useEffect(() => {
        const { id, name } = props.route.params.item
        setState(prev => {
            return {
                ...prev,
                categoryID: id,
                categoryName: name,
            }
        })
    }, [])

    useEffect(() => {
        if (props.navigation && state.categoryID) {
            props.navigation.setOptions({
                headerTitle: () => <HeaderTitle title={`${state.categoryName}`} />,
                headerRight: () => <ShoppingCartIcon onOpen={() => onOpenShoppingCart()} />,
            });

            getRealtimeCollection()
        }
    }, [props.navigation, state.categoryID])

    const getRealtimeCollection = async () => {
        const querySnapshot = await entityProductsRef.doc(state.categoryID).get()
        const querySnapshotVariant = await entityProductsRef.doc(querySnapshot.id).collection('variants').get()
        let variants = []
        if (querySnapshotVariant.docs.length > 0) {
            variants = querySnapshotVariant.docs.map(doc => {
                const variant = doc.data()
                return {
                    ...variant,
                    docRef: doc.id,
                }
            })
        }
        const categories = !!variants && variants.length > 0 ? variants : [querySnapshot.data()]
        setCategories(categories)
    }

    const onAddShoppingCart = (item) => {
        if (item.quantity > 0) {
            addShoppingCart(item)
        }
        else {
            Alert.alert('Thêm giỏ hàng', `Vui lòng nhập số lượng`);
        }
    }

    const onOpenShoppingCart = () => {
        // const pushAction = StackActions.push('ShoppingCart')
        props.navigation.navigate('ShoppingCart')
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="gray" barStyle="dark-content" hidden />
            {/* <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    scrollEventThrottle={16}
                >
                    <CarouselStackLayout
                        data={categories}
                        // title={state.categoryName}
                        // subtitle={`Stack of cards layout | Loop`}
                        onPressItem={onPressItem}
                    />
                </ScrollView>
            </View> */}
            <HeadPhoneCarousel
                data={categories}
                addToCart={onAddShoppingCart}
            />
        </SafeAreaView>
    );
}

export default CategoryDetailScreen;

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