import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react'
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon, { Icons } from '../../Component/Icons';
import Colors from '../../constants/Colors';
import * as Animatable from 'react-native-animatable';
import BGMIbr from './BGMIbr';
import BGMICs from './BGMICs';
import BGMISchedule from './BGMISchedule';
const TabArr = [
    // { route: 'BGMIbr', label: 'Home', type: Icons.Fontisto, activeIcon: 'map', inActiveIcon: 'map', component: BGMIbr },
    { route: 'BGMICs', label: 'Like', type: Icons.MaterialIcons, activeIcon: 'safety-divider', inActiveIcon: 'safety-divider', component: BGMICs },
    { route: 'BGMIShedule', label: 'Search', type: Icons.MaterialCommunityIcons, activeIcon: 'timeline-text', inActiveIcon: 'timeline-text-outline', component: BGMISchedule },
];
const Tab = createBottomTabNavigator();

const TabButton = (props) => {
    const { item, onPress, accessibilityState } = props;
    const focused = accessibilityState.selected;
    const viewRef = useRef(null);

    useEffect(() => {
        if (focused) {
            viewRef.current.animate({ 0: { scale: .5, rotate: '0deg' }, 1: { scale: 1.5, rotate: '360deg' } });
        } else {
            viewRef.current.animate({ 0: { scale: 1.5, rotate: '360deg' }, 1: { scale: 1, rotate: '0deg' } });
        }
    }, [focused])

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={[styles.container, { top: 0 }]}>
            <Animatable.View
                ref={viewRef}
                duration={300}
            >
                <Icon type={item.type}
                    name={focused ? item.activeIcon : item.inActiveIcon}
                    color={focused ? 'gold' : 'white'} />
            </Animatable.View>
        </TouchableOpacity>
    )
}

export default function BGMIScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        height: 60,
                        position: 'absolute',
                        margin: 16,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'black'
                    }
                }}
            >
                {TabArr.map((item, index) => {
                    return (
                        <Tab.Screen key={index} name={item.route} component={item.component}
                            options={{
                                tabBarShowLabel: false,
                                tabBarButton: (props) => <TabButton {...props} item={item} />
                            }}
                        />
                    )
                })}
            </Tab.Navigator>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
    }
})