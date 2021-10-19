import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import InCallManager from 'react-native-incall-manager';
import { Button } from 'react-native-elements'

import { RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc';
import { db } from '../../utils/firebase';
import HeaderTitle from 'components/common/Header/HeaderTitle';

const configuration = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

export default function JoinScreen({ route }) {

    const navigation = useNavigation()
    const [state, setState] = useState({
        roomId: '',
        startLocalComplete: false,
        startCallComplete: false,
    })


    const [localStream, setLocalStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [cachedLocalPC, setCachedLocalPC] = useState();

    const [isMuted, setIsMuted] = useState(false);
    const [isVideo, setIsVideo] = useState(false);

    useEffect(() => {
        const roomId = route.params.roomId
        setState(prev => { return { ...prev, roomId, } })
        navigation.setOptions({
            headerTitle: () => <HeaderTitle title={`Join Room : ${roomId}`} />,
        });
    }, [route]);

    useEffect(() => {
        if (!!state.roomId) {
            startLocalStream()
        }
    }, [state.roomId])

    useEffect(() => {

        if (!!state.roomId) {
            const roomRef = db.collection('videorooms').doc(state.roomId);
            if (roomRef) {
                const unsubscribeDeletedCallee = roomRef.collection('calleeCandidates').onSnapshot((snapshot) => {
                    if (snapshot) {
                        snapshot.docChanges().forEach(change => {
                            if (change.type == 'removed') {
                                onBackPress()
                            }
                        })
                    }
                })
                const unsubscribeDeletedCaller = roomRef.collection('callerCandidates').onSnapshot((snapshot) => {
                    if (snapshot) {
                        snapshot.docChanges().forEach(change => {
                            if (change.type == 'removed') {
                                onBackPress()
                            }
                        })
                    }
                })
                return () => {
                    unsubscribeDeletedCallee();
                    unsubscribeDeletedCaller();
                }
            }
        }

    }, [state.roomId])

    useEffect(() => {
        if (!!localStream && !!state.roomId) {
            joinCall(state.roomId)
        }
    }, [localStream, state.roomId])

    const onBackPress = async () => {
        if (cachedLocalPC) {
            cachedLocalPC.removeStream(localStream);
            cachedLocalPC.close();
        }

        if (localStream) {
            localStream.getTracks().forEach(t => t.stop());
        }

        setLocalStream();
        setRemoteStream();
        setCachedLocalPC();
        InCallManager.stop();

        const roomRef = await db.collection('videorooms').doc(state.roomId);
        if (roomRef) {
            const calleeCandidatesCollection = await roomRef.collection('calleeCandidates').get();
            if (calleeCandidatesCollection) {
                calleeCandidatesCollection.forEach(async (candidate) => {
                    await candidate.ref.delete()
                });
            }
            const callerCandidatesCollection = await roomRef.collection('callerCandidates').get();
            if (callerCandidatesCollection) {
                callerCandidatesCollection.forEach(async (candidate) => {
                    await candidate.ref.delete()
                });
            }
            roomRef.delete()
        }

        const parentRoute = navigation.getParent()
        if (!parentRoute) {
            navigation.navigate('App')
        } else {
            navigation.popToTop()
        }

    }

    const startLocalStream = async () => {
        // isFront will determine if the initial camera should face user or environment
        const isFront = true;
        const devices = await mediaDevices.enumerateDevices();

        const facing = isFront ? 'front' : 'environment';
        const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
        const facingMode = isFront ? 'user' : 'environment';
        const constraints = {
            audio: true,
            video: {
                // mandatory: {
                //     minWidth: 375, // Provide your own width, height and frame rate here
                //     minHeight: 812,
                //     minFrameRate: 30,
                // },
                facingMode,
                optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
            },
        };
        const newStream = await mediaDevices.getUserMedia(constraints);
        setLocalStream(newStream);
        setState(prev => { return { ...prev, startLocalComplete: true } })
        // setTimeout(() => {
        //     joinCall(state.roomId)
        // }, 3000);
    };

    const joinCall = async id => {

        InCallManager.start({ media: 'video' })
        // InCallManager.setForceSpeakerphoneOn(true);
        // InCallManager.setSpeakerphoneOn(true);

        setState(prev => { return { ...prev, startCallComplete: true } })
        const roomRef = await db.collection('videorooms').doc(id);
        const roomSnapshot = await roomRef.get();

        if (!roomSnapshot.exists) return
        const localPC = new RTCPeerConnection(configuration);
        localPC.addStream(localStream);

        const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
        localPC.onicecandidate = e => {
            if (!e.candidate) {
                console.log('Got final candidate!');
                return;
            }
            calleeCandidatesCollection.add(e.candidate.toJSON());
        };

        localPC.onaddstream = e => {
            if (e.stream && remoteStream !== e.stream) {
                console.log('RemotePC received the stream join', e.stream);
                setRemoteStream(e.stream);
            }
        };

        const offer = roomSnapshot.data().offer;
        await localPC.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await localPC.createAnswer();
        await localPC.setLocalDescription(answer);

        const roomWithAnswer = { answer };
        await roomRef.update(roomWithAnswer);

        roomRef.collection('callerCandidates').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    await localPC.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });

        setCachedLocalPC(localPC);
    };

    const switchCamera = () => {
        localStream.getVideoTracks().forEach(track => track._switchCamera());
    };

    // Mutes the local's outgoing audio
    const toggleMute = () => {
        if (!remoteStream) {
            return;
        }
        localStream.getAudioTracks().forEach(track => {
            // console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
            track.enabled = !track.enabled;
            setIsMuted(!track.enabled);
        });
    };

    // Mutes the local's outgoing audio
    const toggleVideo = () => {
        if (!remoteStream) {
            return;
        }
        localStream.getVideoTracks().forEach(track => {
            console.log('getVideoTracks', track);
            track.enabled = !track.enabled;
            setIsVideo(!track.enabled);
        });
    };

    return (
        <View style={{ flex: 1, }} >
            <View style={{ flex: 1, }} >
                <View style={styles.rtcview}>
                    {remoteStream ?
                        <RTCView
                            mirror={true}
                            objectFit='cover'
                            style={styles.rtc}
                            streamURL={remoteStream && remoteStream.toURL()}
                        />
                        :
                        <ActivityIndicator size="large" color="#fff" />
                    }
                </View>
                <View style={{
                    position: 'absolute', right: 10, top: 10,
                    width: 120, height: 160, backgroundColor: '#000',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    {localStream ?
                        <RTCView
                            mirror={true}
                            objectFit='cover'
                            style={styles.rtc}
                            streamURL={localStream && localStream.toURL()}
                        />
                        :
                        <ActivityIndicator size="small" color="#fff" />
                    }
                </View>
            </View>
            <View style={styles.callButtons} >
                {localStream && !state.startCallComplete &&
                    <View style={{
                        width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <FontAwesome5Icon
                            name={'phone'} size={20} color={'#00f'}
                            onPress={() => joinCall(state.roomId)} disabled={!!remoteStream}
                        />
                    </View>
                }
                {localStream &&
                    <TouchableOpacity style={{
                        width: 48, height: 48, borderRadius: 24, backgroundColor: `${remoteStream ? '#fff' : '#0001'}`,
                        alignItems: 'center', justifyContent: 'center',
                    }}
                        onPress={toggleVideo} disabled={!remoteStream}
                    >
                        <FontAwesome5Icon name={`${!isVideo ? 'video' : 'video-slash'}`}
                            size={20} color={`${remoteStream ? '#000' : '#6a6a6a'}`}

                        />
                    </TouchableOpacity>
                }
                {localStream &&
                    <TouchableOpacity style={{
                        width: 48, height: 48, borderRadius: 24, backgroundColor: `${remoteStream ? '#fff' : '#0001'}`,
                        alignItems: 'center', justifyContent: 'center',
                    }}
                        onPress={toggleMute} disabled={!remoteStream}
                    >
                        <FontAwesome5Icon name={`${!isMuted ? 'microphone' : 'microphone-slash'}`}
                            size={20} color={`${remoteStream ? '#000' : '#6a6a6a'}`}

                        />
                    </TouchableOpacity>
                }
                {localStream &&
                    <TouchableOpacity style={{
                        width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff',
                        alignItems: 'center', justifyContent: 'center',
                    }}
                        onPress={switchCamera}
                    >
                        <FontAwesome5Icon
                            name={'camera'} size={20} color={'#000'}

                        />
                    </TouchableOpacity>
                }
            </View>
            <TouchableOpacity style={styles.buttonContainer}
                onPress={onBackPress}
            >
                <Button
                    type='clear'
                    containerStyle={{
                        width: '90%', alignItems: 'center',
                        marginVertical: 8, backgroundColor: '#f00', borderRadius: 16
                    }}
                    style={{ width: '90%', }}
                    buttonStyle={{ height: 40, }}
                    icon={
                        <FontAwesome5Icon
                            name={'phone-slash'} size={20} color={'#fff'}
                        />
                    }
                    disabled={true}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
        alignSelf: 'center',
        fontSize: 30,
    },
    rtcview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eff1e4',
    },
    rtc: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    toggleButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    callButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 80,
        padding: 8
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 24,
    }
});