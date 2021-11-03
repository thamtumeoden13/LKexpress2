import React, { Component, useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    StatusBar,
    Alert,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Text,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';

import ShoppingCartIcon from 'components/common/icon/ShoppingCartIcon'
import AddIcon from 'components/common/icon/AddIcon'
import { AddCategory } from 'components/category/modalInputForm'
import HeaderSearchInput from 'components/common/Header/SearchInput'
import BackIcon from 'components/common/icon/BackIcon';
import { themeOptions } from 'constants/theme'
import AnimatedAppearance from 'components/common/button/AnimatedAppearance';
import { scale } from 'utils/scaleSize';
import { formatMoney } from 'utils/function';

const { ITEM_WIDTH, ITEM_HEIGHT, SPACING, RADIUS, FULL_SIZE } = themeOptions

const db = firestore()
const entityRef = db.collection('categories')
const entityProductRef = db.collection('products')

const CategoryScreen = (props) => {

    const scrollX = useRef(new Animated.Value(0)).current

    const [state, setState] = useState({
        isLoading: true,
        userID: '',
        level: '',
        isDataFetched: false
    })

    const [categories, setCategories] = useState([])
    const [categoriesFilter, setCategoriesFilter] = useState([])
    const [products, setProducts] = useState([])

    useEffect(() => {
        setState(prev => { return { ...prev, isDataFetched: false } })
        setTimeout(async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    level: user.level,
                }
            })
        });
        const unsubscribeCategorieList = entityRef.onSnapshot(getRealtimeCollectionCategoriList, err => Alert.alert(error))
        return () => {
            unsubscribeCategorieList()
        }
    }, [])

    useEffect(() => {
        if (props.navigation && !!state.level && state.level == 1) {
            props.navigation.setOptions({
                headerLeft: () => <AddIcon onOpen={() => showAddCategory()} />,
                headerTitle: () =>
                    <HeaderSearchInput
                        placeholder={'Tìm danh mục, sản phẩm'}
                        handerSearchInput={(value) => onHanderSearchInput(value)}
                    />,
                headerRight: () => <ShoppingCartIcon onOpen={() => onOpenShoppingCart()} />,
            });
        }
    }, [state.level])

    useEffect(() => {
        console.log('scrollX', scrollX)
        scrollX.addListener(({ value }) => {
            // console.log('value', value)
            let index = Math.floor(value / ITEM_WIDTH)
            console.log('index', index)
            if (index <= 0) {
                index = 0
            }
            if (!!categoriesFilter && categoriesFilter.length > 0) {
                if (index > categoriesFilter.length) index = categoriesFilter.length - 1
                const products = categoriesFilter[index].products
                setProducts(products)
            }
        })
    }, [scrollX])

    const onHanderSearchInput = (searchInput) => {
        if (searchInput) {
            const newData = categories.filter((item) => {
                const textData = searchInput.toUpperCase()
                const itemData = `${item.name.toUpperCase()},${item.subCategories.toString().toUpperCase()}`
                return itemData.indexOf(textData) > -1
            })
            setCategoriesFilter(newData)
        } else {
            setCategoriesFilter(categories)
        }
    }

    const showAddCategory = () => {
        // const pushAction = StackActions.push('AddCategory')
        props.navigation.navigate('AddCategory')
    }

    const getRealtimeCollectionCategoriList = async (querySnapshot) => {
        const reads = querySnapshot.docs.map(async (doc) => {
            const room = doc.data()
            return {
                ...room,
                doc: doc.id
            }
        })
        let result = await Promise.all(reads)
        let categories = result.filter(e => { return !!e && Object.keys(e).length > 0 });
        const readsCategories = categories.map(async (e) => {
            if (e.productsRef) {
                const reads = e.productsRef.map(async (f) => {
                    const querySnapshot2 = await entityProductRef.doc(f).get();
                    const data = querySnapshot2.data()
                    console.log('data', data)
                    return {
                        ...data,
                        id: f,
                        name: data.heading
                    }
                })
                const products = await Promise.all(reads)
                e.products = [...products]
                return e
            } else {
                e.products = []
                return e
            }
        })
        const categoriesPromise = await Promise.all(readsCategories)
        console.log('categoriesPromise', categoriesPromise)
        setCategories(categoriesPromise)
        setCategoriesFilter(categoriesPromise)
        setState(prev => { return { ...prev, isDataFetched: true } })
    }

    const onHandlerJoinCategory = (categoryID, categoryName) => {
        // const pushAction = StackActions.push('CategoryDetail', { id: categoryID, name: categoryName })
        props.navigation.navigate('CategoryDetail', { id: categoryID, name: categoryName })
    }

    const onOpenShoppingCart = () => {
        // const pushAction = StackActions.push('ShoppingCart')
        props.navigation.navigate('ShoppingCart')
    }

    const renderChild = ({ item, index }) => {

        const inputRange = [(index - 1) * FULL_SIZE, index * FULL_SIZE, (index + 1) * FULL_SIZE]
        const translateX = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [ITEM_WIDTH, 0, -ITEM_WIDTH]
        })
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.1, 1]
        })
        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1, 0.8]
        })

        const productsLength = item.products?.length

        return (
            <AnimatedAppearance index={index} horizontal={true}>
                <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => { props.navigation.navigate('CategoryDetail2', { imageUri: item.imageUri }) }}
                >
                    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: RADIUS }]}>
                        <Animated.Image
                            source={{ uri: item.imageUri }}
                            style={[StyleSheet.absoluteFill, { transform: [{ scale }], opacity }]}
                            resizeMode='cover'
                        />
                    </View>
                    <Animated.View style={[styles.labelContainer, { transform: [{ translateX }] }]}>
                        <Text style={styles.textName}>{item.name}</Text>
                    </Animated.View>
                    <View style={[styles.valueContainer, { backgroundColor: item.bg }]}>
                        <Text style={[styles.textValue, { color: item.color }]}>{productsLength}</Text>
                    </View>
                </TouchableOpacity>
            </AnimatedAppearance>
        )
    }

    const renderBottomChild = ({ item, index }) => {
        return (
            <View style={{
                height: 120,
                borderRadius: 12,
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                backgroundColor: '#fff',
                marginHorizontal: 16,
                marginVertical: 8,
            }}>
                <Image
                    source={{ uri: item.imageUri }}
                    resizeMode='cover'
                    style={{ width: 80, height: 80 }}
                />
                <View style={{ flex: 1, paddingHorizontal: 16 }}>
                    <Text style={{ color: '#000', fontWeight: '300', fontSize: scale(16), lineHeight: scale(22) }}>
                        {item.heading}
                    </Text>
                    <Text style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(12), lineHeight: scale(16) }}>{`${item.description}`}</Text>
                    <Text style={{ color: '#00f', fontWeight: 'bold', fontSize: scale(16), lineHeight: scale(22) }}>
                        {`$ ${formatMoney(item.price, 0)}`}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.safeAreaContainer}>
            <Animated.FlatList
                data={categoriesFilter}
                keyExtractor={(item, index) => item.doc.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={FULL_SIZE}
                decelerationRate={'fast'}
                onScroll={
                    Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: true }
                    )
                }
                renderItem={renderChild}
                contentContainerStyle={{ alignItems: 'center' }}
                style={{ flexGrow: 0, }}
            />
            {!!products && products.length > 0 &&
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={products}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderBottomChild}
                        style={{ flexGrow: 0, }}
                    />
                </View>
            }
        </View >
    );
}

export default CategoryScreen;

const styles = StyleSheet.create({
    safeAreaContainer: { flex: 1, },
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        margin: SPACING,
    },
    labelContainer: {
        backgroundColor: 'tranparent',
        width: ITEM_WIDTH * 0.8,
        position: 'absolute',
        top: SPACING,
        left: SPACING,
    },
    textName: {
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: '800',
        fontSize: 25
    },
    valueContainer: {
        width: 48, height: 48, borderRadius: 24,
        position: 'absolute', bottom: SPACING, left: SPACING,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#fff'
    },
    text: {
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: '800',
        fontSize: 16,
    }
});