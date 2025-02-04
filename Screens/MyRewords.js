import { View, Text, Dimensions, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { DataContext } from '../Context/ContextConection';

export default function MyRewords() {

  try {
    const [Unclaimedreword, setunclamidreword] = useState([])
    const [claimegamereword, setclaimdgarmreword] = useState([])
    const [historyList, sethistoryList] = useState([])
    const { PlayerData, feacthPlayerdetail } = useContext(DataContext)

    const loadreword = async (col, fn, condition, id, callback) => {
      const querySnapshot = await firestore()
        .collection(col)
        .where(fn, condition, id)
        .get();

      if (!querySnapshot.empty) {
        console.log('User exists!');
        const updatedDocuments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(updatedDocuments);
        console.log("called")

      } else {
        callback([])
        console.log('User does not exist.');

      }
    }
    const handleClamidcoin = async (coll, doc, cc, pi) => {
      try {
        await firestore()
          .collection(coll).doc(doc).update({
            _winningPlayerlist: firestore.FieldValue.arrayRemove(pi),
            _claimedRewordList: firestore.FieldValue.arrayUnion(pi)
          })
        const totalcoin = PlayerData.coinCollection + cc
        const msg = ` Claimed ${cc} WawCoin `
        await firestore()
          .collection('playerInfo').doc(PlayerData.id).update({
            coinCollection: totalcoin,
            _rewordhistory: firestore.FieldValue.arrayUnion(msg)
          })

      } catch (error) {
        console.log("Not calimed", error)
      } finally {
        feacthPlayerdetail(PlayerData.id);
        loadreword('gameReword', '_winningPlayerlist', 'array-contains', PlayerData.playerAppID, setclaimdgarmreword)
      }


    }

    const handleClamedRedeem = async (coll, doc, pi, rcost, rcode, rcey) => {
      try {
        await firestore()
          .collection(coll).doc(doc).update({
            _avilableplayerid: '',
            _sussefullyclamed: pi
          })
        const msg = ` Claimed ${rcey}${rcost} Redeem Code  ${rcode} `
        await firestore()
          .collection('playerInfo').doc(PlayerData.id).update({
            _rewordhistory: firestore.FieldValue.arrayUnion(msg)
          })

      } catch (error) {
        console.log("Not calimed", error)
      } finally {
        feacthPlayerdetail(PlayerData.id);
        loadreword('rewordRequested', '_avilableplayerid', '==', PlayerData.playerAppID, setunclamidreword)
      }
    }

    useEffect(() => {
      try {
        const List = PlayerData._rewordhistory
        const reverseList = List.reverse();
        sethistoryList(reverseList)
      } catch (e) {
        console.log("No history")
      }

    }, [PlayerData])

    useEffect(() => {
      loadreword('rewordRequested', '_avilableplayerid', '==', PlayerData.playerAppID, setunclamidreword)
      loadreword('gameReword', '_winningPlayerlist', 'array-contains', PlayerData.playerAppID, setclaimdgarmreword)

    }, [])

    return (
      <View style={{ backgroundColor: 'black', flex: 1 }}>
        {
          claimegamereword.length != 0 || Unclaimedreword != 0 ?

            <ScrollView style={{ backgroundColor: 'black' }} >
              {
                claimegamereword ? claimegamereword.map((_item, _index) => {
                  return (
                    <View key={_index} style={{ borderWidth: 1, borderColor: "white", padding: 10, margin: 5, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between' }} >
                      <View>

                        <Text style={{ color: 'gold', alignSelf: 'center' }} >
                          Well done! Your match-winning reward is ready!
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 5 }} >

                          <Image source={require('../Component/Coin.png')} style={{ height: 22, width: 22 }}  ></Image>
                          <Text style={{ color: 'gold', alignSelf: 'center' }} >
                            {_item._winnigCoin}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity style={{ backgroundColor: 'gold', padding: 10, borderRadius: 10 }}
                        onPress={() => {
                          handleClamidcoin("gameReword", _item.id, _item._winnigCoin, PlayerData.playerAppID)
                        }}
                      >
                        <Text style={{ color: 'black', fontWeight: 'bold' }} >
                          Claim
                        </Text>
                      </TouchableOpacity>

                    </View>
                  )
                }) : null
              }

              {
                Unclaimedreword ? Unclaimedreword.map((_item, _index) => {
                  return (
                    <View key={_index} style={{ borderWidth: 1, borderColor: "white", padding: 10, margin: 5, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between' }} >
                      <View>

                        <Text style={{ color: 'gold', alignSelf: 'center' }} >
                          Claim your Reedeam of {_item._currency}{_item._cost} now!
                        </Text>
                        <Text style={{ color: 'gold', alignSelf: 'center' }} >
                          {_item._reedeamCode}
                        </Text>
                      </View>
                      <TouchableOpacity style={{ backgroundColor: 'gold', padding: 10, borderRadius: 10 }}
                        onPress={() => {
                          handleClamedRedeem('rewordRequested', _item.id, PlayerData.playerAppID, _item._cost, _item._reedeamCode, _item._currency)
                        }}

                      >
                        <Text style={{ color: 'black', fontWeight: 'bold' }} >
                          Claim
                        </Text>
                      </TouchableOpacity>

                    </View>
                  )
                }) : null
              }


            </ScrollView> : null
        }
        <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center', margin: 10 }} >
          Reword History
        </Text>
        <FlatList
          data={historyList}
          renderItem={({ item, index }) => {
            return (
              <Text style={{ color: 'lightgreen', alignSelf: 'flex-start', marginHorizontal: 15, marginVertical: 4 }} >
                {index + 1}  {item}
              </Text>
            )
          }}
        />

      </View>

    )
  } catch (error) {
    console.log(error)
  }

}