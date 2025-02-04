import { View, Text, FlatList, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../Context/ContextConection'
import firestore from '@react-native-firebase/firestore';
import Icon, { Icons } from '../../Component/Icons';
import { useNavigation } from '@react-navigation/native';
import MovingStars from '../../Component/Animation/Skia/MovingStars';

export default function FreeFireSchedule() {
  const { freeFireScheduleSquard, PlayerData } = useContext(DataContext)

  const [matchDetail, setMatchDetail] = useState([])
  const [refreshing, setrefreshing] = useState(false)

  const [flietlist, setfilterList] = useState([])


  const HIGHT = Dimensions.get('screen').height
  const getCurrentDate = () => {
    const date = new Date(); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  const Navigation = useNavigation()
 
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
    const collectionRef = firestore().collection("gameData");

    const currentdata = getCurrentDate()
    const unsubscribe = collectionRef
      .where("MatchDate", "==", currentdata)
      .onSnapshot(
        (querySnapshot) => {
          const docsArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMatchDetail(docsArray);
        },
        (error) => {
          console.error("Error listening to real-time updates:", error);
        }
      );

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const sortedObjects = sortByTime(matchDetail);
    setfilterList(sortedObjects)

  }, [matchDetail])





  const matchboxdetail = ({ item }) => {
    try {

      return (
        <TouchableOpacity onPress={() => {
          Navigation.navigate("matchDetail", { MatchId: item.id })
        }} >

          <View style={{ margin: 10, borderBottomWidth: .5, padding: 5, borderColor: 'gold' }} >
            <View style={{ backgroundColor: '#4B70F5', flexDirection: "row", justifyContent: 'space-between', padding: 5, borderRadius: 5 }} >
              <Text style={{ color: 'white', fontWeight: 'bold' }} >#{item.MatchId}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} >


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
                  Your team is participating in this game. You will receive the password 5 minutes before the game begins.
                </Text>
              </View>
              : null}

          </View>


        </TouchableOpacity>

      )
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <View style={{ backgroundColor: 'black', height: HIGHT, flex: 1 }} >
      {flietlist.length != 0 ?
        <>
          <FlatList
            onRefresh={() => { console.log('refresh') }}
            refreshing={refreshing}
            data={flietlist}
            renderItem={matchboxdetail}
          />
          {refreshing && <ActivityIndicator size="large" color="#0000ff" />}</>

        :
        <View style={{ flex: 1 }}>
          <View style={{flex:4 , alignContent:"flex-end", backgroundColor:'black'}} >
            <MovingStars />
          </View>
          <View style={{ margin: 'auto', flex: 1.5}} >
            <Text style={{ color: 'gold', justifyContent: 'center', fontSize: 30 }} >
              No Problem
            </Text>
            <Text style={{ color: 'gold', justifyContent: 'center' }} >
              There was no match today
            </Text>
          </View>

        </View>}



    </View>
  )
}