
import { NavigationContainer } from '@react-navigation/native';
import React from 'react'
import DrawerNav1 from './Navigation/drawer/drawer1/DrawerNav1';
import DataState from './Context/DataContext/DataContext';
import AuthState from './Context/AuthContext/AuthContext';
import StackNev from './Navigation/Stack/Stack';


export default function App() {
    return (
        <AuthState>
            <DataState>
                <NavigationContainer>
                    <StackNev/>
                </NavigationContainer>
            </DataState>
        </AuthState>
    );
}

