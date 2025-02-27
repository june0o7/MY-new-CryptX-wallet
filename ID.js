import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import app from "./firebaseConfig";


function ID(props) {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [data, setData] = useState({});

  async function fetch() {
    const uid = auth.currentUser.uid;
    console.log("UID: ", uid);
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    setData(docSnap.data());
    console.log("Name: ", data.name);
  }
  

  useEffect(()=>{
fetch();

  },[]);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.button}>
          <Image source={require("./assets/icons/pp.jpg")} style={styles.image} />
        </TouchableOpacity>
      </View>
      <View style={styles.userid}>
        <Text style={styles.useridText}>User ID : {data && data.uid}</Text>
      </View>
      <Text style={styles.nameText}>Mr. {data && data.name}</Text>
      
      <LinearGradient colors={["#16213E", "#1A1A2E"]} style={styles.infoCard}>
        <Image source={require("./assets/icons/phone.png")} style={styles.icon} />
        <Text style={styles.infoText}>{data && data.phone}</Text>
      </LinearGradient>

      <LinearGradient colors={["#16213E", "#1A1A2E"]} style={styles.infoCard}>
        <Image source={require("./assets/icons/dob.png")} style={styles.icon} />
        <Text style={styles.infoText}>{data && data.DOB}</Text>
      </LinearGradient>

      <LinearGradient colors={["#16213E", "#1A1A2E"]} style={styles.infoCard}>
        <Image source={require("./assets/icons/address.png")} style={styles.icon} />
        <Text style={styles.infoText}>{data && data.address}</Text>
      </LinearGradient>

      <LinearGradient colors={["#16213E", "#1A1A2E"]} style={styles.infoCard}>
        <Image source={require("./assets/icons/mail.png")} style={styles.icon} />
        <Text style={styles.infoText}>{data && data.email}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    padding: 10,
  },
  profileContainer: {
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    borderRadius: 100,
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: "#00FFEA",
  },
  userid: {
    alignItems: "center",
    marginTop: 10,
  },
  useridText: {
    fontWeight: "bold",
    padding: 5,
    backgroundColor: "#16213E",
    borderRadius: 8,
    fontSize: 12,
    color: "#00FFEA",
    textAlign: "center",
  },
  nameText: {
    color: "#00FFEA",
    fontWeight: "bold",
    fontSize: 28,
    alignSelf: "center",
    marginTop: 10,
  },
  infoCard: {
    flexDirection: "row",
    width: 300,
    height: 50,
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "#00FFEA",
  },
  infoText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#00FFEA",
  },
});

export default ID;
