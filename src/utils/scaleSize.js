import React from 'react'
import { Dimensions, PixelRatio } from 'react-native'

export const deviceWidth = Dimensions.get('window').width
export const deviceHeight = Dimensions.get('window').height

// ui được thiết kế cho size màn hình là (360x592)
// const standarWidth = 360;
// const standardHeight = 592;
// const boxWidth =  300/standarWidth * width;
// const boxHeight = 450/standardHeight * height;
// const textFontSize = 14/standarWidth * width;
// const buttonTextFontSize = 14/standarWidth * width;
// const titleFontSize = 20/standarWidth * width;
// const buttonWidth = 150/standarWidth * width;
// const buttonHeight = 49/standardHeight * height;
// const lineHeight = 25/standardHeight * height;
// const marginBottom = 10/standardHeight * height;
// const padding = 10/standarWidth * width;


//Chiều rộng và cao cho design chuẩn.//////// iPhone X
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// //Chiều rộng và cao cho design chuẩn.
// const guidelineBaseWidth = 360;
// const guidelineBaseHeight = 592;

export const scale = size => deviceWidth / guidelineBaseWidth * size;
export const verticalScale = size => deviceHeight / guidelineBaseHeight * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const calcHeight = x => {
    // Parse string percentage input and convert it to number.
    const elemHeight = typeof x === "number" ? x : parseFloat(x);

    return PixelRatio.roundToNearestPixel((deviceHeight * elemHeight) / 100)
}
export const calcWidth = x => {
    // Parse string percentage input and convert it to number.
    const elemWidth = typeof x === "number" ? x : parseFloat(x);

    return PixelRatio.roundToNearestPixel((deviceWidth * elemWidth) / 100)
}

export const imgSize = x => PixelRatio.getPixelSizeForLayoutSize(x)
export const fontScale = x => PixelRatio.getFontScale() * x


export const LATITUDE_DELTA = 0.035
export const LONGITUDE_DELTA = LATITUDE_DELTA * (deviceWidth / deviceHeight)

export const LATITUDE_DELTA_ZOOM_IN = 0.009
export const LONGITUDE_DELTA_ZOOM_IN = LATITUDE_DELTA_ZOOM_IN * (deviceWidth / deviceHeight)

export const LATITUDE_DELTA_ZOOM_OUT = 0.092
export const LONGITUDE_DELTA_ZOOM_OUT = LATITUDE_DELTA_ZOOM_OUT * (deviceWidth / deviceHeight)