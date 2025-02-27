import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { ethers } from 'ethers';
import { doc, getFirestore, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import app from './firebaseConfig';
import ConfettiCannon from 'react-native-confetti-cannon';

const db = getFirestore(app);
const auth = getAuth(app);

function SendCrypto({ route, navigation }) {
  const { user } = route.params; // Recipient user data
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Sent', amount: 0.5, to: 'Rajdeep Pal', date: '2023-10-01' },
    { id: 2, type: 'Received', amount: 1.2, from: 'Rumpa Paul', date: '2023-10-02' },
  ]);
  const [balance, setBalance] = useState('0.0');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // For fade-in animation

  const provider = new ethers.JsonRpcProvider('http://192.168.29.107:7545', {
    name: 'ganache',
    chainId: 1337,
  });

  // Fetch balance from Firestore
  const fetchBalance = async () => {
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBalance(userData.balance || '0.0');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      Alert.alert('Error', 'Failed to fetch balance.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch balance on component mount
  useEffect(() => {
    fetchBalance();
  }, []);

  // Send ETH function
  const sendEth = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }

    setIsLoading(true);

    try {
      const senderDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const senderData = senderDoc.data();
      const senderPrivateKey = senderData.privateKey;

      const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
      const tx = await senderWallet.sendTransaction({
        to: user.walletAddress,
        value: ethers.parseEther(amount),
      });

      console.log('Transaction hash:', tx.hash);
      await tx.wait();
      console.log('Transaction completed');

      // Trigger UI updates after successful transaction
      handlePayment();
      setShowConfetti(true); // Show confetti animation
      setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
    } catch (error) {
      console.error('Transaction failed:', error);
      Alert.alert('Error', 'Failed to send transaction.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment UI updates
  const handlePayment = () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }

    setIsModalVisible(false); // Close the modal
    setTransactionStatus(`Sending ${amount} ETH to ${user.name}...`);

    setTimeout(() => {
      setTransactionStatus('Transaction successful!');
      setAmount('');
      setTransactions([
        {
          id: transactions.length + 1,
          type: 'Sent',
          amount: parseFloat(amount),
          to: user.name,
          date: new Date().toISOString().split('T')[0],
        },
        ...transactions,
      ]);

      // Refresh balance after transaction
      fetchBalance();
    }, 3000); // Simulate a 3-second delay for the transaction
  };

  // Confirm transaction
  const confirmTransaction = () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }
    setIsModalVisible(true);
  };

  // Fade-in animation for new transactions
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [transactions]);

  return (
    <LinearGradient colors={['#0A0A0A', '#1A1A2E', '#16213E']} style={styles.container}>
      <View style={styles.content}>
        {/* Balance Display */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Current Balance: {parseFloat(balance).toFixed(2)} ETH</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchBalance}>
            {isLoading ? (
              <ActivityIndicator color="#00FFEA" />
            ) : (
              <Text style={styles.refreshButtonText}>↻</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recipient Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Recipient:</Text>
          <Text style={styles.infoText}>{user.name}</Text>
          <Text style={styles.infoLabel}>Wallet Address:</Text>
          <Text style={styles.infoText}>{user.walletAddress}</Text>
        </View>

        {/* Amount Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Amount (ETH)"
          placeholderTextColor="#6C6C6C"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} onPress={confirmTransaction}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>

        {/* Transaction Status */}
        {transactionStatus ? (
          <Text style={[styles.statusText, { color: transactionStatus.includes('successful') ? '#00FFEA' : '#FF5733' }]}>
            {transactionStatus}
          </Text>
        ) : null}

        {/* Transaction History */}
        <Text style={styles.historyHeader}>Recent Transactions</Text>
        <ScrollView style={styles.historyContainer}>
          {transactions.map((tx) => (
            <Animated.View
              key={tx.id}
              style={[styles.transactionItem, { opacity: fadeAnim }]}
            >
              <LinearGradient
                colors={['#1A1A2E', '#16213E']}
                style={styles.transactionGradient}
              >
                <Text style={styles.transactionText}>
                  {tx.type === 'Sent' ? `Sent ${tx.amount} ETH to ${tx.to}` : `Received ${tx.amount} ETH from ${tx.from}`}
                </Text>
                <Text style={styles.transactionDate}>{tx.date}</Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Confirm Transaction</Text>
            <Text style={styles.modalText}>Send {amount} ETH to {user.name}?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={sendEth}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          fallSpeed={3000}
          fadeOut={true}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFEA',
  },
  refreshButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#1A1A2E',
  },
  refreshButtonText: {
    fontSize: 24,
    color: '#00FFEA',
  },
  infoBox: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoLabel: {
    color: '#00FFEA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00FFEA',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#FFFFFF',
    backgroundColor: '#1A1A2E',
  },
  sendButton: {
    backgroundColor: '#00FFEA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendButtonText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  historyHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FFEA',
    marginBottom: 10,
  },
  historyContainer: {
    flex: 1,
  },
  transactionItem: {
    marginBottom: 10,
  },
  transactionGradient: {
    padding: 15,
    borderRadius: 10,
  },
  transactionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  transactionDate: {
    color: '#6C6C6C',
    fontSize: 14,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#00FFEA',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SendCrypto;