import { View, Text, Dimensions, FlatList, TouchableOpacity, Alert, StyleSheet, Modal } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../Context/ContextConection';
import Icon, { Icons } from './Icons';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function TeamDetail({ route }) {
  const { ID } = route.params;
  const {
    getDetailFromServer,
    PlayerData,
    removePlyerFromTeam,
    featchDetail,
    enrolled,
    findEnrolement,
    handleAcceptplayer,
    handleDenyplayer } = useContext(DataContext)
  const [teamDetail, setteamDetail] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [newPlayerList, setnewPlyerlist] = useState([])
  const [matchHistory, setmatchHistory] = useState([])
  const [modalVisible, setModalVisible] = useState(false);

  const [ec, setEc] = useState(false)



  const height = Dimensions.get('screen').height
    const Navigation = useNavigation()


  const enableedit = () => {
    setEditMode(!editMode)
  }

  const removePlayer = async (id) => {
    setnewPlyerlist((plyer) => plyer.filter((p) => p.id !== id))
    console.log(newPlayerList)
    await removePlyerFromTeam(teamDetail.TeamID, teamDetail.teamMembers, id)
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
  const Enrollemnt = async () => {
    if (teamDetail.teamMembers.length != 4) {
      Alert.alert(
        "Insufficient Players",
        "Your Player is less than 4",
        [

          {
            text: "OK",
          },
        ],
        { cancelable: true }
      );
    }
    else {
      const Enrollemntdata = {
        game: "Free Fire",
        team: ID,
        teamName: teamDetail.teamName
      }
      enrolled(Enrollemntdata)
      Navigation.navigate('Team')
    }

  }
  const checkenroled = async () => {
    let ec = await findEnrolement(ID)
    setEc(ec)
    console.log(ec)
  }

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('PlayerTeams')
      .doc(ID)
      .onSnapshot((snapshot) => {
        setteamDetail(snapshot.data())
      });

    return () => unsubscribe();
  }, [])


  useEffect(() => {
    getteammatchDetail()
  }, [teamDetail])
  useEffect(() => {
    getTeamDetail()
    checkenroled()
  }, [])

  return (

    <View style={{ backgroundColor: 'black', height: height }} >
      {
        teamDetail ?
          <>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)} // Handles back button close
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Request Confirmation</Text>
                  {
                    teamDetail.teamPlayerRequest ? teamDetail.teamPlayerRequest.map((_a, i) => {
                      return (
                        <View key={i} style={{ borderRadius: 10, borderWidth: 1, padding: 10, width: '100%' }}  >
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}  >
                            <View >
                              <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }} >
                                {_a.playerName}
                              </Text>
                              <Text style={{ fontSize: 12, color: 'black' }} >
                                {_a.playerId}
                              </Text>
                            </View>


                            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => {
                              const playerData = {
                                id: _a.playerId,
                                name: _a.playerName
                              }
                              handleAcceptplayer(teamDetail.TeamID, playerData, teamDetail.teamPlayerRequest, _a.playerId)
                              setModalVisible(false)
                            }}>
                              <Text style={styles.buttonText}>Accept</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.denyButton]} onPress={() => {
                              const playerData = {
                                id: _a.playerId,
                                name: _a.playerName
                              }
                              handleDenyplayer(teamDetail.TeamID, teamDetail.teamPlayerRequest, _a.playerId)
                              setModalVisible(false)
                            }}>
                              <Text style={styles.buttonText}>Deny</Text>
                            </TouchableOpacity>

                          </View>
                        </View>
                      )
                    }) : null
                  }


                </View>
              </View>
            </Modal>
            <View style={{ justifyContent: "flex-end", backgroundColor: 'black', height: 100, borderBottomEndRadius: 20, borderBottomLeftRadius: 20, borderBottomColor: "gold", borderWidth: 3, padding: 10 }} >
              <Text style={{ color: 'gold', fontSize: 20, alignSelf: 'center', }} >{teamDetail.teamName}</Text>
            </View>
            <View style={{ padding: 20 }} >

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                <TouchableOpacity style={{ padding: 10, backgroundColor: 'gold', borderRadius: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}
                  onPress={() => setModalVisible(true)}
                >
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
            {
              teamDetail.teamLeader == PlayerData.playerAppID ? ec ? <Text
                style={{ color: "lightgreen", fontSize: 18, margin: 10 }}
              >
                Your Team is Enrolled
              </Text> :
                <TouchableOpacity style={{ backgroundColor: 'green', padding: 5, borderRadius: 5, margin: 10 }} onPress={Enrollemnt} >
                  <Text style={{ color: 'black', fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }} >
                    Enrollment
                  </Text>
                </TouchableOpacity> : null
            }

            <View>
              <View style={{ backgroundColor: 'gold', padding: 5, borderRadius: 5 }}  >
                <Text style={{ color: 'black', fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }} >
                  Match History
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  openButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',

  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  denyButton: {
    backgroundColor: '#f44336',
  },
});