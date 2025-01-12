import { Modal, View, Text, ActivityIndicator, Button, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, DataContext } from '../../Context/ContextConection';
import firestore from '@react-native-firebase/firestore';
import Icon, { Icons } from '../Icons';
import CheckBox from '@react-native-community/checkbox';

export default function CreateTeamModal({ visible, onClose, users, loading, error }) {
  try {
    const [isChecked, setIsChecked] = useState(false);
    const { PlayerData, CreateTeamInServer } = useContext(DataContext)
    const [inputData, setInputsData] = useState({
      teamName: teamName,
      teamLeader: PlayerData.playerAppID,
      TeamID,
      teamGameHistory: [],
      game: "FreeFire",
      teamMembers: [{ id: PlayerData.playerAppID, name: PlayerData.displayName }],
      WinMatch: 0,
      teamPlayerRequest: [],
      teamplayerId : [PlayerData.playerAppID]
    })
    const [isplayerExists, setisPlayerExist] = useState(false)
    const [teamName, setTeamName] = useState('')
    const [TeamID, setTeamID] = useState('');
    const [documentExists, setDocumentExists] = useState(null);
    const [playerNameExist, sePlayerNameExist] = useState(false)
    const [errors, setErrors] = React.useState({});
    const [refresh, setrefresh] = useState(false)


    const handleOnchange = (text, input) => {
      setInputsData(prevState => ({ ...prevState, [input]: text }));
    };
    const handleError = (error, input) => {
      setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const createTeam = (data) => {
      const {TeamID } = data
      try {
        if (teamName != null && documentExists != true && TeamID != '' && isChecked) {
          console.log(data)
          setrefresh(true)
          CreateTeamInServer(data)
          setTimeout(() => {
            setrefresh(false)
            setTeamID('')
            setTeamName('')
            setIsChecked(false)
            onClose()
          }, 4000);
        }
        else {



          Alert.alert("SomeThing You Miss ", ' Check all field are filled')
        }
      } catch (error) {
        console.log(error)
      }


    }
    useEffect(() => {
      const CheckPlayerAvilable = async () => {
        try {
          const querySnapshot = await firestore()
            .collection('PlayerTeams')
            .where('teamName', '==', teamName)
            .get()
          if (!querySnapshot.empty) {
            sePlayerNameExist(true)
            // return true; // User exists
          } else {
            sePlayerNameExist(false)
            // return false; // User does not exist
          }


        } catch (error) {
          console.error('Error checking user availability:', error);
          setisPlayerExist(false)
          // return false; // Return false in case of error
        }

      }
      CheckPlayerAvilable()
    }, [teamName])



    useEffect(() => {
      const checkDocumentExists = async () => {
        if (TeamID.length > 0) {
          try {
            const docRef = firestore().collection('PlayerTeams').doc(TeamID);
            const docSnapshot = await docRef.get();

            if (docSnapshot.exists) {
              setDocumentExists(true);
            } else {
              setDocumentExists(false);
            }
          } catch (error) {
            console.error('Error checking document:', error);
          }
        } else {
          setDocumentExists(null); // Reset if input is empty
        }
      };

      checkDocumentExists();
    }, [TeamID]);

    return (
      <Modal visible={visible} transparent={true} animationType="slide"  >

        <ScrollView style={styles.modalView}  >
          <Text style={{ alignSelf: 'center', color: 'gold', fontSize: 25, fontWeight: 'bold', margin: 15 }}>Create Team</Text>
          <View style={{ gap: 20 }} >

            <View style={{ justifyContent: 'space-around', flexDirection: 'row' }} >
              <Text style={{ color: 'white', alignSelf: 'center', flex: 2, fontSize: 18, fontWeight: 'bold' }} >
                Team id  :
              </Text>
              <TextInput
                style={[styles.input, { borderColor: documentExists ? 'red' : 'black' }]}
                placeholder="Enter here"
                placeholderTextColor='white'
                inputMode='numeric'
                maxLength={5}
                value={TeamID}
                onChangeText={(text) => {
                  if (!documentExists) {
                    handleOnchange(text, 'TeamID')
                  }
                  setTeamID(text)
                }

                }
              />

            </View>
            <View style={{ flexDirection: 'row' }} >
              <Text style={{ color: 'white', alignSelf: 'center', flex: 2, fontSize: 18, fontWeight: 'bold' }} >
                Team Name  :
              </Text>
              <TextInput
                style={[styles.input, { borderColor: playerNameExist ? 'red' : 'black' }]}
                placeholder="Enter your name"
                placeholderTextColor='white'
                value={PlayerData.playerAppID}
                onChangeText={(text) => {
                  if (!isplayerExists) {
                    handleOnchange(text, 'teamName')
                  }
                  setTeamName(text)
                }}
                onFocus={() => handleError(null, 'email')}
                maxLength={12}
              />
            </View  >

          </View>
          <View style={{ padding: 10 }} >
            <View style={styles.ruleContainer}>
              <Text style={styles.ruleTitle}>1. Team Size</Text>
              <Text style={styles.ruleDescription}>
                Each team must have a minimum of 4 players and a maximum of 5 players.
              </Text>
            </View>
            <View style={styles.ruleContainer}>
              <Text style={styles.ruleTitle}>2. Team Name and Identity</Text>
              <Text style={styles.ruleDescription}>
                Each team must choose a unique name to represent them.
              </Text>
            </View>

            <View style={styles.ruleContainer}>
              <Text style={styles.ruleTitle}>3. Balanced Gameplay</Text>
              <Text style={styles.ruleDescription}>
                Teams will be adjusted automatically, if needed, to ensure fair gameplay based on player levels or skills.
              </Text>
            </View>

            <View style={styles.ruleContainer}>
              <Text style={styles.ruleTitle}>4. Role Selection</Text>
              <Text style={styles.ruleDescription}>
                Players can select roles like attacker, defender, or healer to create a diverse team. Roles will be auto-assigned if not selected.
              </Text>
            </View>
            <View style={styles.ruleContainer}>
              <Text style={styles.ruleTitle}>5. Game Mode-Specific Rules</Text>
              <Text style={styles.ruleDescription}>
                Additional rules may apply for certain game modes . These will be outlined before the match.
              </Text>
            </View>
            <View style={styles.ruleContainer}>
              <Text style={styles.ruleTitle}>5. Suspended</Text>
              <Text style={styles.ruleDescription}>
                If a Team is inactive for more than 2 match , team  will be placed in Suspended Mode. If Any hack is used then team is permanently Suspended.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
            <CheckBox
              value={isChecked}
              onValueChange={setIsChecked}
            />
            <Text>
              I have read and accept all the rules.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, borderRadius: 10 }}
              onPress={() => {
                onClose()
                setTeamName('')
                setTeamID('')
                setIsChecked(false)

              }
              }
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }} >
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'gold', padding: 10, borderRadius: 10 }}
              onPress={() => {
                setDocumentExists(false)
                sePlayerNameExist(false)
                createTeam(inputData)

              }}
            >
              {refresh ? <ActivityIndicator size="small" color="gold" /> : <Text style={{ fontWeight: 'bold', color: 'black' }} >
                Create Team
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

  modalView: {
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 20,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    color: 'white',
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
    color: 'white',
    justifyContent: 'center'

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    paddingBottom: 20
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
  ruleContainer: {
    marginBottom: 15,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  ruleDescription: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    lineHeight: 22,
    fontWeight: 'thin'
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