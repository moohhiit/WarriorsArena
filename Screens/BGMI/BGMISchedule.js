import { View, Text, FlatList, ActivityIndicator, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../Context/ContextConection'
import firestore from '@react-native-firebase/firestore';

export default function BGMISchedule() {
  const { BGMISchdeuleSquard, PlayerData } = useContext(DataContext)
  const [matchDetail, setMatchDetail] = useState([])
  const [refreshing, setrefreshing] = useState(false)


  const FeatchMatchdetail = async (d) => {


    setrefreshing(true)
    try {

      const Preomise = d.map(async (e) => {
        const S_ = await firestore().collection('gameData').doc(e).get()
        return S_.data()
      })
      const ScheduleMatch = await Promise.all(Preomise)
      const FilterData = ScheduleMatch.filter(item => item !== undefined && item !== null);
      setMatchDetail(FilterData)
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setrefreshing(false)
    }
  }

  useEffect(() => {
    if (BGMISchdeuleSquard) {

      FeatchMatchdetail(BGMISchdeuleSquard)
    }
    console.log(typeof (BGMISchdeuleSquard))
  }, [BGMISchdeuleSquard])

  const matchboxdetail = ({ item }) => {
    try {

      return (

        <View style={{ margin: 10, borderBottomWidth: .5, padding: 5, }} >
          <View style={{ backgroundColor: '#4B70F5', flexDirection: "row", justifyContent: 'space-between', padding: 5, borderRadius: 5 }} >
            <Text style={{ color: 'white', fontWeight: 'bold' }} >#{item.MatchId}</Text>
            <Text style={{ color: 'white', fontWeight: 'bold' }} >{item.map}</Text>
            <Text style={{ color: 'white', fontWeight: 'bold' }} >{item.MatchTime}</Text>
          </View>
          <FlatList
            numColumns={4}
            data={item.TeamID}
            renderItem={({ item }) => {
              return (
                <View style={{ margin: 3, padding: 3, flex: 4, borderRadius: 10, borderWidth: 1, borderColor: "gold" }} >
                  <Text style={{ alignSelf: "center", color: 'white' }} >
                    {item.teamName}
                  </Text>
                </View>
              )
            }}

          />
          {PlayerData.TeamDeatile.some(ele => item.TeamID.some(ele1 => ele1.teamid == ele)) ?
            <View style={{ margin: 5, borderTopWidth: 1, borderColor: 'gold' }}>
              {
                item.roomID ?
                  <View style={{ flexDirection: "row", justifyContent: 'space-between', marginHorizontal: 10 }} >
                    <Text> Room ID : {item.roomID} </Text>
                    <Text> Room Pass : {item.roomPass} </Text>
                  </View>

                  : null
              }
              <Text style={{ color: 'lightgreen', paddingHorizontal: 10 }} >

                Your team is in this game, you will get  password 15 minutes before the start of the game.
              </Text>
            </View>
            : null}
        </View>



      )
    } catch (error) {
      console.log(error)
    }

  }
  const HIGHT = Dimensions.get('screen').height
  return (
    <View style={{ backgroundColor: 'black', height: HIGHT }} >


      <FlatList
        onRefresh={() => { FeatchMatchdetail(BGMISchdeuleSquard) }}
        refreshing={refreshing}
        data={matchDetail}
        renderItem={matchboxdetail}
      />
      {refreshing && <ActivityIndicator size="large" color="#0000ff" />}



    </View>
  )
}