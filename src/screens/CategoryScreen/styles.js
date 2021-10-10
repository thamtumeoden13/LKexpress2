import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f5f7'
    },
    cirle: {
        width: 500,
        height: 500,
        borderRadius: 500 / 2,
        backgroundColor: '#fff',
        left: -120,
        top: -50,
        position: 'absolute'
    },
    header: {
        fontWeight: '800',
        fontSize: 30,
        color: '#514e5a',
        marginTop: 32
    },
    input: {
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#bab7c3',
        borderRadius: 32,
        paddingHorizontal: 16,
        color: '#514e5a',
        fontWeight: '600'
    },
    continue: {
        width: 48,
        height: 48,
        borderRadius: 48 / 2,
        backgroundColor: '#9075e3',
        alignItems: 'center',
        justifyContent: 'center',
    }
})