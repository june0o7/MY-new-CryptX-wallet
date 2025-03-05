import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, getDoc } from 'firebase/firestore';
import app from './firebaseConfig';
import ConfettiCannon from 'react-native-confetti-cannon';
import { MaterialIcons } from '@expo/vector-icons'; // For icons

const db = getFirestore(app);
const auth = getAuth(app);

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [names, setNames] = useState({}); // Store resolved names

  // Fetch transactions from Firestore
  const fetchTransactions = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const transactions = userData.transactions || [];
        setTransactions(transactions);

        // Fetch names for all transactions
        const namePromises = transactions.map(async (t) => {
          const id = t.type === 'sent' ? t.receiver : t.sender;
          const name = await getName(id);
          return { id, name };
        });

        const resolvedNames = await Promise.all(namePromises);
        const namesMap = resolvedNames.reduce((acc, { id, name }) => {
          acc[id] = name;
          return acc;
        }, {});

        setNames(namesMap);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to fetch transactions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh transactions
  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
    setShowConfetti(true); // Show confetti on first load
    setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
  }, []);

  // Get sender/receiver name
  const getName = async (id) => {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().name;
      }
      return 'Unknown';
    } catch (error) {
      console.error('Error fetching name:', error);
      return 'Unknown';
    }
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((t) =>
    t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.amount.toString().includes(searchQuery) ||
    t.date.includes(searchQuery)
  );

  return (
    <LinearGradient colors={['#0A0A0A', '#1A1A2E', '#16213E']} style={styles.container}>
      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          fallSpeed={3000}
          fadeOut={true}
        />
      )}

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search transactions..."
        placeholderTextColor="#6C6C6C"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Transaction List */}
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator color="#00FFEA" size="large" />
        ) : filteredTransactions.length === 0 ? (
          <Text style={styles.noTransactionsText}>No transactions found.</Text>
        ) : (
          filteredTransactions.map((t, index) => {
            const name = names[t.type === 'sent' ? t.receiver : t.sender] || 'Loading...';
            return (
              <TouchableOpacity key={index} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <MaterialIcons
                    name={t.type === 'sent' ? 'arrow-upward' : 'arrow-downward'}
                    size={24}
                    color={t.type === 'sent' ? '#FF5733' : '#00FFEA'}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionAmount}>
                    {t.amount} ETH
                  </Text>
                  <Text style={styles.transactionName}>{name}</Text>
                  <Text style={styles.transactionDate}>{t.date}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionType,
                    { color: t.type === 'sent' ? '#FF5733' : '#00FFEA' },
                  ]}
                >
                  {t.type === 'sent' ? 'Sent' : 'Received'}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    width: '90%',
    height: 40,
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 20,
    color: '#FFFFFF',
    borderColor: '#00FFEA',
    borderWidth: 1,
  },
  scrollView: {
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionName: {
    color: '#6C6C6C',
    fontSize: 14,
  },
  transactionDate: {
    color: '#6C6C6C',
    fontSize: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noTransactionsText: {
    color: '#6C6C6C',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TransactionHistory;