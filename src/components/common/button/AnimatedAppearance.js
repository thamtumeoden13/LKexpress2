import React, { useEffect } from 'react'

import Animated, {
    useAnimatedStyle, useSharedValue,
    useDerivedValue, withSpring, withDelay,
    interpolate,
} from 'react-native-reanimated'

const AnimatedAppearance = ({ children, index, horizontal }) => {

    const play = useSharedValue(false)
    const progess = useDerivedValue(() => {
        return play.value
            ? withDelay(50 * (index ?? 0), withSpring(1))
            : 0
    })

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            progess.value,
            [0, 1],
            [0, 100],
        )
        const translateY = interpolate(
            progess.value,
            [0, 1],
            [horizontal ? 0 : 100, 0]
        )

        const translateX = interpolate(
            progess.value,
            [0, 1],
            [horizontal ? 100 : 0, 0]
        )

        return {
            opacity,
            transform: [{ translateY }, { translateX }]
        }
    })

    useEffect(() => {
        play.value = true
    }, [])

    return (
        <Animated.View style={animatedStyle}>
            {children}
        </Animated.View>
    )

}

export default AnimatedAppearance