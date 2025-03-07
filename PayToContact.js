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
import { collection, getDoc, getFirestore, query, where, doc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from './firebaseConfig';

const db = getFirestore(app);
const auth = getAuth(app);

function PayToContact({ navigation }) {
  const [friends, setFriends] = useState([]); // All friends
  const [filteredFriends, setFilteredFriends] = useState([]); // Filtered friends based on search
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search query

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
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or phone..."
        placeholderTextColor="#6C6C6C"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Friends List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredFriends.map((friend) => (
          <TouchableOpacity
            key={friend.id}
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
  contacts: {
    width: '95%',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#00FFEA', // Neon blue border
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
});

export default PayToContact;