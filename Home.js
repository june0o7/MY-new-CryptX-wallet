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

function Home(props) {
  return (
    <View style={styles.container}>
      <View
        style={{ backgroundColor: "#21ffcf", borderRadius: 20, padding: 10 }}
      >
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 30 }}>
          Hello, USER !
        </Text>
        <Text style={{ color: "#2c2e2e", fontSize: 15, marginTop: 10 }}>
          Total Balance
        </Text>

        <Text style={{ color: "black", fontSize: 25, marginTop: 3 }}>
          $10,000.00
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            padding: 2,
            backgroundColor: "#2c2e2e",
            borderRadius: 10,
            width: 110,
            height: 20,
            alignItems: "center",
            fontSize: 10,
            color: "#21ffcf",
          }}
        >
          Market Growth: 4.7%
        </Text>

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
              source={require("./assets/icons/uparrow.png")}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image
              source={require("./assets/icons/downarrow.png")}
              style={styles.image}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Image
              source={require("./assets/icons/mg.png")}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonDescription}>
          <Text>Send </Text>
          <Text>Receive </Text>
          <Text>Find </Text>
        </View>
      </View>
      <Text
        style={{
          fontWeight: "bold",
          padding: 5,
          width: 90,
          alignItems: "center",
          color: "white",
          fontSize: 18,
        }}
      >
        Popular
      </Text>

      <View  style={{ backgroundColor: "#21ffcf", borderRadius: 20, paddingLeft: 5, paddingRight:5 }}>
        <ScrollView
         
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity style={{ margin: 10, height: 110 }}>
            <Image
              source={require("./assets/images/eth.jpg")}
              style={{ width: 200, height: 100 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 10, height: 110 }}>
            <Image
              source={require("./assets/images/dbi.jpg")}
              style={{ width: 200, height: 100 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 10, height: 110 }}>
            <Image
              source={require("./assets/images/eth.jpg")}
              style={{ width: 200, height: 100 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 10, height: 110 }}>
            <Image
              source={require("./assets/images/dbi.jpg")}
              style={{ width: 200, height: 100 }}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Text
        style={{
          fontWeight: "bold",
          padding: 5,
          width: 120,
          alignItems: "center",
          color: "white",
          fontSize: 18,
        }}
      >
        Businesses{" "}
      </Text>
      <View
        style={{
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 5,
          padding: 5,
        }}
      >
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity>
            <Image
              source={require("./assets/icons/jio-logo-icon.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/zomato.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/swiggy.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/bms.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/lenskart.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/jio-logo-icon.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/zomato.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/swiggy.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/bms.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/lenskart.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.transactions}>
        <Text style={{ color: "white", fontWeight:"bold"}}>People</Text>

        <View style={{ flexDirection: "row", flexWrap:"wrap", justifyContent:"space-evenly" }}>

          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Rajdeep
            </Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Rumpa
            </Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Rangan Nath
            </Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Shyan mandal
            </Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Saptarshi Mandal
            </Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Sradha
            </Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Riya pal
            </Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Subhadeep pal
            </Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Soumik 
            </Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft:2, marginRight:2}}>
          <View style={{}}>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />

            <Text
              style={{ color: "white", width: 60 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              Rajesh patra
            </Text>
          </View>
          </TouchableOpacity>

          
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },

  button: {
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    padding: 0,
  },
  image: {
    borderRadius: 7,
    width: 30,
    height: 30,
    borderColor: "black",
  },

  buttonDescription: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  transactions: {
    padding: 10,
  },
});
export default Home;
