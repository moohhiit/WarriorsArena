import { Modal, View, Text, ActivityIndicator, Button, FlatList, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react'
import Icon, { Icons } from '../Icons';
import { DataContext } from '../../Context/ContextConection';

export default function TeamRequestModal({ visible, onClose, users, loading, error, teamrequestDetail }) {
    try {
        const { AcceptTeam, rejctteam } = useContext(DataContext)



    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                    <FlatList
                        data={teamrequestDetail}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ backgroundColor: '#FFFBE6', padding: 10, flexDirection: 'row', justifyContent: 'space-between' , borderWidth:.5 , borderRadius:10}} >
                                    <View>
                                        <Text style={{ color: 'black', fontSize: 20 }} >
                                            {item.teamName}
                                        </Text>
                                        <Text style={{ color: 'black' }} >
                                            #{item.teamId}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            AcceptTeam(item.teamId)
                                            setTimeout(()=>{
                                                onClose()
                                            },2000)
                                        }}


                                    >

                                        <Icon type={Icons.Octicons} name='check-circle' color='green' size={35} />

                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            rejctteam(item.teamId)
                                            setTimeout(()=>{
                                                onClose()       
                                            },2000)
                                        }}


                                    >
                                        <Icon type={Icons.Octicons} name='x-circle' color='red' size={35} />

                                    </TouchableOpacity>
                                </View>
                            )
                        }}

                    />

                    <TouchableOpacity style={{ backgroundColor: '#36C2CE', padding: 10, borderRadius: 10, margin: 20 }}
                        onPress={onClose}

                    >
                        <Text style={{ color: 'black', fontWeight: 'bold', alignSelf: "center", fontSize: 20 }} >Close</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    )
    } catch (error) {
        console.log(error)
    }
    
}