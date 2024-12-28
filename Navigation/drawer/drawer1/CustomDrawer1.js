import { Alert, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useReducer, useRef } from 'react'
import { useDrawerProgress } from '@react-navigation/drawer'
import { colors, constant } from '../constant'
import Icon, { Icons } from '../../../Component/Icons'
import { ProfileMenu } from '../arrays'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import DrawerItemList from './DrawerItemList'
import { AuthContext, DataContext } from '../../../Context/ContextConection'
import { useNavigation } from '@react-navigation/native'
import GameDetail from '../../../Component/GameDetail'


const ProjectItem = ({
  label, type = Icons.Entypo, name = 'youtube',
  color = '#FF0000', liveurl }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (liveurl) {
          Linking.openURL(liveurl)
        }
      }}
      style={styles.row}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Icon type={type} name={name} color={colors.white} />
      </View>
      <Text style={styles.livelable}>{label}</Text>
    </TouchableOpacity>
  )
}

const ProfileItem = ({ label, onPress, type, name }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, { margin: constant.SPACING / 4 }]}>
      <Icon type={type} name={name} color={colors.dark} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}

const CustomDrawer1 = (props) => {
  const { state, descriptors, navigation } = props;
  const { Auth, userLoginDetail, initializing } = useContext(AuthContext)
  const { GameLive, PlayerData } = useContext(DataContext)

  const scrollRef = useRef(null)
  const ProjectsArray = GameLive.LiveArray

  const [show, toggleProfile] = useReducer(s => !s, false);

  const fun = () => {
    show ? scrollRef.current.scrollTo({
      y: 0,
      animated: true,
    }) : scrollRef.current.scrollToEnd({
      animated: true,
    })
    toggleProfile()
  }

  const progress = useDerivedValue(() => {
    return show ? withTiming(1) : withTiming(0);
  })

  const menuStyles = useAnimatedStyle(() => {
    const scaleY = interpolate(
      progress.value,
      [0, 1],
      [0, 1],
    )
    return {
      transform: [{ scaleY }]
    }
  })

  const drawerProgress = useDrawerProgress();

  const viewStyles = useAnimatedStyle(() => {
    const translateX = interpolate(
      drawerProgress.value,
      [0, 1],
      [-200, 0],
    )
    return {
      transform: [{ translateX }]
    }
  })

  const viewStyles2 = (type) => useAnimatedStyle(() => {
    const val = type === 'top' ? -100 : 100;
    const translateY = interpolate(
      drawerProgress.value,
      [0, 1],
      [val, 0],
    )
    const opacity = interpolate(
      drawerProgress.value,
      [0, 1],
      [0, 1],
    )
    return {
      transform: [{ translateY }], opacity
    }
  })
  const Navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <Animated.View style={[styles.row, styles.view, styles.marginTop, viewStyles2('top') , {backgroundColor:'black'}]}>
        <Image style={{
          padding: constant.SPACING / 2.4,
          borderRadius: constant.borderRadius,
          margin: constant.SPACING / 2,
          height: 50,
          width: 50
        }} source={require('../../../Component/AppLogo.png')} >
        </Image>
        <Text style={styles.headerTitle}>Hello Gamers</Text>
      </Animated.View>
      {/* Drawer List Item */}
      <Animated.ScrollView
        ref={scrollRef}
        {...props}
        showsVerticalScrollIndicator={false}
        style={[styles.marginVertical, viewStyles]}>
        <DrawerItemList {...props} styles={styles} />

        <GameDetail/>
        {/* 2nd menu */}
        <View style={[styles.view, styles.marginVertical]}>
          <Text style={{ color: 'gold' }} >Team Connection.... </Text>
          <View style={styles.separator} />
          {
            ProjectsArray ?

              ProjectsArray.map((_, i) => (
                <ProjectItem key={i}
                  label={_.title}
                  color={_.color}
                  liveurl={_.liveurl}
                  name={_.from}
                />
              ))
              : null
          }
        </View>
        {/* profile menu */}
        <Animated.View style={[styles.view,
        { backgroundColor: colors.primary },
          menuStyles
        ]}>
          {!initializing ?
            <View >
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 18 }}>{userLoginDetail ? userLoginDetail.email : null}</Text>
            </View> :
            <View>
              <Text style={[styles.headerTitle, { alignSelf: "center", fontWeight: "bold" }]}>Opps! Not Login😒😒</Text>
            </View>
          }

          <View style={styles.separator} />
          {ProfileMenu.map((_, i) => (
            <ProfileItem key={i} label={_.label}
              type={_.iconType}
              name={_.icon}
              onPress={_.onPress}
            />
          ))}
          <Text style={{ marginTop: 10 }}>v1.0.0 - Terms & Condition</Text>
        </Animated.View>
      </Animated.ScrollView>
      {/* footer */}
      <TouchableOpacity
        onPress={() => {
          if (initializing) {
            Navigation.navigate('LoginScreen')
          }
          else {
            fun()
          }
        }}>
        <Animated.View
          style={[styles.row, styles.view, styles.marginBottom, viewStyles2('bottom')]}>
          {!initializing ?
            <View style={styles.textContainer}>
              <Text style={styles.headerTitle}>{PlayerData ? PlayerData.displayName : null}</Text>
              <Text style={{ fontSize: 18, color: 'gold' }}>#{PlayerData ? PlayerData.playerAppID : null}</Text>
            </View> :
            <Text style={[styles.headerTitle, { alignSelf: "center", fontWeight: "bold" }]}>Login!!</Text>
          }
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default CustomDrawer1

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    backgroundColor: 'black',
    borderRadius: constant.borderRadius,
    marginHorizontal: constant.SPACING / 2,
    padding: constant.SPACING / 1.5,
  },
  marginTop: {
    marginTop: constant.SPACING / 2,
  },
  marginBottom: {
    marginBottom: constant.SPACING / 2,
  },
  marginVertical: {
    marginVertical: constant.SPACING / 2,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: constant.SPACING / 2,
    justifyContent: 'space-between',
    borderRadius: constant.borderRadius,
    
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: constant.textFontSize,
    color: 'gold',
    paddingHorizontal: constant.SPACING,
  },
  livelable: {
    fontSize: constant.livetextFontSize,
    color: 'gold',
  },
  notificationBadge: {
    paddingVertical: constant.SPACING / 5,
    paddingHorizontal: constant.SPACING / 2,
    borderRadius: constant.borderRadius / 2,
  },
  iconContainer: {

    padding: constant.SPACING / 2.4,
    borderRadius: constant.borderRadius,
    margin: constant.SPACING / 2,
    backgroundColor: colors.primary,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.darkGray,
    marginVertical: constant.SPACING / 2,
  },
  headerTitle: {
    fontSize: constant.titleFontSize,
    color: 'gold',
    fontFamily: "serif"
  },
  profile: {
    marginVertical: constant.SPACING / 2,
    marginRight: constant.SPACING,
    marginLeft: constant.SPACING / 2,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.light,
  },
  profileText: {
    color: colors.dark,
  },
})