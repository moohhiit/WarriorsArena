import { View, Text, Dimensions } from 'react-native'
import React from 'react'

export default function MyRewords() {

  const HIGHT = Dimensions.get('screen').height
  
  return (
    <View style={{backgroundColor:'black' , flex:1}} >
      <Text>MyRewords</Text>
    </View>
  )
}