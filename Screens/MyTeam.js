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
    const { PlayerData, TeamList } = useContext(DataContext)
    const [TeamrequestVisible, setTeamRequestVisible] = useState(false)
    const [CreateTeamVisible, setCreateTeamVisible] = useState(false)




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

                    <Icon type={Icons.AntDesign} name='search1' color='black' size={30} />
                    <Text style={{ fontWeight: 1, fontSize: 18, alignSelf: 'center', color: 'black' , fontWeight:'bold' }}  >
                      Send Request
                    </Text>

                  </View>

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCreateTeamVisible(true)}

                  style={{ backgroundColor: 'gold', flex: 2, margin: 10, borderRadius: 10 }} >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 6 }} >
                    <Icon type={Icons.MaterialCommunityIcons} name='view-grid-plus' color='black' />
                    <Text style={{ fontWeight: 1, fontSize: 18, alignSelf: 'center', color: 'black' , fontWeight:'bold'}}  >
                      Create Team
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
              {
                TeamList != null ?
                  <>
                    {
                      TeamList.length ? <ScrollView style={{ marginBottom: 60 }} >

                        <View
                          style={{ borderBottomWidth: 1, marginHorizontal: 10 }}

                        >
                          {
                            TeamList.map((_t, i) => {
                              return (
                                <View key={i} style={{ borderBottomColor: 'gold', borderBottomWidth: 1 }} >

                                  <TouchableOpacity style={{ justifyContent: 'space-between', flexDirection: "row", margin: 10, backgroundColor: '#7A1CAC', padding: 10, borderRadius: 10 }} onPress={() => { Navigation.navigate('TeamDetail', { ID: _t.TeamID }) }}  >
                                    <Text style={{ color: 'white', fontSize: 20, fontFamily: "serif" }}  >{_t.teamName}</Text>
                                    <Text style={{ color: 'white', alignSelf: "center" }}  >#{_t.TeamID}</Text>
                                    <Text style={{ color: 'white', alignSelf: "center" }}  >{_t.game}</Text>
                                  </TouchableOpacity>
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 15 }} >
                                      <Text style={{ color: "white" }} >
                                        Team Created
                                      </Text>
                                      <Text style={{ color: "gold" }} >
                                        {
                                          _t.teamLeader
                                        }
                                      </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 15 }} >
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
                                      <View style={{ justifyContent: "space-between", paddingTop: 15, borderLeftWidth: 1, borderRightWidth: 1, marginTop: 0, padding: 20 }} >
                                        {_t.teamMembers.map((_, i) => {
                                          return (
                                            <View key={i} style={{ justifyContent: 'space-between', flexDirection: 'row' }}  >
                                              <Text style={{ color: 'white' }} >
                                                {_.name}
                                              </Text>
                                              <Text style={{ color: 'white' }} >
                                                {_.id}
                                              </Text>
                                            </View>
                                          )
                                        })}


                                      </View>

                                      :

                                      <Text style={{ color: 'White' }} >
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
                    <LottieView
                      source={require('../assert/Team.json')}
                      style={{ height: 500 }}
                      autoPlay
                      loop
                    />
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