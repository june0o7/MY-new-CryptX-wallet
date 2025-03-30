import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
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
  const [userData, setUserData] = useState(null);
  const [shakeAnimation] = useState(new Animated.Value(0));

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
      const cuid = querySnapshot.docs[0]?.data()?.uid;
      setCuid(cuid);

      if (!querySnapshot.empty) {
        setUserExists(true);
        setUserData(querySnapshot.docs[0].data());
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
        
        if (!userData.friends) {
          await updateDoc(currentUserRef, { friends: [] });
        }

        // In your AddFriendPage's saveFriend function:
await updateDoc(currentUserRef, {
  friends: arrayUnion({
    phone: phoneNumber,
    uid: cuid,
    name: userData.name || 'Unknown',
    addedAt: new Date().toISOString()
  }),
});

        Alert.alert("Success", "Friend saved successfully!");
        setPhoneNumber("");
        setUserExists(false);
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

        <View style={styles.inputContainer}>
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
        </View>

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
                  {userData?.name || 'Unknown User'}
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
              onPress={saveFriend}
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
});

export default AddFriendPage;