import React, { useEffect, useState, useCallback } from 'react';
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
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { collection, getDoc, getFirestore, query, where, doc, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from './firebaseConfig';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');
const db = getFirestore(app);
const auth = getAuth(app);

function PayToContact({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  // Improved fetchFriends function with proper error handling
  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        Alert.alert('Authentication Required', 'Please sign in to view contacts');
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        Alert.alert('Error', 'User document not found');
        setLoading(false);
        return;
      }

      const userData = userDocSnap.data();
      const friendsList = userData.friends || [];

      // If no friends, return early
      if (friendsList.length === 0) {
        setFriends([]);
        setFilteredFriends([]);
        setLoading(false);
        return;
      }

      // Fetch friend details for each phone number
      const friendsPromises = friendsList.map(async (friend) => {
        try {
          // Check if friend is a string (phone number) or already an object
          const phoneNumber = typeof friend === 'string' ? friend : friend.phone;
          
          if (!phoneNumber) return null;

          const usersCollection = collection(db, 'users');
          const q = query(usersCollection, where('phone', '==', phoneNumber));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) return null;

          const friendDoc = querySnapshot.docs[0];
          const friendData = friendDoc.data();
          
          return {
            id: friendDoc.id,
            name: friendData.name || 'Unknown',
            phone: friendData.phone,
            walletAddress: friendData.walletaddress,
            avatar: friendData.photoURL || null
          };
        } catch (error) {
          console.error('Error fetching friend:', error);
          return null;
        }
      });

      const friendsData = (await Promise.all(friendsPromises)).filter(Boolean);
      setFriends(friendsData);
      setFilteredFriends(friendsData);
      
    } catch (error) {
      console.error('Error in fetchFriends:', error);
      Alert.alert('Error', 'Failed to load contacts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Add focus listener to refresh when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFriends();
    });

    // Initial load
    fetchFriends();

    return unsubscribe;
  }, [fetchFriends, navigation]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(query.toLowerCase()) ||
        friend.phone.includes(query)
    );
    setFilteredFriends(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFriends();
  };

  // ... rest of your component code remains the same ...

  const confirmDelete = (friend) => {
    setSelectedFriend(friend);
    setShowDeleteModal(true);
  };

  const animateDelete = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();
  };

  const deleteFriend = async () => {
    if (!selectedFriend) return;
    
    try {
      setDeleteLoading(true);
      animateDelete();
      
      const currentUser = auth.currentUser;
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        
        // Handle both string (phone) and object friend formats
        const updatedFriends = userData.friends.filter(friend => {
          if (typeof friend === 'string') {
            return friend !== selectedFriend.phone;
          } else {
            return friend.phone !== selectedFriend.phone;
          }
        });
  
        await updateDoc(userDocRef, { friends: updatedFriends });
        
        // Update local state
        const updatedLocalFriends = friends.filter(f => f.phone !== selectedFriend.phone);
        setFriends(updatedLocalFriends);
        setFilteredFriends(updatedLocalFriends);
        
        Alert.alert('Success', `${selectedFriend.name} removed from contacts`);
      }
    } catch (error) {
      console.error('Error deleting friend:', error);
      Alert.alert('Error', 'Failed to remove contact');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setSelectedFriend(null);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={['#0F0F2D', '#1A1A2E']} style={styles.container}>
        <ActivityIndicator size="large" color="#00FFEA" />
        <Text style={styles.loadingText}>Loading Contacts...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F0F2D', '#1A1A2E']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Contacts</Text>
        <Text style={styles.subtitle}>
          {filteredFriends.length} {filteredFriends.length === 1 ? 'contact' : 'contacts'}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6C6C6C" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor="#6C6C6C"
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Add To Contact')}
      >
        <Ionicons name="person-add" size={20} color="#0A0A0A" />
        <Text style={styles.addButtonText}>Add New Contact</Text>
      </TouchableOpacity>

      {filteredFriends.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="people-outline" size={60} color="#4A4A6A" />
          <Text style={styles.emptyText}>No contacts found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try a different search' : 'Add your first contact'}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00FFEA"
            />
          }
        >
          {filteredFriends.map((friend) => (
            <Animatable.View 
              key={friend.id}
              animation="fadeInRight"
              duration={500}
              style={styles.contactCard}
            >
              <TouchableOpacity
                style={styles.contactContent}
                onPress={() => navigation.navigate('sendcrypto', { user: friend })}
              >
                {friend.avatar ? (
                  <Image source={{ uri: friend.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <FontAwesome name="user" size={24} color="#00FFEA" />
                  </View>
                )}
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName} numberOfLines={1}>
                    {friend.name}
                  </Text>
                  <Text style={styles.contactPhone}>{friend.phone}</Text>
                </View>
              </TouchableOpacity>
              
              <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(friend)}
                >
                  <FontAwesome name="trash-o" size={20} color="#FF5252" />
                </TouchableOpacity>
              </Animated.View>
            </Animatable.View>
          ))}
        </ScrollView>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View 
            animation="fadeInUp"
            duration={300}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Remove Contact</Text>
            <Text style={styles.modalText}>
              Are you sure you want to remove {selectedFriend?.name} from your contacts?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={deleteFriend}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalButtonText}>Remove</Text>
                )}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FFEA',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C6C6C',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D2D42',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00FFEA',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  addButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#6C6C6C',
    fontSize: 14,
    marginTop: 8,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.1)',
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactPhone: {
    color: '#6C6C6C',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
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
    borderColor: '#FF5252',
  },
  modalTitle: {
    color: '#FF5252',
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
    borderColor: '#6C6C6C',
    marginRight: 10,
  },
  deleteConfirmButton: {
    backgroundColor: '#FF5252',
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#00FFEA',
    marginTop: 16,
    fontSize: 16,
  },
});

export default PayToContact;