import React, { useEffect, useState, useRef } from 'react'
import { View, Text, FlatList, ScrollView, StyleSheet, TouchableOpacity, TextInput, Image, Keyboard } from 'react-native'
import LottieView from 'lottie-react-native';
import { StackActions } from '@react-navigation/native';
import ActionSheet from "react-native-actions-sheet";
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import TouchableScale from 'react-native-touchable-scale';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { Comment, Content, Header } from 'components/dirary'
import AddIcon from 'components/common/icon/AddIcon'
import BackIcon from 'components/common/icon/BackIcon';

import { calcHeight, calcWidth, verticalScale, moderateScale, scale } from 'utils/scaleSize'

import { guidGenerator } from 'utils/function'
import HeaderTitle from 'components/common/Header/HeaderTitle';

const colors = ['#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71', '#F08FC0'];
let _isReachedTop
const DiaryScreen = (props) => {
    const db = firestore()
    const entityRef = db.collection('diaries')

    const actionSheetRef = useRef();
    const scrollViewRef = useRef();
    const actionSheetScrollRef = actionSheetRef.current?.scrollViewRef;

    const [state, setState] = useState({
        isDataFetched: false,
        userID: '',
        userName: '',
        user: {},
        level: '',
        title: '',
        content: '',
    })

    const [contents, setContents] = useState([])
    const [images, setImages] = useState([])

    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.fullName,
                    user: user,
                    level: user.level,
                }
            })
            const unsubscribeUserList = entityRef.onSnapshot(getRealtimeCollectionDiaryList, err => Alert.alert(error))
            return () => {
                unsubscribeUserList()
            }
        })
    }, [])

    useEffect(() => {
        if (!!state.userID) {

        }
    }, [state.userID])


    useEffect(() => {
        if (state.level == 1) {
            props.navigation.setOptions({
                // headerLeft: () => <BackIcon navigation={props.navigation} onOpen={() => showAddNewDiary()} />,
                headerTitle: () => <HeaderTitle title={`Nhật ký`} />,
                headerRight: () => <AddIcon navigation={props.navigation} onOpen={() => showAddNewDiary()} />,
            });
        }
    }, [state.level])

    const getRealtimeCollectionDiaryList = async (querySnapshot) => {
        // setState(prev => { return { ...prev, isDataFetched: false } })
        let reads = querySnapshot.docs.map(async (doc) => {
            const diary = doc.data()
            // const querySnapshotLike = await entityRef.doc(doc.id).collection('likes').get()
            // const querySnapshotComment = await entityRef.doc(doc.id).collection('comments').get()
            // const querySnapshotImage = await entityRef.doc(doc.id).collection('images').get()

            const [querySnapshotLike, querySnapshotComment, querySnapshotImage] = await Promise.all([
                entityRef.doc(doc.id).collection('likes').get(),
                entityRef.doc(doc.id).collection('comments').get(),
                entityRef.doc(doc.id).collection('images').get()
            ])

            let comments = []
            if (querySnapshotComment.docs.length > 0) {
                comments = querySnapshotComment.docs.map((doc) => {
                    const comment = doc.data()
                    return {
                        ...comment,
                        commentRef: doc.id,
                        fullName: comment.createdByName,
                        dateCreated: comment.createdAt.toDate()
                    }
                })
            }
            let images = []
            if (querySnapshotImage.docs.length > 0) {
                images = querySnapshotImage.docs.map((doc) => {
                    const image = doc.data()
                    return {
                        ...image,
                        imageRef: doc.id,
                        url: image.imageUrl,
                        base64: image.imageBase64
                    }
                })
            }

            return {
                ...diary,
                docRef: doc.id,
                fullName: diary.createdByName,
                imgBase64: diary.createdAvatarBase64,
                dateCreated: diary.createdAt.toDate(),
                title: diary.title,
                content: diary.content,
                totalLike: querySnapshotLike.docs.length,
                totalComment: querySnapshotComment.docs.length,
                comments: comments,
                images: images
            }
        })
        let result = await Promise.all(reads)
        const diaries = result
            .filter(e => { return !!e && Object.keys(e).length > 0 })
            .sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
        setContents(diaries)
        setState(prev => { return { ...prev, isDataFetched: true } })
        console.log('isDataFetched - 2', diaries)
    }

    const onPressItem = (item) => {
        console.log('item', item)
        // const pushAction = StackActions.push('DiaryDetail',
        //     { dataInfo: item, userID: state.userID, userName: state.userName }
        // )
        props.navigation.navigate('DiaryDetail',
            { dataInfo: item, userID: state.userID, userName: state.userName }
        )
    }

    const showAddNewDiary = () => {
        console.log('showAddNewDiary')
        actionSheetRef.current?.show()
    }

    const changeScrollEnabled = (parent) => {
        // We only need this on Android, iOS works great with Child Scroll Views.
        if (Platform.OS !== 'android') return;
        actionSheetScrollRef?.current?.setNativeProps({
            scrollEnabled: parent,
        });
    }

    const onScroll = () => {
        changeScrollEnabled(false);
    };

    /**
     * If the ActionSheet has not reached top,
     * we want to keep the parent scroll enabled
     */
    const onHasReachedTop = hasReachedTop => {

        if (!hasReachedTop) {
            _isReachedTop = false;
            changeScrollEnabled(!hasReachedTop);
            return;
        }
        _isReachedTop = true;
    };

    /**
     * If the user has touched the ScrollView Area, disable scroll on ActionSheet
     * so that child scrollviews can scroll.
     * @returns
     */
    const onMoveShouldSetResponderCapture = () => {
        if (!_isReachedTop) return;
        changeScrollEnabled(false);
        return false;
    };

    /**
     * Whenever the scroll ends we want to enable scrolling for ActionSheet.
     */
    const onScrollEnd = () => {
        changeScrollEnabled(true);
        actionSheetRef.current?.handleChildScrollEnd();
    };

    const onChangeText = (name, value) => {
        setState(prev => { return { ...prev, [name]: value } })
    }

    const closeNewDiary = () => {
        setState(prev => { return { ...prev, title: '', content: '' } })
        setImages([])
    }

    const addNewDiary = () => {
        let { title, content } = state
        entityRef.add({
            title: title,
            content: content,
            createdAt: new Date(),
            createdBy: state.userID,
            createdByName: state.userName,
            createdAvatarBase64: !!images && images.length > 0 ? images[0].data : ''
        }).then((docRef) => {
            images.map(element => {
                entityRef.doc(`${docRef.id}`).collection('images').add({
                    imageBase64: !!element.data ? element.data : '',
                    imageUrl: !!element.url ? element.url : '',
                    createdAt: new Date(),
                    createdBy: state.userID,
                    createdByName: state.userName,
                }).then(_doc => {
                    Keyboard.dismiss()
                }).catch((error) => {
                    console.log("Error adding document image: ", error);
                })
            })
        }).catch((error) => {
            console.log("Error adding document: ", error);
        });

        setState(prev => { return { ...prev, title: '', content: '' } })
        setImages([])
    }

    const handlerImagePicker = (index) => {
        if (index == 0) {
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                includeBase64: true,
                compressImageQuality: 0.5,
                compressImageMaxWidth: 600,
                compressImageMaxHeight: 800,
            }).then(image => {
                const element = { ...image, imageRef: guidGenerator() }
                const newImages = [element, ...images]
                setImages(newImages)
            });
        }
        if (index == 1) {
            ImagePicker.openPicker({
                multiple: true,
                includeBase64: true,
                compressImageQuality: 0.5,
                compressImageMaxWidth: 600,
                compressImageMaxHeight: 800,
            }).then(result => {
                result.map(e => {
                    e.imageRef = guidGenerator()
                    return e
                })
                const newImages = [...result, ...images]
                console.log('ImagePicker.openPicker', newImages);
                setImages(newImages)
            });
        }
    }

    return (
        <>
            <View style={styles.container}>
                {!!state.isDataFetched ?
                    <FlatList
                        data={contents}
                        extraData={contents}
                        keyExtractor={(item, index) => item.docRef.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View >
                                    <Header
                                        fullName={item.fullName}
                                        imgURL={item.imgURL}
                                        imgBase64={item.imgBase64}
                                        dateCreated={item.dateCreated}
                                        onPressItem={() => onPressItem(item)}
                                    />
                                    <Content
                                        title={item.title}
                                        content={item.content}
                                        images={item.images}
                                        onPressItem={() => onPressItem(item)}
                                    />
                                    <Comment
                                        totalLike={item.totalLike}
                                        totalComment={item.totalComment}
                                        totalView={item.totalComment}
                                        onPressItem={() => onPressItem(item)}
                                    />
                                </View>
                            )
                        }}
                    />
                    :
                    <View style={{ flex: 1, justifyContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <LottieView
                            source={require('@assets/animations/dino-loading.json')}
                            colorFilters={[{
                                keypath: "button",
                                color: "#F00000"
                            }, {
                                keypath: "Sending Loader",
                                color: "#F00000"
                            }]}
                            style={{ width: calcWidth(90), height: calcWidth(90) }}
                            autoPlay
                            loop
                        />
                    </View>
                }
            </View>
            <ActionSheet
                ref={actionSheetRef}
                initialOffsetFromBottom={0.7}
                gestureEnabled={true}
                statusBarTranslucent
                // onPositionChanged={onHasReachedTop}
                bounceOnOpen={true}
                drawUnderStatusBar={false}
                bounciness={4}
                defaultOverlayOpacity={0.3}
                closeOnTouchBackdrop={false}
            >
                <View style={{ paddingHorizontal: 12, }} >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}
                    >
                        <TouchableScale
                            onPress={() => {
                                closeNewDiary()
                                actionSheetRef.current?.hide();
                            }}
                        >
                            <AntDesignIcon name={'closecircleo'} size={scale(24)} color={'#f00'} />
                        </TouchableScale>
                        <TouchableScale onPress={() => { handlerImagePicker(0) }}
                            style={[
                                styles.circle,
                                {
                                    marginHorizontal: 5,
                                    backgroundColor: '#E8F6EF',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                },
                            ]}
                        >
                            <EntypoIcon name={'camera'} size={scale(16)} />
                        </TouchableScale>
                        <TouchableScale onPress={() => { handlerImagePicker(1) }}
                            style={[
                                styles.circle,
                                {
                                    marginHorizontal: 5,
                                    backgroundColor: '#E8F6EF',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                },
                            ]}
                        >
                            <EntypoIcon name={'images'} size={scale(16)} />
                        </TouchableScale>
                        <TouchableScale
                            onPress={() => {
                                addNewDiary()
                                actionSheetRef.current?.hide();
                            }}
                        >
                            <AntDesignIcon name={'checkcircleo'} size={scale(24)} color={'#00f'} />
                        </TouchableScale>
                    </View>
                    <View onMoveShouldSetResponderCapture={onMoveShouldSetResponderCapture} >
                        <ScrollView
                            ref={scrollViewRef}
                            nestedScrollEnabled={true}
                            onScroll={onScroll}
                            onTouchEnd={onScrollEnd}
                            onScrollEndDrag={onScrollEnd}
                            onScrollAnimationEnd={onScrollEnd}
                            onMomentumScrollEnd={onScrollEnd}
                            scrollEventThrottle={2}
                            style={styles.scrollview}
                        >
                            <FlatList
                                data={images}
                                keyExtractor={(item, index) => item.imageRef.toString()}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ padding: scale(5) }}>
                                            <Image
                                                source={{ uri: `data:image/png;base64,${item.data}` }}
                                                style={{ width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24) }}
                                                resizeMode={'cover'}
                                            />
                                            <TouchableScale style={{ position: 'absolute', right: 0, }}>
                                                <AntDesignIcon
                                                    name={'closecircleo'} color={'#f00'} size={scale(14)}
                                                />
                                            </TouchableScale>
                                        </View>
                                    )
                                }}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <TextInput
                                    style={styles.inputTitle}
                                    multiline={true}
                                    placeholder="Nhập tiêu đề bài viết ở đây..."
                                    value={state.title}
                                    onChangeText={(value) => onChangeText('title', value)}
                                // enablesReturnKeyAutomatically
                                />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <TextInput
                                    style={styles.inputContent}
                                    multiline={true}
                                    placeholder="Nhập nội dung bài viết ở đây..."
                                    value={state.content}
                                    onChangeText={(value) => onChangeText('content', value)}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ActionSheet>
        </>
    )
}

export default DiaryScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerScroll: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    scrollview: {
        width: '100%',
        padding: 12,
    },
    btn: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#fe8a71',
        paddingHorizontal: 10,
        borderRadius: 5,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0.3 * 4, height: 0.5 * 4 },
        shadowOpacity: 0.2,
        shadowRadius: 0.7 * 4,
    },
    safeareview: {
        justifyContent: 'center',
        flex: 1,
    },
    btnTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    inputTitle: {
        width: '90%',
        minHeight: verticalScale(50),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    inputContent: {
        width: '90%',
        minHeight: calcHeight(40),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
})