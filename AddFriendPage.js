import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome"; // For the green tick
// import { db } from "./firebase"; // Import Firestore from firebase.js
import firebase from "firebase/compat/app";
import { doc, getFirestore, getDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';

import app from './firebaseConfig';
import { arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
const db = getFirestore(app);
const auth = getAuth(app);

function AddFriendPage({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cuid, setCuid]= useState(null);

  // Check if the user exists in the database
  const checkUserExists = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a phone number.");
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      console.log("in the user");
      const q = query(usersRef, where("phone", "==", phoneNumber));

      const querySnapshot = await getDocs(q);
       console.log("Querying Firestore for phone number:", phoneNumber);
      console.log("Query result:", querySnapshot.docs[0].data().uid);
      const cuid= querySnapshot.docs[0].data().uid;
      setCuid(cuid);

      if (!querySnapshot.empty) {
        setUserExists(true);
        // Alert.alert("Success", "User exists in the database.");
      } else {
        setUserExists(false);
        Alert.alert("Error", "User does not exist in the database.");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      Alert.alert("Error", "Failed to check user.");
    } finally {
      setLoading(false);
    }
  };

  // Save the friend to the current user's profile
  const saveFriend = async () => {
    if (!userExists) {
      Alert.alert("Error", "User does not exist in the database.");
      return;
    }
  
    try {
      const currentUserRef = await doc(db, "users", getAuth(app).currentUser.uid ); // Replace with actual current user ID
      const currentUserSnap = await getDoc(currentUserRef);
     // console.log("current user id", currentUserId);
      console.log("1_:", currentUserSnap.data());
      
      if (currentUserSnap.exists()) {
        console.log("2");
        const userData = currentUserSnap.data();
        console.log("3");
        
        // If "friends" field doesn't exist, initialize it as an empty array
        if (!userData.friends) {
          await updateDoc(currentUserRef, { friends: [] });
        }
  
        // Add friend to the array
        await updateDoc(currentUserRef, {
          friends: arrayUnion(phoneNumber),
        });
  
        Alert.alert("Success", "Friend saved successfully!");
      } else {
        Alert.alert("Error", "User document does not exist.");
      }
    } catch (error) {
      console.error("Error saving friend:", error);
      Alert.alert("Error", "Failed to save friend.");
    }
  };
  

  return (
    <LinearGradient
      colors={["#0A0A0A", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Add Friend</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          placeholderTextColor="#999"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={checkUserExists}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Check User</Text>
          )}
        </TouchableOpacity>

        {userExists && (
          <View style={styles.userExistsContainer}>
            <Icon name="check-circle" size={24} color="#00FFEA" />
            <Text style={styles.userExistsText}>User exists!</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, !userExists && styles.disabledButton]}
          onPress={saveFriend}
          disabled={!userExists}
        >
          <Text style={styles.buttonText}>Save Friend</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00FFEA",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#1A1A2E",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#00FFEA",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0A0A0A",
  },
  userExistsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userExistsText: {
    fontSize: 16,
    color: "#00FFEA",
    marginLeft: 10,
  },
});

export default AddFriendPage;