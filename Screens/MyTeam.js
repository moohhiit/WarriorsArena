import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, DataContext } from '../Context/ContextConection'
import { useNavigation } from '@react-navigation/native'
import Icon, { Icons } from '../Component/Icons'
import TeamRequestModal from '../Component/Modal/TeamRequestModal'
import CreateTeamModal from '../Component/Modal/CreateTeamModal'
import LottieView from 'lottie-react-native';

export default function MyTeam() {
  try {
    const { initializing } = useContext(AuthContext)
    const { PlayerData, featchDetail } = useContext(DataContext)
    const [isteam, setisteam] = useState(false)
    const [TeamrequestVisible, setTeamRequestVisible] = useState(false)
    const [CreateTeamVisible, setCreateTeamVisible] = useState(false)
    const [td, settd] = useState([])


    const detail = async () => {
      try {
        if (PlayerData) {
          if (PlayerData.TeamDeatile) {
            const d = await featchDetail('PlayerTeams', PlayerData.TeamDeatile)
            settd(d)
            setisteam(true)
          }
          else {
            setisteam(false)
          }
        }
      } catch (error) {
        console.log(error)
      }

    }



    useEffect(() => {
      detail()
    }, [])

    const Navigation = useNavigation()
    const HIGHT = Dimensions.get('screen').height
    return (

      <View style={{ backgroundColor: 'black', height: HIGHT }} >

        {
          !initializing ?

            <>

              <TeamRequestModal
                visible={TeamrequestVisible}
                onClose={() => setTeamRequestVisible(false)}
                teamrequestDetail={PlayerData ? PlayerData.teamRequest : null}
              />
              <CreateTeamModal

                visible={CreateTeamVisible}
                onClose={() => setCreateTeamVisible(false)}

              />
              <View style={{ justifyContent: 'space-between', flexDirection: "row" }} >

                <TouchableOpacity
                  style={{ backgroundColor: 'gold', flex: 2, margin: 10, borderRadius: 10 }}
                  onPress={() => setTeamRequestVisible(true)}

                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 6 }} >
                    <Text style={{ fontWeight: 1, fontSize: 18, alignSelf: 'center', fontWeight: 'bold', color: 'black' }}  >
                      {PlayerData ? PlayerData.teamRequest.length : null}
                    </Text>
                    <Icon type={Icons.AntDesign} name='team' color='black' size={30} />
                    <Text style={{ fontWeight: 1, fontSize: 18, alignSelf: 'center', color: 'black' }}  >
                      Team Request
                    </Text>

                  </View>

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCreateTeamVisible(true)}

                  style={{ backgroundColor: 'gold', flex: 2, margin: 10, borderRadius: 10 }} >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 6 }} >
                    <Icon type={Icons.MaterialCommunityIcons} name='view-grid-plus' color='black' />
                    <Text style={{ fontWeight: 1, fontSize: 18, alignSelf: 'center', color: 'black' }}  >
                      Create Team
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
              {
                isteam ?
                  <>
                    {
                      td.length ? <ScrollView style={{ marginBottom: 60 }} >

                        <View
                          style={{ borderBottomWidth: 1, marginHorizontal: 10 }}

                        >
                          {
                            td.map((_t, i) => {
                              return (
                                <View key={i} style={{ borderBottomColor: 'gold', borderBottomWidth: 1 }} >

                                  <TouchableOpacity style={{ justifyContent: 'space-between', flexDirection: "row", margin: 10, backgroundColor: '#7A1CAC', padding: 10, borderRadius: 10 }} onPress={()=>{Navigation.navigate('TeamDetail')}}  >
                                    <Text style={{ color: 'white', fontSize: 20, fontFamily: "serif" }}  >{_t.teamName}</Text>
                                    <Text style={{ color: 'white', alignSelf: "center" }}  >#{_t.TeamID}</Text>
                                    <Text style={{ color: 'white', alignSelf: "center" }}  >{_t.game}</Text>
                                  </TouchableOpacity>
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <View>

                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 10 , marginHorizontal:10}} >
                                      <Text style={{ color: "white" }} >
                                        Win Rate :
                                      </Text>
                                      <Text style={{ color: "green" }} >
                                        {
                                          _t.WinMatch != 0 ? `${_t.WinMatch / _t.teamGameHistory.length * 100} % ` : "0%"
                                        }
                                      </Text>
                                    </View>
                                  </View>
                                  <View>
                                    {_t.teamMembers ?
                                      <View style={{ justifyContent: "space-between",  paddingTop: 5, borderLeftWidth: 1, borderRightWidth: 1, marginTop: 0 }} >
                                        <FlatList
                                          contentContainerStyle={{
                                            flexGrow: 1,
                                            justifyContent: 'space-between',
                                          }}
                                          numColumns={2}
                                          data={_t.teamMembers}
                                          renderItem={({ item }) => {
                                            return (
                                              <View style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: 5
                                              }} >
                                                {/* <Icon type={Icons.FontAwesome5} name='crown' color='gold' /> */}
                                                <Text style={{
                                                  color: 'white', fontSize: 15,
                                                }}
                                                >
                                                  {item.name}
                                                </Text>
                                              </View>
                                            )
                                          }}
                                        ></FlatList>

                                      </View>

                                      :

                                      <Text style={{ color: 'black' }} >
                                        Team Member
                                      </Text>


                                    }

                                  </View>
                                </View>
                              )
                            })
                          }
                        </View>
                      </ScrollView> :
                        <LottieView
                          source={require('../assert/Team.json')}
                          style={{ height: 500 }}
                          autoPlay
                          loop
                        />
                    }
                  </>
                  :
                  <>
                    <ActivityIndicator size="large" color="#00ff00" />

                  </>
              }

            </  > :
            <>

              <LottieView
                source={require('../assert/Login.json')}
                style={{ height: 600 }}
                loop
                autoPlay
              />
              <TouchableOpacity
                onPress={() => {
                  Navigation.navigate('LoginScreen')
                }}

                style={{ backgroundColor: '#A1D6B2', margin: 10, padding: 10, borderRadius: 10 }}

              >

                <Text style={{
                  color: 'black', fontSize: 20, fontWeight: 'bold',
                  fontFamily: "serif", alignSelf: "center"
                }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </>
        }
      </View>
    )
  } catch (error) {
    console.log(error)
  }

}