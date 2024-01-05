/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './SRC/Screens/Login';
import SignUp from './SRC/Screens/SignUp';
import MainPage from './SRC/Screens/MainPage';
import Profile from './SRC/Screens/Profile';
import UserDetails from './SRC/Screens/UserDetails';



const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <Stack.Screen name="MainPage" component={MainPage} /> */}

        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="UserDetails" component={UserDetails} />



    </Stack.Navigator>
    </NavigationContainer>
  );
}
