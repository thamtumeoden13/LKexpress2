import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Image,
    StatusBar,
    Alert,
    FlatList
} from 'react-native';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import ShoppingCartIcon from 'components/common/icon/ShoppingCartIcon'
import AddIcon from 'components/common/icon/AddIcon'
import { ModalCenterAlert } from "components/common/modal/ModalCenterAlert";
import { AddCategory } from 'components/category/modalInputForm'
import HeaderSearchInput from 'components/common/Header/SearchInput'
import AccordionMenu from 'components/common/listCommon/AccordionMenu'
import BackIcon from 'components/common/icon/BackIcon';

const db = firestore()
const entityRef = db.collection('categories')
const entityProductRef = db.collection('products')

const CategoryScreen = (props) => {

    const [state, setState] = useState({
        isLoading: true,
        userID: '',
        level: '',
        isDataFetched: false
    })

    const [alert, setAlert] = useState({
        isVisible: false,
        disabledIcon: false,
        modalAlert: {
            type: 'error',
            title: '',
            content: '',
        },
        typeModalInputForm: -1
    })

    const [categories, setCategories] = useState([])
    const [categoriesFilter, setCategoriesFilter] = useState([])

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
        categories.map(async (e) => {
            e.subCategories = []
            if (e.productsRef) {
                const reads = e.productsRef.map(async (f) => {
                    const querySnapshot2 = await entityProductRef.doc(f).get();
                    const data = querySnapshot2.data()
                    return {
                        id: f,
                        name: data.heading
                    }
                })
                const products = await Promise.all(reads)
                e.subCategories = products
            }
            return e
        })
        setCategories(categories)
        setCategoriesFilter(categories)
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

    const onCloseModalAlert = () => {
        setAlert(prev => {
            return {
                ...prev,
                isVisible: false,
                modalAlert: {
                    type: 'error',
                    content: ''
                },
                typeModalInputForm: -1
            }
        })
    }

    const renderChild = ({ item }) => (
        <ListItem
            Component={TouchableScale}
            friction={90} //
            tension={100} // These props are passed to the parent component (here TouchableScale)
            activeScale={0.95} //
            linearGradientProps={{
                colors: ['#fdbaf8', '#fdbaf8'],
                start: { x: 1, y: 0 },
                end: { x: 0.2, y: 0 },
            }}
            ViewComponent={LinearGradient} // Only if no expo
            style={{ marginTop: verticalScale(5) }}
            containerStyle={{ paddingVertical: verticalScale(10) }}
            onPress={() => onHandlerJoinCategory(item.doc, item.name)}
        >
            <Avatar rounded source={{ uri: item.avatarURL }} />
            <ListItem.Content>
                <ListItem.Title style={{ color: '#0a043c', fontWeight: 'bold', fontSize: scale(14) }}>
                    {item.name}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: '#0a043c', fontStyle: 'italic', fontSize: scale(12) }}>
                    {`${item.createdByName}`}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron name="right" type='antdesign' color="#0a043c" />
        </ListItem>
    )

    const keyExtractor = (item, index) => index.toString()

    const { isVisible, disabledIcon, typeModalInputForm, modalAlert } = alert
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* <StatusBar backgroundColor="gray" barStyle="dark-content" hidden />
            <ModalCenterAlert
                isVisible={isVisible}
                disabledIcon={disabledIcon}
                typeModal={modalAlert.type}
                titleModal={modalAlert.title}
                contentModal={modalAlert.content}
                childComponent={renderModalInputForm(typeModalInputForm)}
                onCloseModalAlert={onCloseModalAlert}
            />
            <View style={styles.container}>
                {!state.isDataFetched ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieView
                            source={require('@assets/animations/890-loading-animation.json')}
                            colorFilters={[{
                                keypath: "button",
                                color: "#F00000"
                            }, {
                                keypath: "Sending Loader",
                                color: "#F00000"
                            }]}
                            style={{ width: calcWidth(30), height: calcWidth(30), justifyContent: 'center' }}
                            autoPlay
                            loop
                        />
                    </View>
                    :
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={categoriesFilter}
                        extraData={categoriesFilter}
                        renderItem={renderChild}
                    />
                }
            </View> */}
            <AccordionMenu result={categoriesFilter} onPressItem={onHandlerJoinCategory} />
        </SafeAreaView>
    );
}

export default CategoryScreen;

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