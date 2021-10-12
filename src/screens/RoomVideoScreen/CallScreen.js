import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

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

export default function CallScreen({ route }) {

    const navigation = useNavigation()
    const [state, setState] = useState({
        roomId: '',
        startLocalComplete: false,
        startCallComplete: false,
    })

    function onBackPress() {
        if (cachedLocalPC) {
            cachedLocalPC.removeStream(localStream);
            cachedLocalPC.close();
        }
        setLocalStream();
        setRemoteStream();
        setCachedLocalPC();
        // cleanup
        navigation.goBack()
    }

    const [localStream, setLocalStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [cachedLocalPC, setCachedLocalPC] = useState();

    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const roomId = route.params.roomId
        setState(prev => { return { ...prev, roomId, } })
        navigation.setOptions({
            headerTitle: () => <HeaderTitle title={`Call Room : ${roomId}`} />,
        });
    }, [route]);

    useEffect(() => {
        if (!!state.roomId) {
            startLocalStream()
        }
    }, [state.roomId])

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
                mandatory: {
                    minWidth: 500, // Provide your own width, height and frame rate here
                    minHeight: 300,
                    minFrameRate: 30,
                },
                facingMode,
                optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
            },
        };
        const newStream = await mediaDevices.getUserMedia(constraints);
        setLocalStream(newStream);
        setState(prev => { return { ...prev, startLocalComplete: true } })
    };

    const startCall = async id => {
        setState(prev => { return { ...prev, startCallComplete: true } })
        const localPC = new RTCPeerConnection(configuration);
        localPC.addStream(localStream);

        const roomRef = await db.collection('videorooms').doc(id);
        const callerCandidatesCollection = roomRef.collection('callerCandidates');
        localPC.onicecandidate = e => {
            if (!e.candidate) {
                console.log('Got final candidate!');
                return;
            }
            callerCandidatesCollection.add(e.candidate.toJSON());
        };

        localPC.onaddstream = e => {
            if (e.stream && remoteStream !== e.stream) {
                console.log('RemotePC received the stream call', e.stream);
                setRemoteStream(e.stream);
            }
        };

        const offer = await localPC.createOffer();
        await localPC.setLocalDescription(offer);

        const roomWithOffer = { offer };
        await roomRef.set(roomWithOffer);

        roomRef.onSnapshot(async snapshot => {
            const data = snapshot.data();
            if (!localPC.currentRemoteDescription && data.answer) {
                const rtcSessionDescription = new RTCSessionDescription(data.answer);
                await localPC.setRemoteDescription(rtcSessionDescription);
            }
        });

        roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
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


    return (
        <>
            <View style={{ flex: 1, }} >
                <View style={styles.rtcview}>
                    {remoteStream ?
                        <RTCView mirror style={styles.rtc} streamURL={remoteStream && remoteStream.toURL()} />
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
                        <RTCView mirror style={styles.rtc} streamURL={localStream && localStream.toURL()} />
                        :
                        <ActivityIndicator size="small" color="#fff" />
                    }
                </View>
            </View>

            <View style={styles.callButtons} >
                <FontAwesome5Icon name={'phone-slash'} size={30} color={'#f00'} onPress={onBackPress} />
                {localStream && !state.startCallComplete &&
                    <FontAwesome5Icon
                        name={'phone'} size={30} color={'#fff'}
                        onPress={() => startCall(state.roomId)} disabled={!!remoteStream}
                    />
                }
                {localStream &&
                    <>
                        <FontAwesome5Icon name={`${!isMuted ? 'microphone' : 'microphone-slash'}`}
                            size={30} color={`${remoteStream ? '#000' : '#6a6a6a'}`}
                            onPress={toggleMute} disabled={!remoteStream}
                        />
                        <FontAwesome5Icon name={'camera'} size={30} color={'#000'} onPress={switchCamera} />
                    </>
                }
            </View>
        </>
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
        backgroundColor: '#888888',
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
        position: 'absolute',
        bottom: 48,
        padding: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonContainer: {
        margin: 5,
    }
});