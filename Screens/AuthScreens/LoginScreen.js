import React, { useContext } from 'react';
import { View, Text, SafeAreaView, Keyboard, Alert, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";


import Loader from '../../Component/Loader';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import COLORS from '../../constants/Colors';
import { AuthContext } from '../../Context/ContextConection';


const LoginScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({ email: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const { LoginPlayer, initializing } = useContext(AuthContext)

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    }
    if (isValid) {
      login();
    }
  };

  const login = () => {

    setLoading(true);
    LoginPlayer(inputs.email, inputs.password)
    setTimeout(() => {
      navigation.navigate('EnteryScreen')
    }, 2000)
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };
  return (
    <SafeAreaView style={{ backgroundColor: '#A1D6B2', flex: 1 }}>
      <ScrollView>


        <Loader visible={loading} />

        <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
          <TouchableOpacity style={{
            height: 40,
            width: 40,
            backgroundColor: '#4B70F5',
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }} onPress={() => {
            navigation.goBack();
          }}>
            <Ionicons
              name={"arrow-back-outline"}
              color='white'
              size={25}
            />
          </TouchableOpacity>
          <View style={{ marginVertical: 20, }}>
            <Text style={{
              fontSize: 32,
              color: 'black',
            }}>Hey,</Text>
            <Text style={{
              fontSize: 32,
              color: 'black',
            }}>Welcome,</Text>
            <Text style={{
              fontSize: 32,
              color: 'black',
            }}>Back,</Text>

          </View>

          <Text style={{ color: COLORS.black, fontSize: 18, marginVertical: 10 }}>
            Enter Your Details to Login
          </Text>
          <View style={{ marginVertical: 20 }}>
            <Input
              onChangeText={text => handleOnchange(text, 'email')}
              onFocus={() => handleError(null, 'email')}
              iconName="email-outline"
              label="Email"
              placeholder="Enter your email address"
              error={errors.email}
            />
            <Input
              onChangeText={text => handleOnchange(text, 'password')}
              onFocus={() => handleError(null, 'password')}
              iconName="lock-outline"
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
              password
            />
            <Button title="Log In" onPress={validate} />
            <Text
              onPress={() => navigation.navigate('RegisterScreen')}
              style={{
                color: COLORS.black,
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 16,
              }}>
              Don't have account ?Register
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
