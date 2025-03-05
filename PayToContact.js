import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);

function PayToContact({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      const usersData = [];
      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.name && user.phone) {
          usersData.push({
            id: doc.id,
            name: user.name,
            phone: user.phone,
            walletAddress: user.walletaddress, // Add wallet address
          });
        }
      });

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.contacts}
            onPress={() => navigation.navigate('sendcrypto', { user })}
          >
            <Image
              source={require('./assets/icons/boy.png')}
              style={styles.contactImage}
            />
            <View style={styles.contactInnerBox}>
              <Text style={styles.contactName}>{user.name}</Text>
              <Text style={styles.contactHint}>{user.phone}</Text>
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
    // justifyContent: 'center',
    // alignItems: 'center',
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