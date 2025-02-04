import React, { useContext, useEffect, useId, useState } from 'react'
import { AuthContext, DataContext } from '../ContextConection'
import firestore from '@react-native-firebase/firestore';


export default function DataState({ children }) {
    const [PlayerData, setPlayerData] = useState('')
    const [TeamList, setTeamList] = useState('')

    const [FFCrimageUrl, setFFCrimage] = useState('')

    const [GameLive, setGameLive] = useState([])
    const { userLoginDetail } = useContext(AuthContext)

    const findEnrolement = async (value) => {
        try {
            const querySnapshot = await firestore()
                .collection('enrolement')
                .where('team', '==', value)
                .get();

            if (!querySnapshot.empty) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error('Error fetching documents: ', error);
        }
    }

    const findDataInArray = async (collection, field, value) => {
        try {
            const querySnapshot = await firestore()
                .collection(collection)
                .where(field, 'array-contains', value)
                .get();

            if (!querySnapshot.empty) {
                const resultArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                return resultArray;
            } else {
                console.log('No documents found with the specified value in the array.');
            }
        } catch (error) {
            console.error('Error fetching documents: ', error);
        }
    };



    const getTeamlist = async () => {
        try {
            const teamCollection = firestore().collection('PlayerTeams');
            const querySnapshot = await teamCollection.where('teamplayerId', 'array-contains', PlayerData.playerAppID).get();
            if (!querySnapshot.empty) {
                const filteredData = querySnapshot.docs.map(doc => doc.data());
                setTeamList(filteredData);
            } else {
                console.log('No matching documents found!');
                setTeamList(null)
            }
        } catch (error) {
            console.log('Error fetching documents');
        }
    };

    const feacthPlayerdetail = async (uid) => {

        const PlayerData = await firestore().collection('playerInfo').doc(uid).get()
        const data = { id: PlayerData.id, ...PlayerData.data() }
        setPlayerData(data)
        console.log('User detail Featchd')

    }
    const removeElementFromArray = (array, property, value) => {
        return array.filter(element => element[property] !== value);
    };
    const removePlyerFromTeam = (Teamid, Arrayofreq, requestplayerId) => {
        try {
            let docReaf = firestore().collection('PlayerTeams').doc(Teamid)
            let updatearry = removeElementFromArray(Arrayofreq, 'id', requestplayerId)
            console.log(updatearry)
            docReaf.update({
                teamMembers: updatearry,
                teamplayerId: firestore.FieldValue.arrayRemove(requestplayerId)
            }).then(() => {
                console.log('pLAYERreMOVED')
            })
        } catch (error) {
            console.worn("Error Handled")
        }
    }
    const handleDenyplayer = async (Teamid, Arrayofreq, requestplayerId) => {
        try {
            let docReaf = firestore().collection('PlayerTeams').doc(Teamid)
            let updatearry = removeElementFromArray(Arrayofreq, 'playerId', requestplayerId)
            docReaf.update({
                teamPlayerRequest: updatearry,
                PastRequestonTeam: firestore.FieldValue.arrayRemove(requestplayerId)
            }).then(() => {
                console.log('team Deny')
            })
        } catch (error) {
            console.worn("Error Handled")
        }
    };

    const handleAcceptplayer = async (Teamid, ReqPlayeData, Arrayofreq, requestplayerId) => {
        try {
            let docReaf = firestore().collection('PlayerTeams').doc(Teamid)
            let updatearry = removeElementFromArray(Arrayofreq, 'playerId', requestplayerId)
            console.log(updatearry)
            docReaf.update({
                teamMembers: firestore.FieldValue.arrayUnion(ReqPlayeData),
                teamPlayerRequest: updatearry,
                PastRequestonTeam: firestore.FieldValue.arrayRemove(requestplayerId),
                teamplayerId: firestore.FieldValue.arrayRemove(requestplayerId)
            }).then(() => {
                console.log('team Accept')
            })
        } catch (error) {
            console.log(error)
        }
    }
    const rejctteam = (teamId) => {
        try {
            let docReaf = firestore().collection('playerInfo').doc(userLoginDetail.uid)
            let updatearry = removeElementFromArray(PlayerData.teamRequest, 'teamId', teamId)
            docReaf.update({
                teamRequest: updatearry
            }).then(() => {
                console.log('team React')
            })
        } catch (error) {
            console, log(error)
        }
    }

    const featchPlayerData = async () => {
        const FFCs = await firestore().collection('freeFireSchedule').doc('FFCSTS').get()
        setFFCrimage(FFCs.data().image)
        const Live = await firestore().collection('YoutubeLive').doc('GameLive').get()
        setGameLive(Live.data())
    }


    async function featchPlayerByID(col, fn, id) {
        try {
            const querySnapshot = await firestore()
                .collection(col)
                .where(fn, '==', id)
                .get();

            if (!querySnapshot.empty) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }


    }
    const getRealtimeDocUpdates = (collectionName, docId) => {
        const unsubscribe = firestore()
            .collection(collectionName)
            .doc(docId)
            .onSnapshot(
                (docSnapshot) => {
                    if (docSnapshot.exists) {
                        const data = { id: docSnapshot.id, ...docSnapshot.data() }
                        setPlayerData(data);
                        console.log('Teaking snapshot')
                    } else {
                        console.warn('Document does not exist.');
                    }
                },
                (error) => {
                    console.error('Error fetching Firestore document updates:', error);
                }
            );

        return unsubscribe;
    };
    const enrolled = async (data) => {
        try {
            const docRef = await firestore().collection('enrolement').add(data)
            const docId = docRef.id;
            if (docId) {
                await firestore().collection('playerInfo').doc(userLoginDetail.uid).update({ 'enrolement': docId })
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const CreateTeamInServer = async (e) => {
        const { TeamID, teamMembers, teamName } = e

        firestore().collection('PlayerTeams').doc(TeamID).set(e).then(() => {
            console.log('TeamCreated')
        })
        firestore().collection('playerInfo').doc(userLoginDetail.uid).update({
            TeamDeatile: firestore.FieldValue.arrayUnion(TeamID)
        }).then(() => {
            console.log('TeamAdded')
        })
        let data = { teamId: TeamID, teamName: teamName }
        console.log(teamMembers)
        const userId = teamMembers.map((user) => {
            if (user.id == PlayerData.playerAppID) {
                return null
            }
            else {
                return Number(user.id)
            }
        }
        )
        userId.shift()
        const querySnapshot = await firestore().collection('playerInfo').where('playerAppID', 'in', userId).get()
        const IdList = querySnapshot.docs.map(doc => doc.id)
        if (IdList.length == 3) {
            const usersCollection = firestore().collection('playerInfo');
            const batch = firestore().batch();
            try {
                IdList.forEach(userId => {
                    const userRef = usersCollection.doc(userId);
                    batch.update(userRef, {
                        teamRequest: firestore.FieldValue.arrayUnion(data)
                    });
                });

                await batch.commit();
                console.log('User details updated successfully');

            } catch (error) {
                console.error('Error updating user details:', error);
                throw error;
            }
        }




    }
    const getDetailFromServer = async (col, doc) => {
        const dataRef = await firestore().collection(col).doc(doc).get()
        return dataRef.data()
    }

    async function featchDetail(col, arrayofdoc) {
        try {
            const teamarray = [];
            const usersRef = firestore().collection(col);

            for (const id of arrayofdoc) {
                const userDoc = await usersRef.doc(id).get();
                if (userDoc.exists) {
                    teamarray.push({ ...userDoc.data() });
                }
            }
            console.log(teamarray.length)
            return teamarray;
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    const UpdateGameUid = async (ffuid, BGMIuid) => {
        await firestore().collection('playerInfo').doc(userLoginDetail.uid).update({ 'FFUID': ffuid })
    }

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('PlayerTeams')
            .where('teamMembers', 'array-contains', { id: PlayerData.playerAppID })
            .onSnapshot((snapshot) => {
                const updatedDocuments = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTeamList(updatedDocuments);
            });

        return () => unsubscribe();
    }, [])

    useEffect(() => {
        featchPlayerData()
    }, [])
    useEffect(() => {
        getTeamlist()
    }, [PlayerData])

    useEffect(() => {
        firestore().collection('YoutubeLive').doc('GameLive').onSnapshot(doc => { setGameLive(doc.data()) });
    }, [])

    useEffect(() => {
        if (userLoginDetail != null) {
            feacthPlayerdetail(userLoginDetail.uid)
        }
    }, [userLoginDetail])





    return (
        <DataContext.Provider value={{
            removePlyerFromTeam,
            findDataInArray,
            getRealtimeDocUpdates,
            TeamList,
            PlayerData,
            GameLive,
            feacthPlayerdetail,
            featchDetail,
            featchPlayerByID,
            CreateTeamInServer,
            FFCrimageUrl,
            handleAcceptplayer,
            rejctteam,
            enrolled,
            getDetailFromServer,
            UpdateGameUid,
            handleDenyplayer,
            findEnrolement
        }} >
            {children}
        </DataContext.Provider>

    )
}