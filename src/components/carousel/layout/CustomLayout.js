import React, { useState, useEffect, } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import SliderEntry from '../components/SliderEntry';
import styles, { colors } from '../styles/index.style';
import { scrollInterpolators, animatedStyles } from '../utils/animations';

import { getRandomColor } from 'utils/function'
const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

const CustomLayout = (props) => {
    const [state, setState] = useState({
        slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        title: '',
        subtitle: '',
        data: []
    })
    const _renderItem = (item, index, refNumber) => {

        const onPressItem = () => {
            if (props.onPressItem) {
                props.onPressItem(item, index)
            }
        }

        return <SliderEntry data={item} even={refNumber % 2 === 0} onPress={onPressItem} />;
    }

    const gradient = () => {
        const colors = {
            background1: getRandomColor(),
            background2: getRandomColor(),
        }
        return (
            <LinearGradient
                colors={[colors.background1, colors.background2]}
                startPoint={{ x: 1, y: 0 }}
                endPoint={{ x: 0, y: 1 }}
                style={styles.gradient}
            />
        );
    }

    useEffect(() => {
        if (!!props.data) {
            setState(prev => {
                return { ...prev, data: props.data }
            })
        }
    }, [props.data])

    useEffect(() => {
        if (!!props.title) {
            setState(prev => {
                return { ...prev, title: props.title }
            })
        }
    }, [props.title])

    useEffect(() => {
        if (!!props.subtitle) {
            setState(prev => {
                return { ...prev, subtitle: props.subtitle }
            })
        }
    }, [props.subtitle])

    const refNumber = Math.floor(Math.random() * 4) + 1

    const isEven = refNumber % 2 === 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor={'rgba(0, 0, 0, 0.3)'}
                    barStyle={'light-content'}
                />
                {gradient()}
                <ScrollView
                    style={styles.scrollView}
                    scrollEventThrottle={200}
                    directionalLockEnabled={true}
                >
                    {
                        !IS_ANDROID ? (
                            <View style={[styles.viewContainer]}>
                                {!!state.title && <Text style={[styles.title, isEven ? {} : styles.titleDark]}>{state.title}</Text>}
                                {!!state.subtitle && <Text style={[styles.subtitle, isEven ? {} : styles.titleDark]}> {state.subtitle}</Text>}
                                {!!state.data &&
                                    <Carousel
                                        data={state.data}
                                        renderItem={({ item, index }) => _renderItem(item, index, refNumber)}
                                        sliderWidth={sliderWidth}
                                        itemWidth={itemWidth}
                                        containerCustomStyle={styles.slider}
                                        contentContainerCustomStyle={styles.sliderContentContainer}
                                        scrollInterpolator={scrollInterpolators[`scrollInterpolator${refNumber}`]}
                                        slideInterpolatedStyle={animatedStyles[`animatedStyles${refNumber}`]}
                                        useScrollView={true}
                                    />
                                }
                            </View>
                        ) : false
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
export default CustomLayout