import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import IonsIcon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import TouchableScale from 'react-native-touchable-scale';
import formatDistance from 'date-fns/formatDistanceToNow'
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import ActionSheet from "react-native-actions-sheet";

import { moderateScale, scale, verticalScale } from 'utils/scaleSize';
import { formatCount, formatDistanceToNowVi, guidGenerator } from 'utils/function'

// const colors = ['#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71', '#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71', '#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71'];
let _isReachedTop
const Commment = ({ fullName, comments, totalLike = 0, totalView = 0, addDiaryComment }) => {
    console.log('comments', comments)
    const actionSheetRef = useRef<ActionSheet>(null);
    const scrollViewRef = useRef();
    const actionSheetScrollRef = actionSheetRef.current?.scrollViewRef;

    const [state, setState] = useState({
        isReady: false,
        status: false,
        quality: 0,
        error: '',
        like: false,
        textComment: '',
    })

    const [newComments, setNewComments] = useState([])

    useEffect(() => {
        setNewComments(!!comments ? comments : [])
    }, [comments])

    const onHandlerLike = (type) => {
        setState(prev => {
            return {
                ...prev,
                [type]: !prev[type],
            }
        })
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

    const onChangeTextComment = (value) => {
        setState(prev => { return { ...prev, textComment: value } })
    }

    const onSendComment = () => {
        const newComment = {
            fullName: fullName,
            content: state.textComment,
            dateCreated: new Date(),
            commentRef: guidGenerator()
        }
        if (addDiaryComment) {
            addDiaryComment(state.textComment)
        }
        const arrays = [newComment, ...newComments]
        setNewComments(arrays)
        onChangeTextComment('')
    }

    return (
        <View >
            <View style={{
                flexDirection: 'row',
                width: '100%',
                padding: scale(5),
                justifyContent: 'space-around',
                alignItems: 'flex-end',
                borderBottomWidth: scale(1),
                height: verticalScale(64),
            }}>
                <View style={{ height: '100%', justifyContent: 'center' }}>
                    <TouchableScale onPress={() => onHandlerLike('like')}>
                        <AntDesignIcon
                            name='like2' size={20}
                            color={!!state.like ? '#185ADB' : '#171717'}
                            style={{ width: moderateScale(48) }}
                        />
                    </TouchableScale>
                    <Text style={{ fontSize: 12, color: !!state.like ? '#185ADB' : '#171717' }}>{`${formatCount(totalLike)} lượt thích`}</Text>
                </View>
                <View style={{ height: '100%', justifyContent: 'center' }}>
                    <TouchableScale>
                        <AntDesignIcon
                            name='eye' size={20}
                            color={'#171717'}
                            style={{ width: moderateScale(48) }}
                        />
                    </TouchableScale>
                    <Text style={{ fontSize: 12, color: !!state.dislike ? '#185ADB' : '#171717' }}>{`${formatCount(totalView)} lượt xem`}</Text>
                </View>
                <View style={{ height: '100%', justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            actionSheetRef.current?.show();
                        }}
                        style={styles.btn}>
                        <IonsIcon name='chatbox-ellipses-outline' size={20} style={{ marginRight: scale(5) }} />
                        <Text style={{ color: '#6a6a6a', fontSize: scale(14) }}>{`${formatCount(newComments.length)} bình luận`}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ActionSheet
                initialOffsetFromBottom={0.7}
                ref={actionSheetRef}
                statusBarTranslucent
                onPositionChanged={onHasReachedTop}
                bounceOnOpen={true}
                drawUnderStatusBar={false}
                bounciness={4}
                gestureEnabled={true}
                defaultOverlayOpacity={0.3}>
                <View style={{ paddingHorizontal: 12, }}>
                    <View onMoveShouldSetResponderCapture={onMoveShouldSetResponderCapture}>
                        <ScrollView
                            ref={scrollViewRef}
                            onScroll={onScroll}
                            onTouchEnd={onScrollEnd}
                            onMomentumScrollEnd={onScrollEnd}
                            scrollEventThrottle={2}
                            style={styles.scrollview}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <TextInput
                                    style={styles.input}
                                    multiline={true}
                                    placeholder="Nhập bình luận ở đây..."
                                    value={state.textComment}
                                    onChangeText={(value) => onChangeTextComment(value)}
                                />
                                {!!state.textComment &&
                                    <TouchableScale onPress={() => onSendComment()}>
                                        <IonsIcon name='send' size={24} color={'#00f'} />
                                    </TouchableScale>
                                }
                            </View>
                            <FlatList
                                data={newComments}
                                keyExtractor={(item, index) => item.commentRef.toString()}
                                bounces={false}
                                showsVerticalScrollIndicator
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ marginVertical: scale(10), }}>
                                            <View style={{
                                                height: verticalScale(36),
                                                flexDirection: 'row',
                                            }}>
                                                {!!item.imgURL ?
                                                    <Image
                                                        source={{ uri: item.imgURL }}
                                                        style={{ width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20) }}
                                                        resizeMode={'cover'}
                                                    />
                                                    :
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.circle,
                                                            {
                                                                backgroundColor: '#3da4ab',
                                                            },
                                                        ]}
                                                    />
                                                }
                                                <View style={{ flexDirection: 'column', width: '100%', padding: scale(5) }}>
                                                    <Text style={{ fontSize: scale(14), fontWeight: '500', paddingHorizontal: scale(4) }}>{item.fullName}</Text>
                                                    <Text style={{ fontSize: scale(12), fontWeight: '300', paddingHorizontal: scale(8) }}>{item.content}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', width: '100%', padding: scale(5), paddingLeft: moderateScale(56) }}>
                                                {/* <AntDesignIcon name='user' size={12} style={{ marginRight: scale(5) }} /> */}
                                                <Text style={{ color: '#6a6a6a', fontSize: scale(10) }}>{`${formatDistanceToNowVi(item.dateCreated)}`}</Text>
                                                <Text style={{ color: '#6a6a6a', fontSize: scale(10) }}>{` lúc ${getHours(item.dateCreated)}:${getMinutes(item.dateCreated)}`}</Text>
                                            </View>
                                        </View>
                                    )
                                }}
                            />
                            <View style={styles.footer} />
                        </ScrollView>
                    </View>
                </View>
            </ActionSheet>
        </View>
    )
}

export default Commment

const styles = StyleSheet.create({
    footer: {
        height: 100,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    placeholder: {
        height: 15,
        backgroundColor: '#f0f0f0',
        marginVertical: 15,
        borderRadius: 5,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    btnLeft: {
        width: 30,
        height: 30,
        backgroundColor: '#f0f0f0',
        borderRadius: 100,
    },
    input: {
        width: '90%',
        minHeight: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    container: {
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
});