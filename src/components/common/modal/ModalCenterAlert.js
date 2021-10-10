import React, { Component, useState, useEffect, useLayoutEffect, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    ScrollView
} from 'react-native';
import Modal from "react-native-modal";
// import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { Input, Icon, Button } from 'react-native-elements';
import { scale, moderateScale, verticalScale, calcWidth, calcHeight } from "../../../utils/scaleSize";
import ButtonOutline from '../button/ButtonOutline'

const initStyle = {
    nameIcon: "check",
    typeIcon: "antdesign",
    colorIcon: "#fff",
    backgroundColor: "#008000"
}

export const ModalCenterAlert = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [disabledIcon, setDisabledIcon] = useState(false)
    const [styleModal, setStyleModal] = useState(initStyle)
    const [titleButton, setTitleButton] = useState()

    const onCloseModal = (value) => {
        setIsModalVisible(false)
        if (props.onCloseModalAlert) {
            props.onCloseModalAlert(value)
        }
    }
    useLayoutEffect(() => {
        setIsModalVisible(!!props.isVisible ? true : false)
    }, [props.isVisible])
    useLayoutEffect(() => {
        setDisabledIcon(!!props.disabledIcon ? true : false)
    }, [props.disabledIcon])

    useEffect(() => {
        setTitleButton(!!props.titleButton ? props.titleButton : 'Đồng ý')
    }, [props.titleButton])

    useEffect(() => {
        let styleModal = {
            nameIcon: "check",
            typeIcon: "antdesign",
            colorIcon: "#fff",
            colorButton: "#fff",
            borderColor: "#008000",
            backgroundColor: "#008000"
        };
        switch (props.typeModal) {
            case 'success':
                styleModal = {
                    nameIcon: "check",
                    typeIcon: "antdesign",
                    colorIcon: "#fff",
                    colorButton: "#fff",
                    borderColor: "#008000",
                    backgroundColor: "#008000"
                }
                break;
            case 'info':
                styleModal = {
                    nameIcon: "info",
                    typeIcon: "antdesign",
                    colorIcon: "#fff",
                    colorButton: "#fff",
                    borderColor: "#008eff",
                    backgroundColor: "#008eff"
                }
                break;
            case 'confirm':
                styleModal = {
                    nameIcon: "question",
                    typeIcon: "antdesign",
                    colorIcon: "#fff",
                    colorButton: "#0027ff",
                    borderColor: "#0027ff",
                    backgroundColor: "#008eff"
                }
                break;
            case 'warning':
                styleModal = {
                    nameIcon: "exclamation",
                    typeIcon: "antdesign",
                    colorIcon: "#fff",
                    colorButton: "#fff",
                    borderColor: "#ffc107",
                    backgroundColor: "#ffc107"
                }
                break;
            case 'error':
                styleModal = {
                    nameIcon: "close",
                    typeIcon: "antdesign",
                    colorIcon: "#fff",
                    colorButton: "#fff",
                    borderColor: "#fb5757",
                    backgroundColor: "#fb5757"
                }
                break;
        }
        setStyleModal(styleModal);
    }, [props.typeModal])

    return (
        <View style={styles.outContainer}>
            <Modal
                isVisible={isModalVisible}
                onSwipeComplete={() => setIsModalVisible(false)}
                hasBackdrop={true}
                backdropColor="#7b7a7a"
                backdropOpacity={0.5}
                backdropTransitionInTiming={1000}
                backdropTransitionOutTiming={1000}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={50}
                animationOutTiming={100}
                hideModalContentWhileAnimating={true}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.modal}>
                        <View style={styles.containerHeader}>
                            <View style={styles.inHeader}>
                                {!disabledIcon &&
                                    <Pressable onPress={() => onCloseModal(true)}>
                                        <View style={{
                                            height: moderateScale(70),
                                            width: moderateScale(70),
                                            borderColor: styleModal.borderColor,
                                            borderWidth: moderateScale(5),
                                            borderRadius: moderateScale(35),
                                            justifyContent: 'center',
                                            backgroundColor: styleModal.backgroundColor
                                        }}>
                                            <Icon
                                                activeOpacity={0.7}
                                                name={styleModal.nameIcon}
                                                type={styleModal.typeIcon}
                                                color={styleModal.colorIcon}
                                                size={moderateScale(35)}

                                            />
                                        </View>
                                    </Pressable>
                                }
                            </View>
                        </View>
                        <View style={styles.containerDetail}>
                            {!!props.childComponent ?
                                <View style={{ maxHeight: '100%', width: '100%' }}>
                                    {props.childComponent}
                                </View>
                                :
                                <Fragment>
                                    <Text style={{ fontSize: scale(25), color: '#333', fontWeight: "700", textAlign: 'center' }}>{props.titleModal}</Text>
                                    <Text style={{ marginVertical: verticalScale(10), textAlign: 'center', maxHeight: '90%', }}>{props.contentModal}</Text>
                                    <View style={styles.containerButton}>
                                        <ButtonOutline
                                            title={titleButton}
                                            onPress={() => onCloseModal(true)}
                                            titleStyle={{ color: styleModal.colorButton }}
                                            buttonStyle={{
                                                backgroundColor: styleModal.backgroundColor,
                                                borderColor: styleModal.borderColor,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        />
                                    </View>
                                </Fragment>
                            }
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    outContainer: {
        // maxHeight: calcHeight(90)
    },
    container: {
        flex: 1,
        // maxHeight: calcHeight(90),
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        // maxHeight: calcHeight(90),
        borderRadius: moderateScale(10),
        paddingBottom: verticalScale(20),
    },
    containerHeader: {
        alignItems: "center",
        justifyContent: 'center',
    },
    outHeader: {
        backgroundColor: 'rgba(255, 243, 216,1)',
        justifyContent: 'center',
        alignItems: 'center',
        width: calcWidth(100),
        height: verticalScale(50),
    },
    inHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: calcWidth('100%'),
        height: verticalScale(50),
        bottom: verticalScale(25),
    },
    containerDetail: {
        width: '100%',
        maxHeight: '80%',
        alignItems: 'center',
    },
    containerButton: {
        width: "100%",
        marginTop: verticalScale(10),
        marginBottom: verticalScale(5),
        flexDirection: 'row',
        // justifyContent: 'space-between',
        justifyContent: 'center',
    }
});