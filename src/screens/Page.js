import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Dimensions, StyleSheet, ScrollView } from 'react-native'

import Animated, {
    useSharedValue, useAnimatedStyle, interpolate, withSpring,
    useAnimatedGestureHandler, useAnimatedScrollHandler
} from 'react-native-reanimated'

import { PanGestureHandler } from 'react-native-gesture-handler'

const DATA = ["HELLO", "WORLD", "I'AM", "ROBOT", "XIN", "CHAO", "VIET", "NAME"]

const { width, height } = Dimensions.get('window')

const ITEM_WIDTH = width * 0.7
const ITEM_HEIGHT = ITEM_WIDTH
const RADIUS = ITEM_WIDTH / 2

const Page = () => {
    const translateX = useSharedValue(0)

    const onScrollHandler = useAnimatedScrollHandler((event) => {
        translateX.value = event.contentOffset.x
    })

    const ItemComponent = ({ item, index, translateX }) => {

        const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

        const rStyle = useAnimatedStyle(() => {
            const scale = interpolate(
                translateX.value,
                inputRange,
                [0, 1, 0]
            )
            const borderRadius = interpolate(
                translateX.value,
                inputRange,
                [0, RADIUS, 0]
            )

            return (
                {
                    transform: [{ scale }],
                    borderRadius
                }
            )
        })

        const rTextStyle = useAnimatedStyle(() => {

            const opacity = interpolate(
                translateX.value,
                inputRange,
                [0, 1, 0]
            )
            const translateY = interpolate(
                translateX.value,
                inputRange,
                [height / 2, 0, -height / 2]
            )

            return (
                {
                    opacity,
                    transform: [{ translateY }]
                }
            )
        })

        return (
            <View style={[styles.itemContainer, { backgroundColor: `rgba(0,0,256,0.${index + 1})` }]}>
                <Animated.View style={[styles.itemContent, rStyle]}>
                    <Animated.Text style={[styles.itemText, rTextStyle]}>{item.toString()}</Animated.Text>
                </Animated.View>
            </View>
        )
    }

    const translateGestureHanlerX = useSharedValue(0)
    const translateGestureHanlerY = useSharedValue(0)

    const handlerGestureEvent = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.translationX = translateGestureHanlerX.value
            context.translationY = translateGestureHanlerY.value
        },
        onActive: (event, context) => {
            translateGestureHanlerX.value = event.translationX + context.translationX
            translateGestureHanlerY.value = event.translationY + context.translationY
        },
        onEnd: (event) => {
            const distance = Math.sqrt(translateGestureHanlerX.value ** 2 + translateGestureHanlerY.value ** 2)
            if (distance > RADIUS) {
                translateGestureHanlerX.value = withSpring(0)
                translateGestureHanlerY.value = withSpring(0)
            }
        }
    })

    const rStyle = useAnimatedStyle(() => {

        return (
            {
                transform: [
                    { translateX: translateGestureHanlerX.value },
                    { translateY: translateGestureHanlerY.value }
                ]
            }
        )
    })

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.ScrollView
                horizontal
                onScroll={onScrollHandler}
                scrollEventThrottle={16}
                snapToInterval={width}
                decelerationRate={'fast'}
            >
                {DATA.map((item, index) => {
                    return (
                        <ItemComponent key={index.toString()} item={item} index={index} translateX={translateX} />
                    )
                })}
            </Animated.ScrollView>
            <PanGestureHandler onGestureEvent={handlerGestureEvent}>
                <Animated.View style={[styles.square, rStyle]} />
            </PanGestureHandler>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    itemContainer: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemContent: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `rgba(256,0,256,0.9)`,
    },
    itemText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    square: {
        width: ITEM_WIDTH * 0.8,
        height: ITEM_WIDTH * 0.3,
        borderRadius: 20,
        backgroundColor: `rgba(0,0,256,0.2)`,
        position: 'absolute',
    }
})
