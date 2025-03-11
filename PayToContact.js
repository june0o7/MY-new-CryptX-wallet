import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDoc, getFirestore, query, where, doc, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from './firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome'; // For the delete icon

const db = getFirestore(app);
const auth = getAuth(app);

function PayToContact({ navigation }) {
  const [friends, setFriends] = useState([]); // All friends
  const [filteredFriends, setFilteredFriends] = useState([]); // Filtered friends based on search
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [showModal, setShowModal] = useState(false);

  // Fetch the current user's friends
  const fetchFriends = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      // Get the current user's document
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const friendsPhones = userData.friends || []; // Get the friends' phone numbers

        // Fetch details of each friend using their phone number
        const friendsData = [];
        for (const phone of friendsPhones) {
          const usersCollection = collection(db, 'users');
          const q = query(usersCollection, where('phone', '==', phone));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const friendData = querySnapshot.docs[0].data();
            friendsData.push({
              id: querySnapshot.docs[0].id, // Friend's user ID
              name: friendData.name,
              phone: friendData.phone,
              walletAddress: friendData.walletaddress, // Add wallet address
            });
          }
        }

        setFriends(friendsData);
        setFilteredFriends(friendsData); // Initialize filtered friends
      } else {
        Alert.alert('Error', 'User data not found.');
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      Alert.alert('Error', 'Failed to fetch friends.');
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(query.toLowerCase()) ||
        friend.phone.includes(query)
    );
    setFilteredFriends(filtered);
  };

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchFriends(); // Reload friends
  };

  // Delete a friend
  const deleteFriend = async (phone) => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated.');
        setLoading(false)
        return;
      }

      // Get the current user's document
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setLoading(true);
        const userData = userDocSnap.data();
        const updatedFriends = userData.friends.filter((friendPhone) => friendPhone !== phone);

        // Update the friends array in Firestore
        await updateDoc(userDocRef, {
          friends: updatedFriends,
        });

        // Refresh the list
        fetchFriends();
        setLoading(false);
        Alert.alert('Success', 'Friend deleted successfully!');
      } else {
        Alert.alert('Error', 'User data not found.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting friend:', error);
      Alert.alert('Error', 'Failed to delete friend.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={['#0A0A0A', '#1A1A2E', '#16213E']} style={styles.container}>
        <ActivityIndicator color="#00FFEA" size="large" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0A0A0A', '#1A1A2E', '#16213E']} style={styles.container}>

<TouchableOpacity
      style={styles.addContactButton}
      onPress={() => navigation.navigate('Add To Contact')}
    >
      <Text style={styles.addContactText}>Add Friend</Text>
    </TouchableOpacity>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or phone..."
        placeholderTextColor="#6C6C6C"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <View>
      {
                    loading && (<ActivityIndicator size="large" color="#00FFEA" />)
                }
      </View>
      {/* Friends List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredFriends.map((friend) => (
          <View key={friend.id} style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.contacts}
              onPress={() => navigation.navigate('sendcrypto', { user: friend })}
            >
              <Image
                source={require('./assets/icons/boy.png')}
                style={styles.contactImage}
              />
              <View style={styles.contactInnerBox}>
                <Text style={styles.contactName}>{friend.name}</Text>
                <Text style={styles.contactHint}>{friend.phone}</Text>
              </View>
            </TouchableOpacity>
            {/* Delete Icon */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteFriend(friend.phone)}
            >
              <Icon name="trash" size={20} color="#FF5733" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00FFEA',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    marginVertical: 8,
    marginHorizontal: 10,
  },
  contacts: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#00FFEA',
    flex: 1,
  },
  contactImage: {
    height: 50,
    width: 50,
    borderRadius: 25, // Circular image
  },
  contactInnerBox: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  contactName: {
    color: '#00FFEA', // Neon blue text
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactHint: {
    color: '#6C6C6C', // Gray text for hint
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 10,
  },
  addContactButton: {
    backgroundColor: '#00FFEA',
    padding: 12,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  addContactText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
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

export default PayToContact;