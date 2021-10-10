import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Alert, Dimensions, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Transition, Transitioning } from 'react-native-reanimated'

const transition = () => (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.OUT type='fade' durationMs={200} />
    </Transition.Together>
)

const AccordionMenu = (props) => {
    const ref = useRef()
    const [currentIndex, setCurrentIndex] = useState(null)
    const [result, setResult] = useState([])

    useEffect(() => {
        let result = props.result
        if (!!result) {
            result.map(e => {
                e.activedIndex = false
                e.activedKey = ''
            })
        }
        setResult(result)
    }, [props.result])

    const handlerTouchOpacity = (index) => {
        ref.current.animateNextTransition()
        setCurrentIndex(currentIndex === index ? null : index)
    }

    const handalerTouchItem = (id, name, index, childIndex) => {
        result.map(e => {
            e.activedIndex = childIndex
            e.activedKey = name
            return e
        })
        setResult(result)
        setCurrentIndex(null)
        if (props.onPressItem) {
            props.onPressItem(id, name)
        }
    }

    return (
        <Transitioning.View
            ref={ref}
            transition={transition}
            style={styles.container}
        >
            {result.map(({ bg, color, name, subCategories, activedKey, activedIndex }, index) => {
                return (
                    <TouchableOpacity
                        key={name}
                        activeOpacity={0.9}
                        style={styles.cardContainer}
                        onPress={() => handlerTouchOpacity(index)}
                    >
                        <View style={[styles.card, { backgroundColor: bg }]}>
                            <Text style={[styles.heading, { color: color }]}>{name}</Text>
                            {index === currentIndex &&
                                <View style={styles.subCategories}>
                                    {subCategories.map((subCategory, childIndex) => (
                                        <TouchableOpacity key={`item-${subCategory.id}`} onPress={() => handalerTouchItem(subCategory.id, name, index, childIndex)}>
                                            <Text style={[styles.body, {
                                                color: color,
                                                fontWeight: name == activedKey && childIndex == activedIndex ? 'bold' : '300',
                                                textDecorationLine: name == activedKey && childIndex == activedIndex ? 'underline' : 'none',
                                                textDecorationColor: color,
                                                textDecorationStyle: 'solid'
                                            }]}>{`${subCategory.name}`}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            }
                        </View>
                    </TouchableOpacity>
                )
            })
            }
        </Transitioning.View>
    )
}

export default AccordionMenu

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
    cardContainer: {
        flexGrow: 1
    },
    card: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        fontSize: 38,
        fontWeight: '900',
        textTransform: 'uppercase',
        textAlign: 'left',
        width: '100%',
        paddingLeft: 20
    },
    subCategories: {
        marginTop: 10,
        width: '100%'
    },
    body: {
        fontSize: 20,
        lineHeight: 20 * 1.5,
        textAlign: 'left',
        paddingLeft: 30
    }
})