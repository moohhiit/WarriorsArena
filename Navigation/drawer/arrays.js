import { Icons } from "../../Component/Icons";
import FreeFireScreen from "../../Screens/FreeFire/FreeFireScreen";
import MyTeam from "../../Screens/MyTeam";
import auth from "@react-native-firebase/auth";
import { DevSettings } from 'react-native';
import WawShop from "../../Screens/WawShop";
import MyRewords from "../../Screens/MyRewords";

export const ScreensArray = [
  { route: 'Free Fire India', label: 'Free Fire India', type: Icons.MaterialCommunityIcons, icon: 'gamepad', component: FreeFireScreen, notification: 3, },
  // { route: 'BGMI', label: 'BGMI', type: Icons.MaterialCommunityIcons, icon: 'gamepad', component: BGMIScreen, notification: 4, },
  { route: 'Team', label: 'My Team', type: Icons.FontAwesome, icon: 'group', component: MyTeam, notification: 0, },
  { route: 'WawShop', label: 'Waw Shop', type: Icons.FontAwesome, icon: 'shopping-cart', component: WawShop, notification: 0, },
  { route: 'Rewords', label: 'My Rewords', type: Icons.FontAwesome5, icon: 'crown', component: MyRewords, notification: 0, },
  // { route: 'Game', label: 'My Activity', type: Icons.FontAwesome, icon: 'gamepad', component: MyActivities, notification: 2, },
];

const signOut = () => {
  auth().signOut().then(() => {
    DevSettings.reload();
  })
}

// Upload In Server
export const ProfileMenu = [
  { label: 'Rate', icon: 'star', iconType: Icons.MaterialIcons },
  { label: 'Share', icon: 'share', iconType: Icons.MaterialIcons },
  { label: 'Logout', icon: 'logout', iconType: Icons.MaterialIcons, onPress: () => { signOut() } },
]