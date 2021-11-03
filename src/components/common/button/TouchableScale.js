import React from 'react'

import { TouchableNativeFeedback } from 'react-native'
import Animated, {
    useAnimatedStyle, useSharedValue,
    useDerivedValue, withTiming, Easing,
    interpolate, Extrapolate
} from 'react-native-reanimated'

const TouchableScale = ({ onPress, disabled, scaleTo = 1, children }) => {

    const pressed = useSharedValue(false)
    const progess = useDerivedValue(() => {
        return pressed.value
            ? withTiming(1, { duration: 50, easing: Easing.linear })
            : withTiming(0, { duration: 50, easing: Easing.linear })
    })

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            progess.value,
            [0, 1],
            [1, scaleTo], Extrapolate.CLAMP
        )

        return {
            transform: [{ scale }]
        }
    })

    return (
        <TouchableNativeFeedback
            onPressIn={() => { pressed.value = true }}
            onPressOut={() => { pressed.value = false }}
            onPress={onPress} disabled={disabled}
        >
            <Animated.View style={animatedStyle}>
                {children}
            </Animated.View>
        </TouchableNativeFeedback>
    )

}

export default TouchableScale