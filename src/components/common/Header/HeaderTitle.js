import React from 'react';
import { View, Text } from 'react-native'
import { withNavigation } from '@react-navigation/compat'
import { scale } from 'utils/scaleSize';

const HeaderTitle = (props) => {
    return (
        <View style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text style={{
                fontSize: scale(16),
                textAlign: 'center',
            }}>{props.title}</Text>
        </View>
    )
};

// export default HeaderTitle;
export default withNavigation(HeaderTitle);