import { createStackNavigator } from '@react-navigation/stack';
import DrawerNav1 from '../drawer/drawer1/DrawerNav1';
import LoginScreen from '../../Screens/AuthScreens/LoginScreen';
import RegistrationScreen from '../../Screens/AuthScreens/RegistrationScreen';
import TeamDetail from '../../Component/TeamDetail';
import MatchDataDetail from '../../Component/MatchDataDetail';

const Stack = createStackNavigator();

function StackNev() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}

        >
            <Stack.Screen name="EnteryScreen" component={DrawerNav1} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegistrationScreen} />
            <Stack.Screen name="TeamDetail" component={TeamDetail}  />
            <Stack.Screen name="matchDetail" component={MatchDataDetail}  />


        </Stack.Navigator>
    );
}

export default StackNev