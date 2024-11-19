import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image,StatusBar, TextInput, Button, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import app from './firebaseConfig';
import { createUserWithEmailAndPassword ,getAuth } from 'firebase/auth';
import { initializeApp ,} from 'firebase/app';
import { collection, Firestore, addDoc, getFirestore , getDoc, doc, getDocs} from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

function Ab(props) {
return(
    <View style={styles.container}>
        <Text style={{color:'black', fontWeight:'bold', fontSize:30}}>
             About us !
          </Text>

          <View style={{padding:10, marginTop:10, flexDirection:'row', justifyContent:'space-evenly'}}>
            
            <Image 
                source={require('./assets/icons/us.jpg')}
                style={styles.image}
                />
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
        borderRadius:20,
        width:250,
        height:160,
  
      },

    })
    export default Ab;
    