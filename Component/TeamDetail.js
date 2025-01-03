import { View, Text, Dimensions, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../Context/ContextConection';

export default function TeamDetail({ route }) {
  const { ID } = route.params;
  const { getDetailFromServer } = useContext(DataContext)
  const [teamDetail, setteamDetail] = useState(null)

  const height = Dimensions.get('screen').height

  const getTeamDetail = async () => {
    try {
      const detail = await getDetailFromServer('PlayerTeams', ID)
      console.log(detail)
      setteamDetail(detail)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getTeamDetail()
  }, [])

  return (

    <View style={{ backgroundColor: 'black', height: height }} >
      {
        teamDetail ?
          <>
            <View style={{ justifyContent: "flex-end", backgroundColor: 'black', height: 100, borderBottomEndRadius: 20, borderBottomLeftRadius: 20, borderBottomColor: "gold", borderWidth: 3, padding: 10 }} >
              <Text style={{ color: 'gold', fontSize: 20, alignSelf: 'center', }} >{teamDetail.teamName}</Text>
            </View>
            <View style={{ padding: 20 }} >

              <View>
                <Text style={{color:'lightgreen' , fontSize:20 , alignSelf:'flex-end'}}  >
                  {
                    teamDetail.WinMatch != 0 ? `${TeamDetail.WinMatch / teamDetail.teamGameHistory.length * 100} % ` : "0%"
                  }
                </Text>
              </View>


              <Text style={{ color: "gold" }} >
                Member List
              </Text>
              {
                teamDetail.teamMembers.map((_, i) => {
                  return (

                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }} >
                      <Text style={{ color: 'white' }} >
                        {_.name}
                      </Text>
                      <Text style={{ color: 'white' }} >
                        {_.id}
                      </Text>
                    </View>
                  )
                })
              }
            </View>
            <View>
              <View style={{ backgroundColor: 'gold', padding: 5, borderRadius: 5 }}  >
                <Text style={{ color: 'black', fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }} >
                  Match List
                </Text>
              </View>
            </View>
          </>
          :
          <View>
            <Text style={{ color: 'gold' }} >Loading...</Text>
          </View>
      }

    </View>
  )
}