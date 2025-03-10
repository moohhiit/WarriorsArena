import { View, Text, Image, StyleSheet, SectionList, StatusBar, FlatList, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import { ScrollView } from 'react-native-virtualized-view';
import { DataContext } from '../../Context/ContextConection';

export default function FreeFireCs() {
  const {  FFCrimageUrl } = useContext(DataContext)

  const HIGHT = Dimensions.get('screen').height
 

  return (
    <View style={{ padding: 10, backgroundColor: 'black', height: HIGHT }} >
      {
        FFCrimageUrl ?
          <Image source={{ uri: FFCrimageUrl }} style={{ height: 250, borderRadius: 10 }} /> : null
      }

      <View style={{ marginVertical: 10 }} >
        <View style={{ backgroundColor: '#4B70F5', padding: 5, borderRadius: 5, justifyContent: 'space-between', flexDirection: 'row' }} >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }} >Notice </Text>
        </View>
        <View style={{ borderWidth: 1, borderRadius: 10, borderColor: 'white', height: 250, marginVertical: 10, padding: 10 }} >
          <Text style={{ color: 'white', }} >
            Rule for Participation
          </Text>
          <View style={{ padding: 10 }} >
            <Text style={{ color: 'white' }} >
              **   Team Winnng Rete is greater than 85%
            </Text>
            <Text style={{ color: 'white' }} >
              **  All players must exhibit good sportsmanship & including fairness.
            </Text>
            <Text style={{ color: 'white' }} >
              ** Any behavior deemed inappropriate, such as cheating, unsportsmanlike conduct, or disruptive actions, may result in disqualification or penalties.
            </Text>
          </View>
          <Text style={{ color: 'white', fontSize: 15 }} >

            Enrollment Time : 10/05/2025 -- 20/05/2025
          </Text>
        </View>

      </View>
    </View>
  )
}