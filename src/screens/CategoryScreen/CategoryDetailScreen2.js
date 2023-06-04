import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    FlatList,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import ShoppingCartIcon from 'components/common/icon/ShoppingCartIcon'
import AddIcon from 'components/common/icon/AddIcon'
import { ModalCenterAlert } from "components/common/modal/ModalCenterAlert";
import { AddCategory } from 'components/category/modalInputForm'
import HeaderSearchInput from 'components/common/Header/SearchInput'
import AccordionMenu from 'components/common/listCommon/AccordionMenu'
import BackIcon from 'components/common/icon/BackIcon';
import { themeOptions } from 'constants/theme'
import { AuthContext } from '../../utils'

const { ITEM_WIDTH, ITEM_HEIGHT, SPACING, RADIUS, FULL_SIZE } = themeOptions

const db = firestore()
const entityRef = db.collection('categories')
const entityProductsRef = db.collection('products')

const CategoryDetailScreen = (props) => {

    const [state, setState] = useState({
        isLoading: true,
        imageUri: '',
    })
    const [categories, setCategories] = useState([])

    const { addShoppingCart } = useContext(AuthContext)

    useEffect(() => {
        const imageUri = props.route.params.imageUri
        setState(prev => {
            return {
                ...prev,
                imageUri,
            }
        })
    }, [])


    const keyExtractor = (item, index) => index.toString()
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            {/* <AccordionMenu result={categoriesFilter} onPressItem={onHandlerJoinCategory} /> */}
            <View style={StyleSheet.absoluteFill, {
                paddingHorizontal: SPACING,
                // top: 50,
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