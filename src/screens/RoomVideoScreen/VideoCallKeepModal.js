import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore';
import InCallManager from 'react-native-incall-manager';

const BG_IMG = 'https://images.pexels.com/photos/2033997/pexels-photo-2033997.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'

const VideoCallKeepModal = () => {

    const navigation = useNavigation()
    const route = useRoute()

    const [state, setState] = useState({
        roomID: '',
        displayName: ''
    });

    useEffect(() => {
        InCallManager.startRingtone("_BUNDLE_");
        return () => {
            InCallManager.stopRingtone();
        }
    }, [])

    useEffect(() => {
        const { roomID, displayName } = route.params
        setState({ roomID, displayName })

        const unsubscribe = firestore().collection('videorooms').onSnapshot((snapshot) => {
            if (snapshot) {
                snapshot.docChanges().forEach(change => {
                    const id = change.doc.id
                    if (change.type == 'removed' && id == roomID) {
                        onGoBack()
                    }
                })
            }
        })
        return () => {
            unsubscribe();
        }
    }, [route])

    const onGoBack = () => {
        InCallManager.stopRingtone();
        navigation.goBack()
    }

    const onDecline = async () => {
        const roomRef = await firestore().collection('videorooms').doc(state.roomID);
        if (roomRef) {
            const callerCandidatesCollection = await roomRef.collection('callerCandidates').get();
            if (callerCandidatesCollection) {
                callerCandidatesCollection.forEach(async (candidate) => {
                    await candidate.ref.delete()
                });
            }
            roomRef.delete()
        }
    }

    const onAccept = () => {
        InCallManager.stopRingtone();
        navigation.navigate('VideoJoinModal',
            {
                roomID: state.roomID,
                displayName: state.displayName
            },
        )
    }

    return (
        <View style={{
            flex: 1, alignItems: 'center', justifyContent: 'center',
            paddingVertical: 64
        }}>
            <Image
                source={{ uri: BG_IMG }}
                style={StyleSheet.absoluteFill}
                blurRadius={50}
            />
            <View style={{
                flex: 1, alignItems: 'center', justifyContent: 'flex-start',
                width: '100%',
            }}>
                <Text style={{ fontSize: 30 }}>{`LKExpress Calling....`}</Text>
                <Text style={{ fontSize: 20 }}>{state.displayName}</Text>
            </View>
            <View style={{
                flex: 1,
                alignItems: 'center', justifyContent: 'center',
            }}>
                <View style={{
                    flex: 1, flexDirection: 'row', width: '100%',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity
                            style={{
                                width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center',
                                backgroundColor: '#f00'
                            }}
                            onPress={onDecline}
                        >
                            <MaterialCommunityIcon name={"phone-hangup"} size={40} color={'#fff'} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, padding: 8, color: '#fff' }}>{`Decline`}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity
                            style={{
                                width: 64, height: 64, alignItems: 'center', justifyContent: 'center',
                                borderRadius: 32, backgroundColor: '#0f0'
                            }}
                            onPress={onAccept}
                        >
                            <MaterialCommunityIcon name={"phone"} size={40} color={'#fff'} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, padding: 8, color: '#fff' }}>{`Accept`}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default VideoCallKeepModal