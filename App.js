
import { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Button, TouchableOpacity } from 'react-native';
import Login from './Login';
import { createNavigatorFactory, NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from './SignUp';
import Home from './Home';
// import MyComponent from './MyComponent';
import Main from './main';



export default function App() {


  const stack=createStackNavigator();

 
  return (
      
    <NavigationContainer>
      <stack.Navigator initialRouteName='Login'>
        <stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
        <stack.Screen name='SignUp'  component={SignUp} options={{headerShown:false}}/>
        <stack.Screen name='Home' component={Home} options={{headerShown:false}}/>
        <stack.Screen name='Main' component={Main} options={{headerShown:false}}/>
       
      </stack.Navigator>
    </NavigationContainer>
  );
}


