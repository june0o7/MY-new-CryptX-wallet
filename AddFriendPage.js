import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Keyboard,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { doc, getFirestore, getDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import app from './firebaseConfig';
import { arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');
const db = getFirestore(app);
const auth = getAuth(app);

function AddFriendPage({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cuid, setCuid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [shakeAnimation] = useState(new Animated.Value(0));

  // Animation for error state
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]).start();
  };

  const checkUserExists = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a phone number.");
      shake();
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phone", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setUserExists(true);
        setCuid(userDoc.uid);
        setUserData(userDoc);
      } else {
        setUserExists(false);
        shake();
        Alert.alert("Not Found", "No user found with this phone number.");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      Alert.alert("Error", "Failed to check user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveFriend = async () => {
    if (!userExists) return;

    try {
      const currentUserRef = doc(db, "users", auth.currentUser.uid);
      const currentUserSnap = await getDoc(currentUserRef);

      if (currentUserSnap.exists()) {
        await updateDoc(currentUserRef, {
          friends: arrayUnion({
            phone: phoneNumber,
            uid: cuid,
            name: userData.name || 'Unknown',
            addedAt: new Date().toISOString()
          }),
        });

        Alert.alert("Success", `${userData.name || 'User'} added to your contacts!`);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving friend:", error);
      Alert.alert("Error", "Failed to save contact. Please try again.");
    } finally {
      setShowModal(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber("");
    setUserExists(false);
    setCuid(null);
    setUserData(null);
  };

  return (
    <LinearGradient
      colors={["#0F0F2D", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View 
          animation="fadeInDown"
          duration={800}
          style={styles.header}
        >
          <Text style={styles.title}>Add New Contact</Text>
          <Text style={styles.subtitle}>Enter your friend's phone number</Text>
        </Animatable.View>

        <Animated.View 
          style={[
            styles.inputContainer,
            { transform: [{ translateX: shakeAnimation }] }
          ]}
        >
          <MaterialIcons 
            name="phone" 
            size={24} 
            color="#00FFEA" 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#6C6C6C"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            returnKeyType="search"
            onSubmitEditing={checkUserExists}
          />
          {phoneNumber ? (
            <TouchableOpacity 
              onPress={() => setPhoneNumber("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#6C6C6C" />
            </TouchableOpacity>
          ) : null}
        </Animated.View>

        <TouchableOpacity 
          style={styles.searchButton}
          onPress={checkUserExists}
          disabled={loading || !phoneNumber}
        >
          {loading ? (
            <ActivityIndicator color="#0A0A0A" />
          ) : (
            <>
              <FontAwesome name="search" size={18} color="#0A0A0A" />
              <Text style={styles.searchButtonText}>Search Contact</Text>
            </>
          )}
        </TouchableOpacity>

        {userExists && (
          <Animatable.View 
            animation="fadeInUp"
            duration={600}
            style={styles.userCard}
          >
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <FontAwesome name="user" size={24} color="#00FFEA" />
              </View>
              <View style={styles.userDetails}>
              <Text style={styles.userName}>
  {userData ? userData.name || 'Unknown User' : 'Unknown User'}
</Text>

                <Text style={styles.userPhone}>{phoneNumber}</Text>
              </View>
              <FontAwesome 
                name="check-circle" 
                size={24} 
                color="#4CAF50" 
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.saveButtonText}>Add to Contacts</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}

        <TouchableOpacity
          style={styles.viewContactsButton}
          onPress={() => navigation.navigate('Pay To Contact')}
        >
          <Ionicons name="people" size={20} color="#00FFEA" />
          <Text style={styles.viewContactsText}>View My Contacts</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View 
            animation="fadeInUp"
            duration={400}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Confirm Contact</Text>
            <Text style={styles.modalText}>
  Add {userData ? userData.name || 'this user' : 'this user'} to your contacts?
</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={saveFriend}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00FFEA',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C6C6C',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2D2D42',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00FFEA',
    borderRadius: 12,
    height: 50,
    marginBottom: 24,
  },
  searchButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  userCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.2)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userPhone: {
    color: '#6C6C6C',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00FFEA',
  },
  saveButtonText: {
    color: '#00FFEA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewContactsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  viewContactsText: {
    color: '#00FFEA',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#00FFEA',
  },
  modalTitle: {
    color: '#00FFEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF5252',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#00FFEA',
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddFriendPage;