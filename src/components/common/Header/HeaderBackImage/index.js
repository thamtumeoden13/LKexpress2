import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';

export default class HeaderBackImage extends Component {
    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigations.goBack()}>
                <Image
                    source={require('@assets/img/back.png')}
                    style={styles.Image}
                />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    Image: {
        height: 25,
        width: 25,
        marginLeft: 6,
        marginRight: 12,
        marginVertical: 12,
        resizeMode: 'contain',
    },
});