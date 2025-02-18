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
    <LinearGradient
      colors={["#0A0A0A", "#1A1A2E", "#16213E"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.balanceContainer}>
          <Text style={styles.greetingText}>Hello, USER!</Text>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$10,000.00</Text>
          <View style={styles.marketGrowthContainer}>
            <Text style={styles.marketGrowthText}>Market Growth: 4.7%</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={require("./assets/icons/uparrow.png")}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={require("./assets/icons/downarrow.png")}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={require("./assets/icons/mg.png")}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>Find</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Popular</Text>
        <View style={styles.popularContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.popularItem}>
              <Image
                source={require("./assets/images/eth.jpg")}
                style={styles.popularImage}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.popularItem}>
              <Image
                source={require("./assets/images/dbi.jpg")}
                style={styles.popularImage}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.popularItem}>
              <Image
                source={require("./assets/images/eth.jpg")}
                style={styles.popularImage}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.popularItem}>
              <Image
                source={require("./assets/images/dbi.jpg")}
                style={styles.popularImage}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <Text style={styles.sectionHeader}>Businesses</Text>
        <View style={styles.businessesContainer}>
          {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {[
              "jio-logo-icon",
              "zomato",
              "swiggy",
              "bms",
              "lenskart",
              "jio-logo-icon",
              "zomato",
              "swiggy",
              "bms",
              "lenskart",
            ].map((icon, index) => (
              <TouchableOpacity key={index} style={styles.businessIcon}>
                <Image
                  source={require(`./assets/icons/${icon}.png`)}
                  style={styles.businessImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView> */}








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

        <Text style={styles.sectionHeader}>People</Text>
        <View style={styles.peopleContainer}>
          {[
            "Rajdeep",
            "Rumpa",
            "Rangan Nath",
            "Shyan Mandal",
            "Saptarshi Mandal",
            "Sradha",
            "Riya Pal",
            "Subhadeep Pal",
            "Soumik",
            "Rajesh Patra",
          ].map((name, index) => (
            <TouchableOpacity key={index} style={styles.personItem}>
              <Image
                source={require("./assets/icons/profile.png")}
                style={styles.personImage}
              />
              <Text style={styles.personName}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  balanceContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  greetingText: {
    color: "#00FFEA",
    fontSize: 30,
    fontWeight: "bold",
  },
  balanceLabel: {
    color: "#00FFEA",
    fontSize: 15,
    marginTop: 10,
  },
  balanceAmount: {
    color: "#00FFEA",
    fontSize: 25,
    marginTop: 5,
  },
  marketGrowthContainer: {
    backgroundColor: "#00FFEA",
    borderRadius: 10,
    padding: 5,
    width: 110,
    marginTop: 10,
  },
  marketGrowthText: {
    color: "#0A0A0A",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    // backgroundColor:"#00FFEA",
  },
  iconButton: {
    alignItems: "center",
    // backgroundColor:"#00FFEA",

  },
  iconImage: {
    width: 30,
    height: 30,
    // color:"#00FFEA",
    
  },
  iconText: {
    color: "#00FFEA",
    fontSize: 12,
    marginTop: 5,
  },
  sectionHeader: {
    color: "#00FFEA",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  popularContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  popularItem: {
    margin: 10,
  },
  popularImage: {
    width: 200,
    height: 100,
    borderRadius: 15,
  },
  businessesContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  businessIcon: {
    margin: 5,
  },
  businessImage: {
    width: 50,
    height: 50,
  },
  peopleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  personItem: {
    alignItems: "center",
    marginBottom: 10,
    width: "30%",
  },
  personImage: {
    width: 50,
    height: 50,
  },
  personName: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
});

export default Home;