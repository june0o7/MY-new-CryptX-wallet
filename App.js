import 'react-native-get-random-values';
import { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Button, TouchableOpacity } from 'react-native';
import Login from './Login';
import { createNavigatorFactory, NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from './SignUp';
import Home from './Home';

// import MyComponent from './MyComponent';
import Main from './main';
// import Tudung from './tudung';
import PayToContact from './PayToContact';
import sendCrypto from './sendCrypto';
import TransactionHistory from './TransactionHistory';
import CryptoNews from './CryptoNews';



export default function App() {


  const stack=createStackNavigator();

 
  return (
      
    <NavigationContainer>
      <stack.Navigator initialRouteName='Login'>
        <stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
        <stack.Screen name='SignUp'  component={SignUp} options={{headerShown:false}}/>
        <stack.Screen name='Home' component={Home} options={{headerShown:true}}/>
        <stack.Screen name='Main' component={Main} options={{headerShown:false}}/>
        {/* <stack.Screen name='ID' component={Profile} options={{headerShown:false}}/> */}
        {/* <stack.Screen name='tudung' component={tudung} options={{headerShown:false}}/> */}
        <stack.Screen name="PayToContact" component={PayToContact} options={{headerShown:true}} />
      <stack.Screen name="sendCrypto" component={sendCrypto} options={{headerShown:true}}/>
      <stack.Screen name="Transaction History" component={TransactionHistory} options={{headerShown:true}}/>
      <stack.Screen name="News" component={CryptoNews} options={{headerShown:true}}/>

      </stack.Navigator>
    </NavigationContainer>
  );
}


