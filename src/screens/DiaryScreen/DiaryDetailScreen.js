import React, { useEffect, useState, Fragment } from 'react'
import { View, Text, FlatList, Image, StyleSheet, ScrollView, Keyboard } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { Comment, Content, Header } from 'components/dirary/diaryDetail'
import BackIcon from 'components/common/icon/BackIcon';
import HeaderTitle from 'components/common/Header/HeaderTitle';

const DiaryDetail = (props) => {
    const entityRef = firestore().collection('diaries')

    const [state, setState] = useState({
        userID: '',
        userName: '',
        docRef: '',
        createdAt: '',
        createdBy: '',
        createdByName: '',
        createdAvatarBase64: '',
        title: '',
        content: '',
        comments: [],
        images: [],
    })

    useEffect(() => {
        const dataInfo = props.route.params.dataInfo
        if (!!dataInfo && Object.keys(dataInfo).length > 0) {
            const { docRef, createdAt, createdBy, createdByName, createdAvatarBase64,
                title, content, comments, images, totalLike, totalComment } = dataInfo
            setState(prev => {
                return {
                    ...prev,
                    docRef, createdAt: createdAt.toDate(), createdBy,
                    createdByName, createdAvatarBase64,
                    title, content, comments, images, totalLike, totalComment
                }
            })
        }
        const userID = props.route.params.userID
        const userName = props.route.params.userName
        setState(prev => { return { ...prev, userID, userName } })
    }, [])

    useEffect(() => {
        if (props.navigation) {
            props.navigation.setOptions({
                headerTitle: () => <HeaderTitle title={`Nhật ký`} />,
            });
        }
    }, [props.navigation])

    const addDiaryComment = (textComment) => {
        entityRef.doc(`${state.docRef}`).collection('comments').add({
            content: textComment,
            createdAt: new Date(),
            createdBy: state.userID,
            createdByName: state.userName,
        }).then(_doc => {
            Keyboard.dismiss()
        }).catch((error) => {
            console.log("Error adding document image: ", error);
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Header
                    fullName={state.createdByName}
                    imgURL={''}
                    imgBase64={state.createdAvatarBase64}
                    dateCreated={state.createdAt}
                />
                <Content
                    title={state.title}
                    content={state.content}
                    images={state.images}
                />
                <Comment
                    fullName={state.userName}
                    comments={state.comments}
                    totalLike={state.totalLike}
                    totalComment={state.totalComment}
                    totalView={state.totalComment}
                    addDiaryComment={addDiaryComment}
                />
            </ScrollView>
        </View>
    )
}

export default DiaryDetail

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})