import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { moderateScale, verticalScale, scale } from 'utils/scaleSize'

const ListVertical = (props) => {

    const [state, setState] = useState({
        title: '',
        data: []
    })

    const [style, setStyle] = useState({
        containerStyle: null,
        itemStyle: null
    })

    useEffect(() => {
        if (!!props.title) {
            setState(prev => {
                return { ...prev, title: props.title }
            })
        }
    }, [props.title])

    useEffect(() => {
        if (!!props.data) {
            setState(prev => {
                return { ...prev, data: props.data }
            })
        }
    }, [props.data])

    useEffect(() => {
        if (!!props.itemStyle) {
            setStyle(prev => {
                return { ...prev, itemStyle: props.itemStyle }
            })
        }
    }, [props.itemStyle])

    useEffect(() => {
        if (!!props.containerStyle) {
            setStyle(prev => {
                return { ...prev, containerStyle: props.containerStyle }
            })
        }
    }, [props.containerStyle])

    return (
        <View style={styles.container}>
            {!!state.title &&
                <Text style={{ fontSize: scale(24), fontWeight: 'bold', paddingHorizontal: moderateScale(10) }}>
                    {state.title}
                </Text>
            }
            {(!!state.data && state.data.length > 0) &&
                <View style={[styles.containerList, style.containerStyle]}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {state.data.map((e, i) => (
                            <View
                                key={`House` + i}
                                style={[styles.containerItemOutline, style.itemStyle]}
                            >
                                <View style={[styles.containerItem]}>
                                    <View style={{ flex: 2 }}>
                                        <Image
                                            source={{ uri: e.uri }}
                                            style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
                                        >
                                        </Image>
                                    </View>
                                    <View style={{ flex: 1, paddingTop: 10 }}>
                                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }} numberOfLines={2}>{e.title}</Text>
                                        <Text style={{ fontSize: scale(10), fontWeight: '300' }} numberOfLines={2}>{e.subtitle}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            }
        </View>
    )
}

export default ListVertical;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerList: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        height: moderateScale(520),
        marginTop: verticalScale(10),
        paddingLeft: moderateScale(10),
    },
    containerItemOutline: {
        height: moderateScale(260),
        width: '50%',
        padding: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerItem: {
        height: '98%',
        width: '98%',
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.9,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
    }
})