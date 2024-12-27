import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image,StatusBar, TextInput, Button, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import app from './firebaseConfig';
import { createUserWithEmailAndPassword ,getAuth } from 'firebase/auth';
import { initializeApp ,} from 'firebase/app';
import { collection, Firestore, addDoc, getFirestore , getDoc, doc, getDocs} from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

function Pay(props) {
return(
     <View style={{height:500,justifyContent:'center',alignItems:"center"}}>
        <Text style={{fontSize:20,fontWeight:"bold"}}>Pay To</Text>
        
    
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
        borderRadius:20,
        width:250,
        height:160,
  
      },

    })
    export default Pay;
    