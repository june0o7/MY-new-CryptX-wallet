
import { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import firebaseConfig from './firebaseConfig';
import app from './firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, Firestore, addDoc, getFirestore } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';


export default function Login() {


    const auth=getAuth(app);

    
  const [pressed, setPressed]= useState(false);
  
  
  const [pressed2, setPressed2]= useState(false);


const [tcolor, setTcolor]= useState('white');

const [t2color, setT2color]= useState('black');

    const navigator =useNavigation();

    const [email, setEmail] =useState('');
    const [password, setPassword] =useState('');
  return (

  
    <LinearGradient   colors={['rgba(131,58,180,1)', 'rgba(29,52,253,1)', 'rgba(252,176,69,1)']}
    start={{ x: 0, y: 0.2 }}
    end={{ x: 1, y: 0.8 }}
    style={styles.background}>

        <Text style={styles.heading}>
          CryptX Wallet
        </Text>
        <Text style={styles.heading2}>
          For smooth Transaction
        </Text>



        <TextInput placeholder=' Enter Email'value={email} onChangeText={setEmail} placeholderTextColor='#a2a2a2' style={styles.usernaname}>

      
        </TextInput>

        <TextInput placeholder=' Enter Password' value={password} onChangeText={setPassword} secureTextEntry={true} placeholderTextColor='#a2a2a2' style={styles.usernaname}>

      
        </TextInput>


      <TouchableOpacity activeOpacity={1}
      onPressIn={()=>{setPressed(true); setT2color('white')}}
      onPressOut={()=>{setPressed(false);setT2color('black')}}
      onPress={()=>{

            signInWithEmailAndPassword(auth, email, password).then(()=>{console.log("Inside Main"); navigator.navigate('Main')}).catch((error)=>{alert("Invalid Credentials")});

      }}
      style={pressed ?styles.button2: styles.button1 } >
        <Text style={[styles.buttonText, {color:t2color}]}>Log in</Text>
      </TouchableOpacity>


      <TouchableOpacity activeOpacity={1}
      onPressIn={()=>{setPressed2(true); setTcolor('black')}}
      onPressOut={()=>{setPressed2(false); setTcolor('white')}}
      onPress={()=>{

       





        navigator.navigate('SignUp'); 
        console.log('Sign Up')


      } }
      style={pressed2 ?styles.button1: styles.button2 } >
        <Text style={[styles.buttonText,{color:tcolor}]}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity >
     
        <Text style={styles.heading2}>Forgot Password ?</Text>
      </TouchableOpacity>
        
    </LinearGradient>

   
  );
}


const styles= StyleSheet.create({

container: {
    backgroundColor:'dodgerblue',
    flex:1,
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight
},

background: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
text: {
  fontSize: 24,
  color: 'white',
},

heading:{
  color:'white',
  fontSize:50,
  fontWeight:'bold',
  fontFamily: 'roboto',
 
},

heading2:{
  color:'white',
  fontSize:20,
  fontStyle:'italic',
  fontFamily: 'roboto',
  marginBottom:'20%',
   marginBottom:'20%',
   marginTop:10
},
usernaname: {
        width: '80%',
        height: 60,
        borderColor: 'dodgerblue',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        color: 'black',
        fontSize: 16,
        backgroundColor:'white',
        marginTop: 20

},

button1:{

  marginTop:30,
    backgroundColor: 'white',
    height: 50,
    width: '50%',
    borderRadius: 30,
    alignItems:'center',
    justifyContent:'center',
  borderColor:'dodgerblue',
  borderWidth:2,
  color:'black'

},

button2:{

  marginTop:30,
    backgroundColor: 'dodgerblue',
    height: 50,
    width: '50%',
    borderRadius: 30,
    alignItems:'center',
    justifyContent:'center',
  borderColor:'white',
  borderWidth:2,
  color:'white'


},



buttonText:{

color:'black',
fontSize:20,
fontWeight:'bold',
fontFamily: 'roboto',


},

buttonText2:{

  color:'white',
  fontSize:20,
  fontWeight:'bold',
  fontFamily: 'roboto',
  
  
  }
  



})
