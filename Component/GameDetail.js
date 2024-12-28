import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Icon, { Icons } from './Icons'
import { constant } from '../Navigation/drawer/constant'
import { DataContext } from '../Context/ContextConection'

export default function GameDetail() {

    const [FFuid, setFFuid] = useState(null)
    const [BGMIuid, setBGMIuid] = useState(null)
    const [iseditmode, setiseditmode] = useState(false)

    const { UpdateGameUid, PlayerData } = useContext(DataContext)

    const UpdateGameId = () => {
        if (FFuid != null || BGMIuid != null) {
            UpdateGameUid(FFuid, BGMIuid)
        }
        if (FFuid != null && BGMIuid != null) {
            UpdateGameUid(FFuid, BGMIuid)
        }
        setiseditmode(false)
    }

    try {
        return (
            <View style={[styles.view, styles.marginVertical, { backgroundColor: 'black', marginBottom: 0 }]}>
                <View style={{ justifyContent: "space-between", flexDirection: "row" }} >

                    <Text style={{ color: "gold" }} >
                        Game Detail
                    </Text>
                    <TouchableOpacity
                        onPress={setiseditmode}

                    >

                        <Icon type={Icons.Entypo} name={'edit'} color={'gold'} size={20} />
                    </TouchableOpacity>
                </View>
                <View>{
                    iseditmode ? <>
                        <View style={{ flexDirection: 'row', margin: 5, marginTop: 10 }} >
                            <Text style={{ flex: 1, color: 'gold', fontSize: 15, alignSelf: "center" }} >
                                Free Fire
                            </Text>
                            <TextInput inputMode='tel' placeholder='Enter Uid' placeholderTextColor='gold' style={{ padding: 5, color: 'gold', borderWidth: 1, borderColor: 'gold', borderRadius: 5, flex: 2 }} onChangeText={(value) => {
                                setFFuid(value)
                            }} />
                        </View>
                        {/* <View style={{ flexDirection: 'row', margin: 5 }} >
                            <Text style={{ flex: 1, color: 'gold', fontSize: 15, alignSelf: "center" }} >
                                BGMI
                            </Text>
                            <TextInput inputMode='tel' placeholder='Enter Uid' placeholderTextColor='gold' style={{ padding: 5, color: 'gold', borderWidth: 1, borderColor: 'gold', borderRadius: 5, flex: 2 }} onChangeText={(value) => {
                                setBGMIuid(value)
                            }} />
                        </View> */}
                        <TouchableOpacity style={{ backgroundColor: 'gold', margin: 5, borderRadius: 5, padding: 5 }}
                            onPress={UpdateGameId}
                        >
                            <Text style={{ color: 'black', alignSelf: "center" }} >
                                Update Changes
                            </Text>
                        </TouchableOpacity>
                    </> : <>
                        <View style={{ flexDirection: 'row', margin: 5, marginTop: 10 }} >
                            <Text style={{ flex: 1, color: 'gold', fontSize: 15, alignSelf: "center" }} >
                                Free Fire
                            </Text>
                            {PlayerData.FFUID ? <Text style={{ flex: 1, color: 'gold', fontSize: 15, alignSelf: "center" }} >
                                # {PlayerData.FFUID}
                            </Text> : <Text style={{ flex: 1, color: 'gold', fontSize: 12, alignSelf: "center" }} >
                                Id not Updated
                            </Text>}

                        </View>
                        {/* <View style={{ flexDirection: 'row', margin: 5 }} >
                            <Text style={{ flex: 1, color: 'gold', fontSize: 15, alignSelf: "center" }} >
                                BGMI
                            </Text>
                            {PlayerData.BGMIUID ? <Text style={{ flex: 1, color: 'gold', fontSize: 15, alignSelf: "center" }} >
                                # {PlayerData.BGMIUID}
                            </Text> : <Text style={{ flex: 1, color: 'gold', fontSize: 12, alignSelf: "center" }} >
                                Id not Updated
                            </Text>}
                        </View> */}
                    </>
                }

                </View>

            </View>
        )
    } catch (error) {
        console.log(error)
    }

}
const styles = StyleSheet.create({

    view: {
        backgroundColor: 'black',
        borderRadius: constant.borderRadius,
        marginHorizontal: constant.SPACING / 2,
        padding: constant.SPACING / 1.5,
    },



    marginVertical: {
        marginVertical: constant.SPACING / 2,
    },




})