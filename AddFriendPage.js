import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome"; // For the green tick
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
  const [cuid, setCuid] = useState(null);
  const [showModal, setShowModal] = useState(false); // For confirmation modal

  // Check if the user exists in the database
  const checkUserExists = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a phone number.");
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phone", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUserExists(true);
        setCuid(querySnapshot.docs[0].data().uid); // Set the friend's UID
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
      const currentUserRef = doc(db, "users", auth.currentUser.uid);
      const currentUserSnap = await getDoc(currentUserRef);

      if (currentUserSnap.exists()) {
        const userData = currentUserSnap.data();

        // If "friends" field doesn't exist, initialize it as an empty array
        if (!userData.friends) {
          await updateDoc(currentUserRef, { friends: [] });
        }

        // Add friend to the array
        await updateDoc(currentUserRef, {
          friends: arrayUnion(phoneNumber),
        });

        Alert.alert("Success", "Friend saved successfully!");
        refreshPage(); // Refresh the page after saving
      } else {
        Alert.alert("Error", "User document does not exist.");
      }
    } catch (error) {
      console.error("Error saving friend:", error);
      Alert.alert("Error", "Failed to save friend.");
    } finally {
      setShowModal(false); // Close the modal
    }
  };

  // Refresh the page
  const refreshPage = () => {
    setPhoneNumber("");
    setUserExists(false);
    setCuid(null);
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
          onPress={() => setShowModal(true)} // Open modal on save
          disabled={!userExists}
        >
          <Text style={styles.buttonText}>Save Friend</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Confirm Add Friend</Text>
            <Text style={styles.modalText}>
              Are you sure you want to add this user as a friend?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)} // Close modal
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={saveFriend} // Confirm and save
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1A1A2E",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#00FFEA",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddFriendPage;