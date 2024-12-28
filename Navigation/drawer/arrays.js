import { Linking } from "react-native";
import { Icons } from "../../Component/Icons";
import { colors } from "./constant";
import FreeFireScreen from "../../Screens/FreeFire/FreeFireScreen";
import BGMIScreen from "../../Screens/BGMI/BGMIScreen";
import MyTeam from "../../Screens/MyTeam";
import MyActivities from "../../Screens/MyActivities";
import auth from "@react-native-firebase/auth";
import { DevSettings } from 'react-native';

export const ScreensArray = [
  { route: 'Free Fire India', label: 'Free Fire India', type: Icons.MaterialCommunityIcons, icon: 'gamepad', component: FreeFireScreen, notification: 3, },
  // { route: 'BGMI', label: 'BGMI', type: Icons.MaterialCommunityIcons, icon: 'gamepad', component: BGMIScreen, notification: 4, },
  { route: 'Team', label: 'My Team', type: Icons.FontAwesome, icon: 'group', component: MyTeam, notification: 0, },
  { route: 'Game', label: 'My Activity', type: Icons.FontAwesome, icon: 'gamepad', component: MyActivities, notification: 2, },
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