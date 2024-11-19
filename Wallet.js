import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image,StatusBar, TextInput, Button, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import app from './firebaseConfig';
import { createUserWithEmailAndPassword ,getAuth } from 'firebase/auth';
import { initializeApp ,} from 'firebase/app';
import { collection, Firestore, addDoc, getFirestore , getDoc, doc, getDocs} from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

function Wallet(props) {
return(
    <View style={styles.container}>
         <Text style={{color:'black', fontWeight:'bold', fontSize:30}}>
             Wallet $
          </Text>
          <View style={{padding:10, marginTop:10, flexDirection:'row', justifyContent:'space-evenly'}}>
            
            <Image 
                source={require('./assets/icons/w.png')}
                style={styles.image}
                />
            </View>
            <Text style={{color:'black', fontSize:23, marginTop:3}}>
            Balance    $5,000.00
          </Text>
          <View style={{marginTop:30,flexDirection:'row',marginLeft: 10}}>
          <Text style={{marginTop:30,marginLeft:15,fontWeight:'bold', padding:3,justifyContent:'center', backgroundColor:'#ff8496', borderRadius:8, width:100, height:30, alignItems:'center', fontSize:15, color:'black'}}>
                Add To Wallet 
          </Text> 
          <Image 
                source={require('./assets/icons/ar.jpg')}
                style={styles.icon2}
                />
          <TouchableOpacity style={styles.button}>
              <Image 
                source={require('./assets/icons/aw.jpg')}
                style={styles.icon}
                />
                </TouchableOpacity>
                 
              </View>
    </View>
);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        padding:10,
      },
      image:{
        borderRadius:2,
        width:250,
        height:160,
  
      },
      icon:{
        padding:10,
        borderRadius:100,
        width:70,
        height:70,
        marginLeft:25,
      },
      icon2:{
        padding:10,
        borderRadius:100,
        width:70,
        height:70,
        marginLeft:25,
        marginTop:10,
      },
})
export default Wallet;
