import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Animated,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';

import BackIcon from 'components/common/icon/BackIcon';
import { themeOptions } from 'constants/theme'
import { AuthContext } from '../../utils'
import AnimatedAppearance from 'components/common/button/AnimatedAppearance';
import TouchableScale from 'components/common/button/TouchableScale';
import { scale } from 'utils/scaleSize';
import { formatMoney } from 'utils/function';

const { ITEM_WIDTH, ITEM_HEIGHT, SPACING, RADIUS, FULL_SIZE } = themeOptions

const db = firestore()
const entityRef = db.collection('categories')
const entityProductsRef = db.collection('products')

const CategoryDetailScreen = (props) => {

    const [state, setState] = useState({
        isLoading: true,
        imageUri: '',
        products: []
    })
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const { imageUri, products } = props.route.params.item
        setState(prev => {
            return {
                ...prev,
                imageUri,
                products
            }
        })
    }, [])

    const handlerCategoryDetail = (item) => {
        props.navigation.navigate('CategoryDetail', { item})
    }

    const renderBottomChild = ({ item, index }) => {
        return (
            <AnimatedAppearance index={index}>
                <TouchableScale
                    scaleTo={0.97}
                    onPress={() => { handlerCategoryDetail(item) }}
                >
                    <View style={{
                        height: 120,
                        borderRadius: 12,
                        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                        backgroundColor: 'rgba(256,256,256,0.6)',
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
                            <Text style={{ color: '#6a6a6a', fontStyle: 'italic', fontSize: scale(12), lineHeight: scale(16) }}>{`${item.description}`}</Text>
                            <Text style={{ color: '#00f', fontWeight: 'bold', fontSize: scale(16), lineHeight: scale(22) }}>
                                {`$ ${formatMoney(item.price, 0)}`}
                            </Text>
                        </View>
                    </View>
                </TouchableScale>
            </AnimatedAppearance>
        )
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={StyleSheet.absoluteFill, {
                paddingHorizontal: SPACING,
                left: SPACING, zIndex: 2
            }}>
                <BackIcon />
            </View>
            <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: RADIUS }]}>
                <Animated.Image
                    source={{ uri: state.imageUri }}
                    style={[StyleSheet.absoluteFill]}
                    resizeMode='cover'
                />
            </View>
            {!!state.products && state.products.length > 0 &&
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={state.products}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderBottomChild}
                        style={{ flexGrow: 0, }}
                    />
                </View>
            }
        </SafeAreaView >
    );
}

export default CategoryDetailScreen;

const styles = StyleSheet.create({
    safeAreaContainer: { flex: 1 },
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