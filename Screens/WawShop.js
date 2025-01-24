import React, { useContext, useRef, useState } from 'react'
import Icon, { Icons } from '../Component/Icons'
import { DataContext } from '../Context/ContextConection'
import { View, Text, FlatList, TouchableOpacity, Animated, StyleSheet, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function WawShop() {
  const [buttonStates, setButtonStates] = useState({});
  const { PlayerData } = useContext(DataContext)
  const array = [
    {
      _id: 1,
      _type: "Google Play Recharge Code ",
      _cost: 10,
      _coincost: 100,
      _iconname: 'logo-google-playstore',
      _color: 'gold',
      _currency: '₹'
    },
    {
      _id: 2,
      _type: "Google Play Recharge Code ",
      _cost: 30,
      _coincost: 200,
      _iconname: 'logo-google-playstore',
      _color: 'gold',
      _currency: '₹'
    },
    {
      _id: 3,
      _type: "Google Play Recharge Code ",
      _cost: 50,
      _coincost: 300,
      _iconname: 'logo-google-playstore',
      _color: 'gold',
      _currency: '₹'
    },
    {
      _id: 4,
      _type: "Google Play Recharge Code ",
      _cost: 100,
      _coincost: 500,
      _iconname: 'logo-google-playstore',
      _color: 'gold',
      _currency: '₹'
    },

    {
      _id: 5,
      _type: "Diamond Top-Up in Game ",
      _cost: 100,
      _coincost: 300,
      _iconname: 'diamond',
      _color: '#3DC2EC',
      _currency: ''
    },
    {
      _id: 6,
      _type: "Diamond Top-Up in Game",
      _cost: 200,
      _coincost: 500,
      _iconname: 'diamond',
      _color: '#3DC2EC',
      _currency: ''
    },
    {
      _id: 7,
      _type: "Diamond Top-Up in Game",
      _cost: 500,
      _coincost: 1000,
      _iconname: 'diamond',
      _color: '#3DC2EC',
      _currency: ''
    },
    {
      _id: 8,
      _type: "Diamond Top-Up in Game",
      _cost: 1000,
      _coincost: 1500,
      _iconname: 'diamond',
      _color: '#3DC2EC',
      _currency: ''
    },
    {
      _id: 9,
      _type: "",
      _cost: "Weekly Membership",
      _coincost: 2000,
      _iconname: 'card-outline',
      _color: 'gold',
      _currency: ''
    },
    {
      _id: 10,
      _type: "",
      _cost: "Monthly Membership",
      _coincost: 3000,
      _iconname: 'card-outline',
      _color: 'gold',
      _currency: ''
    },


  ]


  const animationRefs = useRef({});


  const handleRequest = async (data_) => {
    try {
      console.log(PlayerData.id)
      const userDocRef = firestore().collection('playerInfo').doc(PlayerData.id)
      const coinsum = PlayerData.coinCollection - data_._coincost
      userDocRef.update({
        coinCollection: coinsum
      })

      let docReaf = firestore().collection('rewordRequested')
      docReaf.add({ ...data_, requestedPlayerID: PlayerData.playerAppID, _sussefullyclamed: '' }
      ).then(() => {
        console.log('Successfully Requested ')
      })
    } catch (error) {
      console.worn("Error Handled")
    }
  }

  const handlePress = (item) => {
    const animationRef = animationRefs.current[item._id];
    Animated.sequence([
      Animated.timing(animationRef, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animationRef, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handlepurchase(item);
   
    });
  };
  const handlepurchase = (i) => {
    if (PlayerData.coinCollection < i._coincost) {
      Alert.alert("Insufficient waw coin ")
    }
    else {
      setButtonStates((prev) => ({ ...prev, [i._id]: 'Added' }));
      handleRequest(i)
      
    }
  }
  const renderCards = ({ item }) => {
    if (!animationRefs.current[item._id]) {
      animationRefs.current[item._id] = new Animated.Value(1);
    }
    const animationRef = animationRefs.current[item._id];
    const buttonText = buttonStates[item._id] || 'Buy';
    return (
      <View style={{ height: 120, backgroundColor: 'black', borderRadius: 10, gap: 10, borderColor: 'gold', borderWidth: 1, marginVertical: 5 }} >
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between' }}  >
          <Icon type={Icons.Ionicons} name={item._iconname} color={item._color} style={{ alignSelf: "center" }} size={60} ></Icon>
          <View style={{ gap: 20, padding: 10 }} >
            <Text style={{ color: 'gold', fontSize: 18, alignSelf: 'center', }} >
              {item._type}{item._currency} {item._cost}
            </Text>

            <Animated.View style={{ transform: [{ scale: animationRef }], alignSelf: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => { handlePress(item) }}
                disabled={buttonText === 'Added'}
                style={{ borderRadius: 10, backgroundColor: '#4B70F5', padding: 8, flexDirection: 'row', justifyContent: 'center', width: 120, gap: 10 }} >
                {
                  buttonText === 'Added' ?
                    null :
                    <Image source={require('../Component/Coin.png')} style={{ height: 30, width: 30, alignSelf: 'center' }} />
                }
                <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20 }} >

                  {buttonText === 'Added' ? "Requested" : item._coincost}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>



      </View>
    )
  }

  return (
    <View style={{ backgroundColor: 'black', flex: 1, padding: 10 }} >
      <FlatList
        data={array}
        renderItem={renderCards}
      />
    </View>
  )
}