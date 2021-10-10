import React, { useState, useEffect } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import SliderEntry from '../components/SliderEntry';
import styles, { colors } from '../styles/index.style';
import { getRandomColor } from 'utils/function'

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

const MomentumLayout = (props) => {

    const [state, setState] = useState({
        slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        title: '',
        subtitle: '',
        data: []
    })
    const _renderItem = ({ item, index }) => {

        const onPressItem = () => {
            if (props.onPressItem) {
                props.onPressItem(item, index)
            }
        }

        return <SliderEntry data={item} even={(index + 1) % 2 === 0} onPress={onPressItem} />;
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
                    <View style={styles.viewContainer}>
                        {!!state.title && <Text style={styles.title}>{state.title}</Text>}
                        {!!state.subtitle && <Text style={styles.subtitle}>{state.subtitle}</Text>}
                        {!!state.data &&
                            <Carousel
                                data={state.data}
                                renderItem={_renderItem}
                                sliderWidth={sliderWidth}
                                itemWidth={itemWidth}
                                inactiveSlideScale={0.95}
                                inactiveSlideOpacity={1}
                                enableMomentum={true}
                                activeSlideAlignment={'start'}
                                containerCustomStyle={styles.slider}
                                contentContainerCustomStyle={styles.sliderContentContainer}
                                activeAnimationType={'spring'}
                                activeAnimationOptions={{
                                    friction: 4,
                                    tension: 40
                                }}
                            />
                        }
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
export default MomentumLayout