import { Modal, View, Text, ActivityIndicator, Button, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, DataContext } from '../../Context/ContextConection';
import Icon, { Icons } from '../Icons';
import { Dropdown } from 'react-native-element-dropdown';

export default function EnrolledModal({ visible, onClose, users, loading, error }) {
try {
    const { PlayerData, enrolled } = useContext(DataContext)


    const [teamlist, setTeamList] = useState(null)
    const [selectedGame, setselectedGame] = useState(null);
    const [selectedTeam, setselectedTeam] = useState(null);
    const [selectedTime, setselectedTime] = useState(null);
    const [selectedMap, setselectedMap] = useState(null);
    const [selectedGameType, setselectedGameType] = useState(null);
    const [refresh, setrefresh] = useState(false)

    const time = [

        { label: '5:00PM - 6:00PM', value: '5-6' },
        { label: '7:00PM - 8:00PM', value: '7-8' },
        { label: '8:00PM - 9:00PM', value: '8-9' },
        { label: '9:00PM - 10:00PM', value: '9-10' },
        { label: '10:00PM - 11:00PM', value: '10-11' },
        { label: '11:00PM - 12:00PM', value: '11-12' },
        { label: '12:00AM - 1:00AM', value: '12-1' },
        { label: '1:00AM - 2:00AM', value: '1-2A' },
        { label: '2:00AM - 3:00AM', value: '2-3A' },
        { label: '3:00AM - 4:00AM', value: '3-4A' },
        { label: '4:00AM - 5:00AM', value: '4-5A' },
    ]
    const FreeFireMapOption = [
        { label: 'Bermuda', value: 'Bermuda' },
        { label: 'Kalahari', value: 'Kalahari' },
        { label: 'Nexterra', value: 'Nexterra' },
        { label: 'Alpine', value: 'Alpine' },
    ]

    // const BGMIMapOption = [
    //     { label: 'Erangel', value: 'Erangel' },
    //     { label: 'Sanhok', value: 'Sanhok' },
    //     { label: 'Miramar', value: 'Miramar' },
    // ]

    // const GameType = [
    //     { label: 'Full Map', value: 'Full Map' },
    //     { label: '1 Vs 1', value: '1v1' },
    // ]

    // const Game = [
    //     { label: 'BGMI', value: 'BGMI' },
    //     { label: 'Free Fire', value: 'Free Fire' },
    // ];

    const enrolementun = () => {

        if (selectedMap != null && selectedTeam != null && selectedTime != null ) {
            const endata = {
                game: "Free Fire",
                map: selectedMap,
                team: selectedTeam,
                time: selectedTime,
            }
            setrefresh(true)
            enrolled(endata)
            setTimeout(() => {
                setrefresh(false)
                onClose()
            }, 4000);
        }
    }

    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>

            </View>
        );
    }

    useEffect(() => {
        if (PlayerData.TeamDeatile) {

            const objectArray = PlayerData.TeamDeatile.map(item => {
                return { label: item, value: item };
            });
            setTeamList(objectArray)
        }
    }, [])

    return (
        <Modal visible={visible} transparent={true} animationType="slide">


            <ScrollView style={styles.modalView}>


                <Text style={{ alignSelf: 'center', color: 'black', fontSize: 25, fontWeight: 'bold', margin: 15 }}>Enrolled in Game</Text>
                {/* <View style={{ flexDirection: "row", margin: 5 }} >
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', flex: 1, alignSelf: 'center' }} >
                        Game :

                    </Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={Game}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Game.."
                        searchPlaceholder="Search..."
                        value={selectedGame}
                        onChange={item => {
                            setselectedGame(item.value);
                        }}
                        renderLeftIcon={() => (
                            <Icon type={Icons.Ionicons} name='checkmark-done-circle' color='green' size={20} style={{ marginHorizontal: 10 }} />
                        )}
                        renderItem={renderItem}
                    />
                </View> */}
                <View style={{ flexDirection: "row", margin: 5 }} >
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', flex: 1, alignSelf: 'center' }} >
                        Team :

                    </Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={teamlist}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Team"
                        searchPlaceholder="Search..."
                        value={selectedTeam}
                        onChange={item => {
                            setselectedTeam(item.value);
                        }}
                        renderLeftIcon={() => (
                            <Icon type={Icons.Ionicons} name='checkmark-done-circle' color='green' size={20} style={{ marginHorizontal: 10 }} />
                        )}
                        renderItem={renderItem}
                    />
                </View>
                <View style={{ flexDirection: "row", margin: 5 }} >
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', flex: 1, alignSelf: 'center' }} >
                        Time :

                    </Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={time}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Time"
                        searchPlaceholder="Search..."
                        value={selectedTime}
                        onChange={item => {
                            setselectedTime(item.value);
                        }}
                        renderLeftIcon={() => (
                            <Icon type={Icons.Ionicons} name='checkmark-done-circle' color='green' size={20} style={{ marginHorizontal: 10 }} />
                        )}
                        renderItem={renderItem}
                    />
                </View>
                {/* <View style={{ flexDirection: "row", margin: 5 }} >
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', flex: 1, alignSelf: 'center' }} >
                        Match :

                    </Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={GameType}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Game Type"
                        searchPlaceholder="Search..."
                        value={selectedGameType}
                        onChange={item => {
                            setselectedGameType(item.value);
                        }}
                        renderLeftIcon={() => (
                            <Icon type={Icons.Ionicons} name='checkmark-done-circle' color='green' size={20} style={{ marginHorizontal: 10 }} />
                        )}
                        renderItem={renderItem}
                    />
                </View> */}
                <View style={{ flexDirection: "row", margin: 5 }} >
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', flex: 1, alignSelf: 'center' }} >
                        Map :

                    </Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={FreeFireMapOption}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Map"
                        searchPlaceholder="Search..."
                        value={selectedMap}
                        onChange={item => {
                            setselectedMap(item.value);
                        }}
                        renderLeftIcon={() => (
                            <Icon type={Icons.Ionicons} name='checkmark-done-circle' color='green' size={20} style={{ marginHorizontal: 10 }} />
                        )}
                        renderItem={renderItem}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 20 }} >
                    <TouchableOpacity
                        style={{ backgroundColor: 'red', padding: 8, borderRadius: 10 }}
                        onPress={onClose}
                    >
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }} >
                            Cancle
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ backgroundColor: "#41B3A2", padding: 10, borderRadius: 5 }}
                        onPress={enrolementun}
                    >
                        {refresh ? <ActivityIndicator size="small" color="#0000ff" />: <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }} >
                            Enrolled
                        </Text>}

                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    )
} catch (error) {
    console.log(error)
}
    
}

const styles = StyleSheet.create({
    dropdown: {

        flex: 2,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        gap: 10,
        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
        color: 'black'
    },
    placeholderStyle: {
        fontSize: 16,
        color: 'black',

    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'black'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: 'black'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        flex: 3,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        alignSelf: 'center',
        color: 'black',
        justifyContent: 'center'

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkedBox: {
        width: 12,
        height: 12,
        backgroundColor: '#000',
    },
    label: {
        fontSize: 16,
    },
});