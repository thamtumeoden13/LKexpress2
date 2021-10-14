import React, { useContext, } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const BG_IMG = 'https://images.pexels.com/photos/2033997/pexels-photo-2033997.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'

const VideoCallModal = ({ navigation }) => {

    const onDecline = () => {
        navigation.goBack()
    }

    const onAccept = () => {
        navigation.navigate('VideoJoinModal', { roomId: '111' })
    }

    return (
        <View style={{
            flex: 1, alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'blue',
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
                <Text style={{ fontSize: 30 }}>{`Megan`}</Text>
                <Text style={{ fontSize: 20 }}>{`home`}</Text>
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
                        <Text style={{ fontSize: 16, pading: 8, color: '#fff' }}>{`Decline`}</Text>
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
                        <Text style={{ fontSize: 16, pading: 8, color: '#fff' }}>{`Accept`}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default VideoCallModal