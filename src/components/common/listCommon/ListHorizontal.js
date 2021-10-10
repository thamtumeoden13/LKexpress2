import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'

import { moderateScale, verticalScale, scale } from 'utils/scaleSize'

const ListHorizontal = (props) => {

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
                <Text style={{ fontSize: scale(24), fontWeight: 'bold', }}>
                    {state.title}
                </Text>
            }
            {(!!state.data && state.data.length > 0) &&
                <View style={[styles.containerList, style.containerStyle]}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                        {state.data.map((e, i) => (
                            <View key={`Categories` + i}
                                style={[styles.containerItem, style.itemStyle]}
                            >
                                <View style={{ flex: 2, }}>
                                    <Image
                                        source={{ uri: e.uri }}
                                        style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
                                    />
                                </View>
                                <View style={{ flex: 1, paddingTop: verticalScale(10), }}>
                                    <Text style={{ fontSize: scale(12), fontWeight: 'bold' }} numberOfLines={1}>{e.title}</Text>
                                    <Text style={{ fontSize: scale(10), fontWeight: '300' }} numberOfLines={1}>{e.subtitle}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            }

        </View>
    )
}

export default ListHorizontal;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerList: {
        height: moderateScale(130),
        marginTop: verticalScale(10),
    },
    containerItem: {
        width: moderateScale(130),
        marginLeft: moderateScale(20),
        borderWidth: 1,
        borderColor: '#000',
        marginVertical: verticalScale(10),
        padding: moderateScale(5),
        borderRadius: moderateScale(5),
        shadowColor: '#000',
        shadowOpacity: 0.9,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        backgroundColor: '#fff'
    }
})