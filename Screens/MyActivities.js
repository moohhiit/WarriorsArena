import { View, Text, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, DataContext } from '../Context/ContextConection'
import EnrolledModal from '../Component/Modal/EnrolledModal'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native';

export default function MyActivities() {
  try {
    const [visibleModal, setVisibbleModal] = useState(false)
    const [MatchDetailArray, setMatichHistoryArray] = useState([])

    const { userLoginDetail } = useContext(AuthContext)
    const { PlayerData, featchDetail, } = useContext(DataContext)

    const Navigation = useNavigation()





    useEffect(() => {
      if (PlayerData.matchhistory) {
        featchDetail('gameData', PlayerData.matchhistory).then((arrayData) => {
          setMatichHistoryArray(arrayData)
        })
      }
    }, [])

    const HIGHT = Dimensions.get('screen').height
    return (
      <View style={{ backgroundColor: 'black', height: HIGHT }} >
        {
          userLoginDetail != null ?
            <>

              <EnrolledModal
                visible={visibleModal}
                onClose={() => setVisibbleModal(false)}
              />
              {
                PlayerData.enrolement ? <View style={{ backgroundColor: "#CEDF9F", margin: 10, borderRadius: 10 }} >
                  <Text style={{ color: "black", padding: 10, fontSize: 16 }} >You are already Enrolled ! </Text>
                </View> : <TouchableOpacity
                  style={{ backgroundColor: 'gold', padding: 10, margin: 10, borderRadius: 10 }}
                  onPress={() => {
                    if (PlayerData.FFUID != null) {
                      setVisibbleModal(true)

                    }
                    else{
                      Alert.alert("Uncomplete Data " , "Update Your Game UID ")
                    }

                  }
                  }>
                  <Text style={{
                    color: 'black', fontSize: 18, fontWeight: 'bold', alignSelf: "center"
                  }} >Enrolled</Text>
                </TouchableOpacity>
              }

              <View>
                {MatchDetailArray.length != 0 ? <FlatList
                  data={MatchDetailArray}
                  renderItem={({ item }) => {
                    return (
                      <View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 10, margin: 10, borderRadius: 10 }} >
                        <View  >
                          <Text style={{
                            color: 'black', fontSize: 20, fontWeight: 'bold',
                            fontFamily: "serif"

                          }}>
                            {item.matchType}
                          </Text>
                          <Text style={{
                            color: 'black', fontSize: 12, fontWeight: 'bold',
                            fontFamily: "serif"

                          }}>
                            {item.map}
                          </Text>
                          <Text style={{
                            color: 'black', fontSize: 12, fontWeight: 'bold',
                            fontFamily: "serif"

                          }}>
                            # {item.MatchId}
                          </Text>
                        </View>
                        <View>
                          <Text style={{
                            color: 'black', fontSize: 20, fontWeight: 'bold',
                            fontFamily: "serif"

                          }}>
                            {item.WinnerTeam == PlayerData.playerAppID ? 'Victory' : 'Defect'}
                          </Text>
                          <Text style={{
                            color: 'black', fontSize: 12, fontWeight: 'bold',
                            fontFamily: "serif"

                          }}>
                            {item.MatchDate}  --  {item.MatchTime}

                          </Text>
                        </View>


                      </View>
                    )
                  }}

                /> : <LottieView source={require('../assert/Game.json')} autoPlay loop style={{ height: 500 }} />}

              </View>


            </>

            : <>


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

