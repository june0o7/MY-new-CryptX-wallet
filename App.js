import 'react-native-get-random-values';
import { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Button, TouchableOpacity } from 'react-native';
import Login from './Login';
import { createNavigatorFactory, NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from './SignUp';
import Home from './Home';
import design from './design';
// import ChatScreen from './chat';
// import MyComponent from './MyComponent';
import Main from './main';
// import Tudung from './tudung';
import PayToContact from './PayToContact';
import sendCrypto from './sendCrypto';
import TransactionHistory from './TransactionHistory';
import CryptoNews from './CryptoNews';
import CryptoPriceTracker from './CryptoPriceTracker';
import AddFriendPage from './AddFriendPage';
import Notifications from './Notifications';
import HelpAndFeedback from './HelpAndFeedback';
import PrivacyAndSecurity from './PrivacyAndSecurity';

export default function App() {


  const stack=createStackNavigator();

 
  return (
      
    <NavigationContainer>
      <stack.Navigator initialRouteName='Login'
      screenOptions={{
        headerStyle: { backgroundColor: '#1A1A2E' }, // Change background color
        headerTintColor: '#FFFFFF', // Change text color
        headerTitleStyle: { fontWeight: 'bold' } // Optional: Make title bold
      }}>
        <stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
        <stack.Screen name='SignUp'  component={SignUp} options={{headerShown:false}}/>
        <stack.Screen name='Home' component={Home} options={{headerShown:true}}/>
        <stack.Screen name='Main' component={Main} options={{headerShown:false}}/>
        {/* <stack.Screen name='ID' component={ID} options={{headerShown:true}}/> */}
        {/* <stack.Screen name='tudung' component={tudung} options={{headerShown:false}}/> */}
        <stack.Screen name="PayToContact" component={PayToContact} options={{headerShown:true}} />
      <stack.Screen name="sendCrypto" component={sendCrypto} options={{headerShown:true}}/>
      <stack.Screen name="Transaction History" component={TransactionHistory} options={{headerShown:true}}/>
      <stack.Screen name="News" component={CryptoNews} options={{headerShown:true}}/>
      <stack.Screen name="CryptoPriceTracker" component={CryptoPriceTracker} options={{headerShown:true}}/>
      <stack.Screen name="AddFriendPage" component={AddFriendPage} options={{headerShown:true}} />
      <stack.Screen name="Notifications" component={Notifications} />
      <stack.Screen name="design" component={design} options={{headerShown:true}}/>
                <stack.Screen name="PrivacyAndSecurity" component={PrivacyAndSecurity} />
                <stack.Screen name="HelpAndFeedback" component={HelpAndFeedback} />
                {/* <stack.Screen name="chat" component={ChatScreen} /> */}
      </stack.Navigator>
    </NavigationContainer>
  );
}


