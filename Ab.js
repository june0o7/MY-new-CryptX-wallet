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
  <LinearGradient
              colors={['#0A0A0A', '#1A1A2E', '#16213E']}
              style={styles.container}
          >
  
    <View style={styles.container}>
        <Text style={{color:'#00FFEA', fontWeight:'bold', fontSize:30 , alignItems:'center'}}>
             About us !
          </Text>


          <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>About Us</Text>
        <Text style={styles.subtitle}>
          Making cryptocurrency management simple, secure, and accessible.
        </Text>
      </View>

      
      <View style={styles.content}>
        <Text style={styles.title}>Our Mission</Text>
        <Text style={styles.text}>
          To empower users with the tools to manage their cryptocurrencies safely and seamlessly in a decentralized world.
        </Text>

        <Text style={styles.title}>Key Features</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Secure Two-Factor Authentication</Text>
          <Text style={styles.listItem}>• Biometric Login</Text>
          <Text style={styles.listItem}>• Real-Time Cryptocurrency Tracking</Text>
          <Text style={styles.listItem}>• Fast and Low-Fee Transactions</Text>
        </View>

        <Text style={styles.title}>Why Choose Us?</Text>
        <Text style={styles.text}>
          CryptX Wallet is built by blockchain enthusiasts who understand the importance of security, simplicity, and speed in managing digital assets.
        </Text>
      </View>

      {/* Call to Action Section */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Learn More</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
    </LinearGradient>
);
}

const styles = StyleSheet.create({
    
      image:{
        borderRadius:20,
        width:250,
        height:160,
  
      },container: {
        flex: 1,
        // backgroundColor: '#121212',
        paddingHorizontal: 16,
      },
      header: {
        marginTop: 20,
        alignItems: 'center',
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00FFEA',
      },
      subtitle: {
        fontSize: 16,
        color: '#00FFEA',
        textAlign: 'center',
        marginTop: 10,
      },
      
      content: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
      },
      text: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
        lineHeight: 22,
      },
      list: {
        marginBottom: 15,
      },
      listItem: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
      },
      button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
      },
      buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
      },

    })
    export default Ab;
    