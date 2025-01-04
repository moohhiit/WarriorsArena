import { View, Text, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../Context/ContextConection';
import Icon, { Icons } from './Icons';

export default function TeamDetail({ route }) {
  const { ID } = route.params;
  const { getDetailFromServer, PlayerData, removePlyerFromTeam, featchDetail } = useContext(DataContext)
  const [teamDetail, setteamDetail] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [newPlayerList, setnewPlyerlist] = useState([])
  const [matchHistory, setmatchHistory] = useState([])

  const height = Dimensions.get('screen').height

  const enableedit = () => {
    setEditMode(!editMode)
  }

  const removePlayer = async (id) => {
    setnewPlyerlist((plyer) => plyer.filter((p) => p.id !== id))
    console.log(newPlayerList)
    await removePlyerFromTeam(ID, "teamMembers", id)
  }

  const confirmRemove = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this Player?",
      [
        {
          text: "Cancel",

        },
        {
          text: "OK",
          onPress: () => removePlayer(id)
        },
      ],
      { cancelable: true }
    );
  };
  const getTeamDetail = async () => {
    try {
      const detail = await getDetailFromServer('PlayerTeams', ID)
      setteamDetail(detail)
      setnewPlyerlist(detail.teamMembers)
    } catch (error) {
      console.log(error)
    }
  }
  const getteammatchDetail = async () => {
    if (teamDetail) {
      const TD = await featchDetail("gameData", teamDetail.teamGameHistory)
      setmatchHistory(TD)
      console.log(TD)

    }
  }
  useEffect(() => {
    getteammatchDetail()
  }, [teamDetail])
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

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                <TouchableOpacity style={{ padding: 10, backgroundColor: 'gold', borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }} >
                  <Text style={{ color: 'black', fontWeight: "bold", fontSize: 20 }}  >Requests </Text>
                  <Icon type={Icons.Fontisto} name='persons' color='black' size={20} />
                </TouchableOpacity>
                {
                  teamDetail.teamLeader == PlayerData.playerAppID ?
                    <TouchableOpacity style={{ padding: 10, backgroundColor: 'gold', borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}
                      onPress={() => {
                        enableedit()
                      }}
                    >
                      <Text style={{ color: 'black', fontWeight: "bold", fontSize: 20 }}  >Edit</Text>
                      <Icon type={Icons.FontAwesome5} name='user-edit' color='black' size={20} />
                    </TouchableOpacity> :
                    <View style={{ padding: 10, backgroundColor: 'gold', borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center', opacity: .5 }} >
                      <Text style={{ color: 'black', fontWeight: "bold", fontSize: 20 }}  >Edit</Text>
                      <Icon type={Icons.Entypo} name='lock' color='black' size={20} />
                    </View>
                }
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }} >
                <View>
                </View>
                <View>
                  <Text style={{ color: 'white' }} >
                    Win Rate
                  </Text>
                  <Text style={{ color: 'lightgreen', fontSize: 20, alignSelf: 'flex-end' }}  >

                    {
                      teamDetail.WinMatch != 0 ? `${(teamDetail.WinMatch * 100) / teamDetail.teamGameHistory.length} % ` : "0%"
                    }
                  </Text>
                </View>
              </View>
              {
                newPlayerList.map((_, i) => {
                  return (
                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }} >
                      <Text style={{ color: 'white' }} >
                        {_.name}
                      </Text>
                      {editMode ?
                        PlayerData.playerAppID == _.id ?
                          <Icon type={Icons.MaterialIcons} name='group-off' color='green' /> :
                          <TouchableOpacity
                            onPress={() => {
                              confirmRemove(_.id)
                            }}

                          >
                            <Icon type={Icons.MaterialIcons} name='person-remove' color='red' />
                          </TouchableOpacity> :
                        <Text style={{ color: 'white' }} >
                          {_.id}
                        </Text>
                      }

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
              <FlatList
                data={matchHistory}
                renderItem={({ item }) => {
                  return (
                    <View style={{ margin: 10, borderBottomWidth: .5, padding: 5, borderColor: 'gold' }} >
                      <View style={{ backgroundColor: '#4B70F5', flexDirection: "row", justifyContent: 'space-between', padding: 5, borderRadius: 5 }} >
                        <Text style={{ color: 'white', fontWeight: 'bold' }} >#{item.MatchId}</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold' }} >{item.MatchDate}</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold', color: ID == item.WinnerTeam ? "lightgreen" : "red " }} >{ID == item.WinnerTeam ? "Winner" : "Sorry You Lose "}</Text>
                      </View>
                      <FlatList
                        numColumns={4}
                        data={item.TeamID}
                        renderItem={({ item: DATA }) => {
                          return (
                            <View style={{ margin: 3, padding: 3, flex: 4, borderRadius: 10, borderWidth: 1, borderColor: DATA.teamid == item.WinnerTeam ? "lightgreen" : "red" }} >
                              <Text style={{ alignSelf: "center", color: DATA.teamid == item.WinnerTeam ? "lightgreen" : "red", fontSize: 12 }} >
                                {DATA.teamName}
                              </Text>
                            </View>
                          )
                        }}
                      />

                    </View>
                  )
                }}

              />
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