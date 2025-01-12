import { View, Text } from 'react-native'
import React, { useContext, useEffect, useId, useState } from 'react'
import { AuthContext, DataContext } from '../ContextConection'
import firestore from '@react-native-firebase/firestore';


export default function DataState({ children }) {
    const [PlayerData, setPlayerData] = useState('')
    const [TeamList, setTeamList] = useState('')

    const [BGMISchdeuleSquardBr, setBGMISchdeuleSquardBr] = useState('')
    const [BGMISchdeuleSquardCs, setBGMISchdeuleSquardCs] = useState('')
    const [BGMISchdeuleSquard, setBGMISchdeuleSquard] = useState('')
    const [freeFireScheduleSquardBr, setfreeFireScheduleSquardBr] = useState('')
    const [freeFireScheduleSquard, setfreeFireScheduleSquard] = useState('')
    const [freeFireScheduleSquardCs, setfreeFireScheduleSquardCs] = useState('')

    const [BGMIBrimageUrl, setBGMIBrimageUrl] = useState('')
    const [BGMICrimageUrl, setBGMICrimageUrl] = useState('')
    const [FFCrimageUrl, setFFCrimage] = useState('')
    const [FFBrimageUrl, setFFBrimageUrl] = useState('')


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
                console.log(filteredData)
                setTeamList(filteredData);
            } else {
                console.log('No matching documents found!');
                setTeamList(null)
            }
        } catch (error) {
            console.error('Error fetching documents: ', error);
        }
    };

    const feacthPlayerdetail = async (uid) => {

        const PlayerData = await firestore().collection('playerInfo').doc(uid).get()
        setPlayerData(PlayerData.data())
        console.log('User detail Featchd')

    }
    const removeElementFromArray = (array, property, value) => {
        return array.filter(element => element[property] !== value);
    };

    const removePlyerFromTeam = async (docId, arrayField, idToRemove) => {
        try {
            const docRef = firestore().collection('PlayerTeams').doc(docId);
            const doc = await docRef.get();
            if (doc.exists) {
                const data = doc.data();
                const array = data[arrayField] || [];
                const updatedArray = array.filter(item => item.id !== idToRemove);
                await docRef.update({
                    [arrayField]: updatedArray,
                });
                console.log('Object removed based on id successfully');
            } else {
                console.error('Document does not exist');
            }
        } catch (error) {
            console.error('Error removing object by id:', error);
        }
    };

    const AcceptTeam = async (teamId) => {
        try {
            let docReaf = firestore().collection('playerInfo').doc(userLoginDetail.uid)
            let updatearry = removeElementFromArray(PlayerData.teamRequest, 'teamId', teamId)
            docReaf.update({
                TeamDeatile: firestore.FieldValue.arrayUnion(teamId),
                teamRequest: updatearry
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
        const BGBr = await firestore().collection('BGMISchdeule').doc('BGMIbrTS').get()
        setBGMISchdeuleSquardBr(BGBr.data().schedule)
        setBGMIBrimageUrl(BGBr.data().image)

        const BGCs = await firestore().collection('BGMISchdeule').doc('BGMICsTS').get()
        setBGMISchdeuleSquardCs(BGCs.data().schedule)
        setBGMICrimageUrl(BGCs.data().image)

        const BGMIAllSchedule = await firestore().collection('BGMISchdeule').doc('BGMISquardSchedule').get()
        setBGMISchdeuleSquard(BGMIAllSchedule.data().MatchSchedule)
        const FFAllSchedule = await firestore().collection('freeFireSchedule').doc('SquardSchedule').get()
        setfreeFireScheduleSquard(FFAllSchedule.data().MatchSchedule)

        const FFCs = await firestore().collection('freeFireSchedule').doc('FFCSTS').get()
        setfreeFireScheduleSquardCs(FFCs.data().schedule)
        setFFCrimage(FFCs.data().image)

        const FFbr = await firestore().collection('freeFireSchedule').doc('FFBrTS').get()
        setfreeFireScheduleSquardBr(FFbr.data().schedule)
        setFFBrimageUrl(FFbr.data().image)

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
                console.log('User exists!');
                return true; // User exists
            } else {
                console.log('User does not exist.');
                return false; // User does not exist
            }
        } catch (error) {
            console.error('Error checking user availability:', error);
            return false; // Return false in case of error
        }


    }

    const enrolled = async (data) => {
        try {
            const docRef = await firestore().collection('enrolement').add(data)
            const docId = docRef.id;
            if (docId) {
                await firestore().collection('playerInfo').doc(userLoginDetail.uid).update({ 'enrolement': docId })
            }
            console.log(docId)
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

        // Sending Request To all Team Member
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

                // Commit the batch
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
            const usersRef = firestore().collection(col); // Assuming 'users' is your collection name

            // Fetch user data for each userId
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
        await firestore().collection('playerInfo').doc(userLoginDetail.uid).update({ 'FFUID': ffuid, BGMIUID: BGMIuid })
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
        if (userLoginDetail) {
            firestore().collection('playerInfo').doc(userLoginDetail.uid).onSnapshot(doc => { setPlayerData(doc.data()) });
        }
        firestore().collection('BGMISchdeule').doc('BGMIbrTS').onSnapshot(doc => {
            setBGMISchdeuleSquardBr(doc.data().schedule)
            setBGMIBrimageUrl(doc.data().image)
        });
        firestore().collection('BGMISchdeule').doc('BGMICsTS').onSnapshot(doc => {
            setBGMISchdeuleSquardCs(doc.data().schedule)
            setBGMICrimageUrl(doc.data().image)
        });
        firestore().collection('BGMISchdeule').doc('BGMISquardSchedule').onSnapshot(doc => { setBGMISchdeuleSquard(doc.data().MatchSchedule) });
        firestore().collection('freeFireSchedule').doc('SquardSchedule').onSnapshot(doc => { setfreeFireScheduleSquard(doc.data().MatchSchedule) });
        firestore().collection('freeFireSchedule').doc('FFCSTS').onSnapshot(doc => {
            setfreeFireScheduleSquardCs(doc.data().schedule)
            setFFBrimageUrl(doc.data().image)
        });
        firestore().collection('freeFireSchedule').doc('FFBrTS').onSnapshot(doc => {
            setfreeFireScheduleSquardBr(doc.data().schedule)
            setFFCrimage(doc.data().image)
        });
        firestore().collection('YoutubeLive').doc('GameLive').onSnapshot(doc => { setGameLive(doc.data()) });
    }, [])

    useEffect(() => {
        if (userLoginDetail != null) {

            feacthPlayerdetail(userLoginDetail.uid)
        }
    }, [userLoginDetail])





    useEffect(() => {
        if (userLoginDetail) {
            firestore().collection('playerInfo').doc(userLoginDetail.uid).onSnapshot(doc => { setPlayerData(doc.data()) });
        }
    }, [])

    return (
        <DataContext.Provider value={{
            findDataInArray,
            TeamList,
            freeFireScheduleSquard,
            PlayerData,
            BGMISchdeuleSquard,
            BGMISchdeuleSquardBr,
            BGMISchdeuleSquardCs,
            freeFireScheduleSquardBr,
            freeFireScheduleSquardCs,
            GameLive,
            feacthPlayerdetail,
            featchDetail,
            featchPlayerByID,
            CreateTeamInServer,
            BGMIBrimageUrl,
            BGMICrimageUrl,
            FFCrimageUrl,
            FFBrimageUrl,
            AcceptTeam,
            rejctteam,
            enrolled,
            getDetailFromServer,
            UpdateGameUid,
            removePlyerFromTeam,
            findEnrolement
        }} >
            {children}
        </DataContext.Provider>

    )
}