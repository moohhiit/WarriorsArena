import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, DataContext } from '../ContextConection'
import auth from '@react-native-firebase/auth';
import { Alert, DevSettings } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function AuthState({ children }) {
    const [initializing, setInitializing] = useState(true);
    const [userLoginDetail, setUserLoginDetail] = useState(null)


    function generateRandomTenDigitNumber() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    async function isUserAvailable(id) {
        try {
            const querySnapshot = await firestore()
                .collection('playerInfo')
                .where('playerAppID', '==', id)
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

    async function generateUniqueRandomNumber() {
        let isUnique = false;
        let randomNumber;

        while (!isUnique) {
            randomNumber = generateRandomTenDigitNumber();
            console.log('Generated number:', randomNumber);

            const exists = await isUserAvailable(randomNumber);

            if (!exists) {
                console.log('Number is unique, not found in Firestore:', randomNumber);
                isUnique = true;
            } else {
                console.log('Number already exists in Firestore, generating a new one...');
            }
        }

        return randomNumber;
    }


    const signOut = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
    }

    const reagisterPlayer = (e, p, dn, ph) => {
        try {

            auth().createUserWithEmailAndPassword(e, p).then(async (userCredential) => {

                const randomNumber = await generateUniqueRandomNumber()
                const user = userCredential.user;

                return firestore()
                    .collection('playerInfo')  // You can name this collection anything you want
                    .doc(user.uid)  // The document ID will be the user's UID
                    .set({
                        email: user.email,
                        displayName: dn || '',
                        phoneNumber: ph || '',
                        playerAppID: randomNumber,
                        teamRequest:[],
                        TeamDeatile:[],
                        matchhistory:[]
                    });



            })
        }
        catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            console.log(error)
        }
    }
    const LoginPlayer = (e, p) => {
        auth()
            .signInWithEmailAndPassword(e, p)
            .then((userCredential) => {

                // User is signed in
                console.log('User logged in:', userCredential.user);
                // Navigate to another screen or do something after successful login
            })
            .catch(error => {
                if (error.code === 'auth/wrong-password') {
                    Alert.alert('Opps! Not Login', 'Wrong password.')
                } else if (error.code === 'auth/user-not-found') {
                    Alert.alert('Opps! Not Login', 'No user found with this email.')
                } else if (error.code === 'auth/invalid-email') {
                    Alert.alert('Opps! Not Login', 'Invalid email address.')
                } else {
                    console.log(error.message);
                }
                console.error(error);
            });
    }

    useEffect(() => {
        const subscribe = auth().onAuthStateChanged((u) => {
            console.log('Login Detail Updated')
            setUserLoginDetail(u)
            if (u != null) {

                setInitializing(false)
            }
        })
        return subscribe
    }, [])

    return (
        <AuthContext.Provider value={{ reagisterPlayer, LoginPlayer, signOut, initializing, userLoginDetail }} >
            {children}
        </AuthContext.Provider>

    )
}