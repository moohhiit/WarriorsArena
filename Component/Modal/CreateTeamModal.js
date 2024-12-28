import { Modal, View, Text, ActivityIndicator, Button, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, DataContext } from '../../Context/ContextConection';
import firestore from '@react-native-firebase/firestore';
import Icon, { Icons } from '../Icons';


export default function CreateTeamModal({ visible, onClose, users, loading, error }) {
  try {
    const { PlayerData, CreateTeamInServer } = useContext(DataContext)
    const [inputData, setInputsData] = useState({
      teamName: teamName,
      teamLeader: PlayerData.playerAppID,
      TeamID,
      teamGameHistory: [],
      game: "FreeFire",
      teamMembers: playerList
    })

    const [playerList, setplayerlist] = useState([
      { id: PlayerData.playerAppID, name: PlayerData.displayName },
    ])
    const [isplayerExists, setisPlayerExist] = useState(false)
    const [playerid, setplyerid] = useState(null)
    const [teamName, setTeamName] = useState('')
    const [TeamID, setTeamID] = useState('');
    const [documentExists, setDocumentExists] = useState(null);

    const [playerNameExist, sePlayerNameExist] = useState(false)

    const [errors, setErrors] = React.useState({});
    const [refresh, setrefresh] = useState(false)

    const [checked, setChecked] = useState(null);

    const handleCheck = (box) => {
      setChecked(box);
      handleOnchange(box, 'game')
    };
    const handleOnchange = (text, input) => {
      setInputsData(prevState => ({ ...prevState, [input]: text }));
    };
    const handleError = (error, input) => {
      setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const createTeam = (data) => {
      const {   game, TeamID } = data
      try {
        if (teamName != null && documentExists != true && TeamID != '' && playerList.length == 4) {
          setrefresh(true)
          CreateTeamInServer(data)
          setTimeout(() => {
            setrefresh(false)
            onClose()
          }, 4000);
        }
        else {
          console.log(teamName, documentExists, TeamID, playerList)
          Alert.alert("SomeThing You Miss ", ' Check all field are Correct')
        }
      } catch (error) {
        console.log(error)
      }


    }

    useEffect(() => {
      handleOnchange(playerList, 'teamMembers')
    }, [playerList])

    const AddPlayerinlist = (pai, pn) => {
      // Check if both item name and price are provided
      if (playerid.trim() !== '' && playerid != PlayerData.playerAppID && playerList.length < 4) {
        // Add the item to the list
        setplayerlist([...playerList, { id: playerid, name: isplayerExists.displayName }]);
        // Clear input fields
        setplyerid('');
      }
    };



    useEffect(() => {
      const CheckPlayerAvilable = async () => {
        const id = Number.parseInt(playerid)
        try {
          const querySnapshot = await firestore()
            .collection('playerInfo')
            .where('playerAppID', '==', id)
            .get()
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              let pd = doc.data()
              setisPlayerExist(pd)
            })
            // return true; // User exists
          } else {
            setisPlayerExist(false)
            // return false; // User does not exist
          }


        } catch (error) {
          console.error('Error checking user availability:', error);
          setisPlayerExist(false)
          // return false; // Return false in case of error
        }

      }
      CheckPlayerAvilable()
    }, [playerid])


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
      <Modal visible={visible} transparent={true} animationType="slide">

        <ScrollView style={styles.modalView}>
          <Text style={{ alignSelf: 'center', color: 'black', fontSize: 25, fontWeight: 'bold', margin: 15 }}>Create Team</Text>
          <View style={{ gap: 20 }} >

            <View style={{ justifyContent: 'space-around', flexDirection: 'row' }} >
              <Text style={{ color: 'black', alignSelf: 'center', flex: 2 }} >
                Team ID
              </Text>
              <TextInput
                style={[styles.input, { borderColor: documentExists ? 'red' : 'black' }]}
                placeholder="Enter Team ID"
                placeholderTextColor='black'
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
              <Text style={{ color: 'black', alignSelf: 'center', flex: 2 }} >
                Team Name :
              </Text>
              <TextInput
                style={[styles.input, { borderColor: playerNameExist ? 'red' : 'black' }]}
                placeholder="Enter your name"
                placeholderTextColor='black'
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
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, marginBottom: 0 }} >
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleCheck('Free Fire')}
            >
              <View style={styles.checkbox}>
                {checked === 'Free Fire' && <View style={styles.checkedBox} />}
              </View>
              <Text style={{ color: 'black', fontSize: 18, }}>Free Fire</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleCheck('BGMI')}
            >
              <View style={styles.checkbox}>
                {checked === 'BGMI' && <View style={styles.checkedBox} />}
              </View>
              <Text style={{ color: 'black', fontSize: 18, }}>BGMI</Text>
            </TouchableOpacity>
          </View> */}
          <Text style={{ color: 'black', fontSize: 20, alignSelf: "center", marginVertical: 20 }} >
            Player Id
          </Text>
          <View style={{ gap: 10 }} >
            {
              playerList.map((e, i) => {
                return (
                  <View style={{ flexDirection: 'row', justifyContent: "space-around", }} key={i} >

                    <Text style={{ color: 'black' }} >
                      Player ID :  {e ? e.id : null}
                    </Text>
                    <Text style={{ color: 'black' }} >
                      Name :  {e ? e.name : null}
                    </Text>
                  </View>
                )
              })
            }

          </View>
          <View style={{ flexDirection: 'row', gap: 10, margin: 10 }} >
            <Text style={{ color: 'black', alignSelf: 'center', flex: 1.5 }} >
              Player ID :
            </Text>
            <TextInput
              placeholder="Enter Player ID"
              placeholderTextColor='black'
              value={playerid}
              onChangeText={setplyerid}
              style={styles.input}
            />
            {
              isplayerExists != false ? <TouchableOpacity style={{ alignSelf: 'center' }}
                onPress={AddPlayerinlist}

              >
                <Icon type={Icons.Ionicons} name='checkmark-done-circle' color='green' size={35} />
              </TouchableOpacity> : null
            }

          </View>


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, borderRadius: 10 }}
              onPress={() => {
                onClose()
                setChecked(null)
                setplayerlist([
                  { id: PlayerData.playerAppID, name: PlayerData.displayName },
                ])


              }
              }
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }} >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#3795BD', padding: 10, borderRadius: 10 }}
              onPress={() => {
                setDocumentExists(false)
                sePlayerNameExist(false)
                createTeam(inputData)
                onClose()
                setChecked(null)
                setplayerlist([
                  { id: PlayerData.playerAppID, name: PlayerData.displayName },
                ])
              }}
            >
              {refresh ? <ActivityIndicator size="small" color="#0000ff" /> : <Text style={{ fontWeight: 'bold', color: 'white' }} >
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