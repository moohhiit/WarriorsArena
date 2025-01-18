import { View, Text, Dimensions, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import OneVsOneBanner from './Convas/OneVsOneBanner';
import { DataContext } from '../Context/ContextConection';


export default function MatchDataDetail({ route }) {
    const [imageurl, setimageurl] = useState('')
    const [teamDetail, setTeamDetail] = useState()
    const [teamplayerDetail, setTeamplayerDetail] = useState([])
    const { MatchId } = route.params
    const HIGHT = Dimensions.get('screen').height
    const { FFCrimageUrl, featchDetail } = useContext(DataContext)


    const getImageUrl = async () => {
        const data = await firestore().collection("appcontrolleradata").doc('images').get()
        const imageUrl = data.data().url
        setimageurl(imageUrl)
    }


    const getplayerDetail = async () => {
        if (teamDetail) {

            const playerdetail = await featchDetail('PlayerTeams', teamDetail.teamteamlist)
            setTeamplayerDetail(playerdetail)
        }
    }


    useEffect(() => {
        const unsubscribe = firestore()
            .collection('gameData')
            .doc(MatchId)
            .onSnapshot(documentSnapshot => {
                setTeamDetail(documentSnapshot.data());
            });

        return () => unsubscribe();
    }, [])
    useEffect(() => {
        getImageUrl()
    }, [])

    useEffect(() => {
        getplayerDetail()
    }, [teamDetail])

    return (
        <View style={{ backgroundColor: 'black', flex: 1 }} >
            <View style={{ flex: .3, borderColor: 'gold', borderBottomWidth: 2, borderRadius: 10 }}  >

                <Text style={{ color: 'gold', alignSelf: 'center', margin: 'auto', fontSize: 20 }}>
                    {teamDetail ? <>
                        #  {teamDetail.MatchId}
                    </>
                        : null}
                </Text>
            </View>
            <View style={{ flex: 2 }} >
                {
                    imageurl ?
                        <Image source={{ uri: imageurl }} style={{ height: 200, borderRadius: 10 }} /> : null
                }
                <View >
                    <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: 'gold', borderRadius: 10 }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                            <Text style={{ color: 'gold' }} >
                                Room id
                            </Text>
                            <Text style={{ color: 'gold' }} >
                                {teamDetail ? teamDetail.roomID != "" ? teamDetail.roomID : '*****' : '*****'}
                            </Text>

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                            <Text style={{ color: 'gold' }} >
                                Room Password
                            </Text>
                            <Text style={{ color: 'gold' }} >
                            {teamDetail ? teamDetail.roomPass != "" ? teamDetail.roomPass : '*****' : '*****'}
                            </Text>

                        </View>
                    </View>
                    <View style={{ margin: 10, borderBottomWidth: 1, borderColor: 'gold', padding: 10 }} >
                        {
                            teamDetail ? <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <Text style={{ color: 'gold' }} >
                                        Game Type :
                                    </Text>
                                    <Text style={{ color: 'gold' }} >
                                        {teamDetail.gameName}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <Text style={{ color: 'gold' }} >
                                        Date :
                                    </Text>
                                    <Text style={{ color: 'gold' }} >
                                        {teamDetail.MatchDate}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <Text style={{ color: 'gold' }} >
                                        Time :
                                    </Text>
                                    <Text style={{ color: 'gold' }} >
                                        {teamDetail.MatchTime}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <Text style={{ color: 'gold' }} >
                                        Status :
                                    </Text>
                                    <Text style={{ color: 'gold' }} >
                                        {teamDetail.status}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <Text style={{ color: 'gold' }} >
                                        Prize :
                                    </Text>
                                    <View style={{ flexDirection: 'row' }} >
                                        <Image source={require('../Component/Coin.png')} style={{ height: 20, width: 20 }} />
                                        <Text style={{ color: 'gold', fontWeight: 'bold' }} >
                                            100
                                        </Text>
                                    </View>
                                </View>
                            </> : null
                        }

                    </View>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }} >


                        {
                            teamplayerDetail ?

                                teamplayerDetail.map((item, i) => {
                                    return (
                                        <View style={{ gap: 10 }} >
                                            <View key={i} >
                                                <Text style={{ color: 'gold', fontSize: 20, margin: 10, marginBottom: 0 }} >
                                                    Team {i + 1}
                                                </Text>
                                                <Text style={{ color: 'gold', fontSize: 12, alignSelf: 'center' }} >
                                                    #{item.TeamID}
                                                </Text>
                                            </View>
                                            <View style={{ gap: 5 }} >
                                                {
                                                    item.teamMembers.map((_p, i) => {
                                                        return (
                                                            <View style={{ marginHorizontal: 5 }} >
                                                                <Text style={{ color: 'gold' }} >
                                                                    {_p.name}
                                                                </Text>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                                : null
                        }

                    </View>
                </View>
            </View>
            <Text>{MatchId}</Text>
        </View>
    )
}