import { View, Text, FlatList, ActivityIndicator, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../Context/ContextConection'
import firestore from '@react-native-firebase/firestore';
import Icon, { Icons } from '../../Component/Icons';

export default function FreeFireSchedule() {
  const { freeFireScheduleSquard, PlayerData } = useContext(DataContext)

  const [matchDetail, setMatchDetail] = useState([])
  const [refreshing, setrefreshing] = useState(false)

  const [flietlist, setfilterList] = useState([])


  const HIGHT = Dimensions.get('screen').height

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


  function sortByTime(objList) {
    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      let hours24 = hours % 12;
      if (modifier === "PM") hours24 += 12;

      const date = new Date();
      date.setHours(hours24);
      date.setMinutes(minutes);
      date.setSeconds(0);
      date.setMilliseconds(0);

      return date;
    };

    return objList.sort((a, b) => parseTime(a.MatchTime) - parseTime(b.MatchTime));
  }


  useEffect(() => {
    const sortedObjects = sortByTime(matchDetail);
    setfilterList(sortedObjects)

  }, [matchDetail])


  useEffect(() => {
    if (freeFireScheduleSquard) {

      FeatchMatchdetail(freeFireScheduleSquard)
    }
  }, [freeFireScheduleSquard])

  const matchboxdetail = ({ item }) => {
    try {

      return (

        <View style={{ margin: 10, borderBottomWidth: .5, padding: 5, borderColor: 'gold' }} >
          <View style={{ backgroundColor: '#4B70F5', flexDirection: "row", justifyContent: 'space-between', padding: 5, borderRadius: 5 }} >
            <Text style={{ color: 'white', fontWeight: 'bold' }} >#{item.MatchId}</Text>
            <View style={{flexDirection:'row' , alignItems:'center' , gap:5}} >


              {item.status == "Live" ?
                <>
                  <Icon type={Icons.Octicons} name={"dot-fill"} color={"red"} style={{ alignSelf: 'center' }} ></Icon>
                  <Text style={{ color: 'white', fontWeight: 'bold' }} >
                    {item.status}
                  </Text>
                </> : <Text style={{ color: 'white', fontWeight: 'bold' }} >
                    {item.status}
                  </Text>}

            </View>
            <Text style={{ color: 'white', fontWeight: 'bold' }} >{item.MatchTime}</Text>
          </View>
          <FlatList
            numColumns={4}
            data={item.TeamID}
            renderItem={({ item }) => {
              return (
                <View style={{ margin: 3, padding: 3, flex: 4, borderRadius: 10, borderWidth: 1, borderColor: 'gold' }} >
                  <Text style={{ alignSelf: "center", color: 'white', fontSize: 12 }} >
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
              <Text style={{ color: 'lightgreen', marginHorizontal: 10 }} >

                Your team is in this game, you will get  password 5 minutes before the start of the game.
              </Text>
            </View>
            : null}

        </View>



      )
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <View style={{ backgroundColor: 'black', height: HIGHT }} >
      <FlatList
        onRefresh={() => { FeatchMatchdetail(freeFireScheduleSquard) }}
        refreshing={refreshing}
        data={flietlist}
        renderItem={matchboxdetail}
      />
      {refreshing && <ActivityIndicator size="large" color="#0000ff" />}



    </View>
  )
}