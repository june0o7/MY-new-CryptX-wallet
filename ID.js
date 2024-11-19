import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import app from "./firebaseConfig";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  collection,
  Firestore,
  addDoc,
  getFirestore,
  getDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

function ID(props) {
  return (
    <View style={styles.container}>
   
      <View
        style={{
          padding: 10,
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity style={styles.button}>
          <Image
            source={require("./assets/icons/pp.jpg")}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.userid}>
        <Text
          style={{
            fontWeight: "bold",
            padding: 3,
            justifyContent: "center",
            backgroundColor: "#e8e9eb",
            borderRadius: 8,
            width: 110,
            height: 20,
            alignItems: "center",
            fontSize: 10,
            color: "black",
          }}
        >
          User ID : 1120210@cr
        </Text>
      </View>

      <Text style={{ color: "black", fontWeight: "bold", fontSize: 30, alignSelf:"center" }}>
        Mr. Rajdeep pal
      </Text>
     
      <View style={{flexDirection:"row", backgroundColor:'#e1e4e8', width:300, height:50, alignSelf:"center", marginTop:20, alignItems:"center", justifyContent:"center", borderRadius:20}}>
        
      <Image 
                source={require('./assets/icons/phone.png')}
                style={styles.icon}
                />
        <Text style={{ fontSize:20, marginLeft:10}}> 7449858122 </Text>
      </View>
      <View style={{flexDirection:"row", backgroundColor:'#e1e4e8', width:300, height:50, alignSelf:"center", marginTop:20, alignItems:"center", justifyContent:"center", borderRadius:20}}>
        
      <Image 
                source={require('./assets/icons/phone.png')}
                style={styles.icon}
                />
        <Text style={{ fontSize:20, marginLeft:10}}> 7449858122 </Text>
      </View>
      <View style={{flexDirection:"row", backgroundColor:'#e1e4e8', width:300, height:50, alignSelf:"center", marginTop:20, alignItems:"center", justifyContent:"center", borderRadius:20}}>
        
      <Image 
                source={require('./assets/icons/phone.png')}
                style={styles.icon}
                />
        <Text style={{ fontSize:20, marginLeft:10}}> 7449858122 </Text>
      </View>
      <View style={{flexDirection:"row", backgroundColor:'#e1e4e8', width:300, height:50, alignSelf:"center", marginTop:20, alignItems:"center", justifyContent:"center", borderRadius:20}}>
        
      <Image 
                source={require('./assets/icons/phone.png')}
                style={styles.icon}
                />
        <Text style={{ fontSize:20, marginLeft:10}}> 7449858122 </Text>
      </View>
      <View style={{flexDirection:"row", backgroundColor:'#e1e4e8', width:300, height:50, alignSelf:"center", marginTop:20, alignItems:"center", justifyContent:"center", borderRadius:20}}>
        
      <Image 
                source={require('./assets/icons/phone.png')}
                style={styles.icon}
                />
        <Text style={{ fontSize:20, marginLeft:10}}> 7449858122 </Text>
      </View>


    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  image: {
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  icon: {
    padding: 10,
    borderRadius: 100,
    width: 40,
    height: 40,
  },
  userid: {
    alignItems: "center",
  },
});
export default ID;
