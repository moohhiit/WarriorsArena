import { View, Text, Image, StyleSheet, SectionList, StatusBar, FlatList, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import { DataContext } from '../../Context/ContextConection';

export default function FreeFireBr() {
  const { freeFireScheduleSquardBr, FFBrimageUrl } = useContext(DataContext)

  const RenderTeamName = ({ item }) => {
    return (

      <View style={{ borderBottomWidth: .5, padding: 5 }} >
        <View style={{ backgroundColor: '#4B70F5', padding: 5, borderRadius: 5, justifyContent: 'space-between', flexDirection: 'row' }} >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }} >{item.title}</Text>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }} >{item.TeamID.length}/16</Text>
        </View>
        <FlatList
          numColumns={4}
          data={item.TeamID}
          renderItem={({ item }) => {
            return (
              <View style={{ margin: 3, padding: 3, flex: 4, borderRadius: 10, borderWidth: 1 , borderColor:'white' }} >
                <Text style={{ alignSelf: "center", color: 'white' , fontWeight:'bold' }} >
                  {item}
                </Text>
              </View>
            )
          }}

        />
      </View>
    )

  }
  const HIGHT = Dimensions.get('screen').height
  return (
    <View style={{ padding: 10, backgroundColor: 'black', height: HIGHT }} >
      {
        FFBrimageUrl ?
          <Image source={{ uri: FFBrimageUrl }} style={{ height: 250, borderRadius: 10 }} /> : null
      }

      <FlatList
        data={freeFireScheduleSquardBr}
        renderItem={RenderTeamName}
        style={{ height: '58%' }}
      />

    </View>
  )
}



