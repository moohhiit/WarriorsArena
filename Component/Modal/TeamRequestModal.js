import { Modal, View, Text, ActivityIndicator, Button, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import Icon, { Icons } from '../Icons';
import { DataContext } from '../../Context/ContextConection';
import firestore from '@react-native-firebase/firestore';

export default function TeamRequestModal({ visible, onClose, users, loading, error, teamrequestDetail }) {
    try {
        const { PlayerData } = useContext(DataContext)
        const [query, setQuery] = useState('');
        const [results, setResults] = useState([]);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            if (query.trim() === '') {
                setResults([]);
                return;
            }

            const debounceTimer = setTimeout(() => {
                performSearch(query);
            }, 300);

            return () => clearTimeout(debounceTimer);
        }, [query]);


        const sendRequest = async (id, data, platerid) => {
            const firref = firestore().collection('PlayerTeams').doc(id)
            try {
                await firref.update({
                    teamPlayerRequest: firestore.FieldValue.arrayUnion(data),
                    PastRequestonTeam: firestore.FieldValue.arrayUnion(platerid),
                });
                console.log('Value added to array');
            } catch (error) {
                console.error('Error updating document: ', error);
            }
        }

        const performSearch = async (text) => {
            setLoading(true);
            try {
                const snapshot = await firestore()
                    .collection('PlayerTeams')
                    .where('TeamID', '>=', text)
                    .where('TeamID', '<=', text + '\uf8ff')
                    .get();

                const docs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setResults(docs);
            } catch (err) {
                console.error('Error fetching search results:', err);
                setResults([]);
            }
            setLoading(false);
        };


        return (
            <Modal visible={visible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setQuery('')
                                onClose()
                            }}
                        >
                            <Icon type={Icons.AntDesign} name='closecircleo' color='white' />
                        </TouchableOpacity>

                        {/* Search Input */}
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Team Id"
                            value={query}
                            onChangeText={setQuery}
                        />
                        {results.length > 0 ? (
                            <FlatList
                                data={results}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={[styles.resultItem, { backgroundColor: '#7A1CAC', borderRadius: 10, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginVertical: 5 }]}>
                                        <Text style={styles.resultSubText}> #{item.id}</Text>
                                        <Text style={styles.resultSubText}>{item.teamName}</Text>
                                        {
                                            item.PastRequestonTeam ? item.PastRequestonTeam.includes(PlayerData.playerAppID) ? <Icon type={Icons.MaterialIcons} name='cloud-done' color='lightgreen' /> : <TouchableOpacity
                                                onPress={() => {
                                                    const data = {
                                                        playerName: PlayerData.displayName,
                                                        playerId: PlayerData.playerAppID
                                                    }
                                                    sendRequest(item.id, data, PlayerData.playerAppID)
                                                }}
                                            >
                                                <Icon type={Icons.AntDesign} name='addusergroup' color='white' />
                                            </TouchableOpacity> : <TouchableOpacity
                                                onPress={() => {
                                                    const data = {
                                                        playerName: PlayerData.displayName,
                                                        playerId: PlayerData.playerAppID
                                                    }
                                                    sendRequest(item.id, data, PlayerData.playerAppID)
                                                    onClose()
                                                }}
                                            >
                                                <Icon type={Icons.AntDesign} name='addusergroup' color='white' />
                                            </TouchableOpacity>
                                        }

                                    </View>
                                )}
                            />
                        ) : (
                            !loading && query.trim() !== '' && (
                                <Text style={styles.noResults}>No results found</Text>
                            )
                        )}
                    </View>
                </View>
            </Modal>
        )
    } catch (error) {
        console.log(error)
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent overlay
    },
    modalContent: {
        margin: 20,
        backgroundColor: 'black',
        borderRadius: 10,
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
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 50,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'white',
        color: '#888',
    },
    input: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        color: 'white'
    },
    loading: {
        color: 'White',
        marginVertical: 10,
    },
    resultItem: {

        borderWidth: 1,
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'white',

    },
    resultText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    resultSubText: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    },
    noResults: {
        textAlign: 'center',
        marginVertical: 20,
        color: 'white',
    },
});