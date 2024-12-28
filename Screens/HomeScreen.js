import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { DataContext } from '../Context/ContextConection'

export default function HomeScreen() {
  const { PlayerData } = useContext(DataContext)
  return (
    <View>
      {/* <Text>{PlayerData.name}</Text> */}
      <Text>
        Hy My Name 
      </Text>
    </View>
  )
}