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
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { ethers } from 'ethers';
import { doc, getFirestore, getDoc } from 'firebase/firestore';
import app from './firebaseConfig';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');
const db = getFirestore(app);
const auth = getAuth(app);

function SendCrypto({ route, navigation }) {
  const { user } = route.params;
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
  const fadeAnim = useState(new Animated.Value(0))[0];

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
    <LinearGradient colors={["#0F0F2D", "#1A1A2E", "#16213E"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <Text style={styles.title}>Send Crypto</Text>
          <Text style={styles.subtitle}>Transfer ETH to {user.name}</Text>
        </Animatable.View>

        {/* Balance Card */}
        <Animatable.View animation="fadeInUp" duration={600} style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <TouchableOpacity onPress={fetchBalance} style={styles.refreshButton}>
              {isLoading ? (
                <ActivityIndicator color="#00FFEA" size="small" />
              ) : (
                <Ionicons name="refresh" size={20} color="#00FFEA" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>{parseFloat(balance).toFixed(4)} ETH</Text>
        </Animatable.View>

        {/* Recipient Card */}
        <Animatable.View animation="fadeInUp" duration={600} delay={100} style={styles.recipientCard}>
          <View style={styles.recipientHeader}>
            <FontAwesome name="user" size={20} color="#00FFEA" />
            <Text style={styles.recipientName}>{user.name}</Text>
          </View>
          <View style={styles.walletAddressContainer}>
            <MaterialIcons name="account-balance-wallet" size={18} color="#6C6C6C" />
            <Text style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
              {user.walletAddress}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => navigation.navigate('ChatWithFriend', { user })}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#00FFEA" />
            <Text style={styles.chatButtonText}>Chat with {user.name}</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Amount Input */}
        <Animatable.View animation="fadeInUp" duration={600} delay={200} style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount to Send (ETH)</Text>
          <View style={styles.amountInputWrapper}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#6C6C6C"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </Animatable.View>

        {/* Send Button */}
        <Animatable.View animation="fadeInUp" duration={600} delay={300}>
          <TouchableOpacity 
            style={[styles.sendButton, !amount && styles.disabledButton]} 
            onPress={confirmTransaction}
            disabled={!amount}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Transaction Status */}
        {transactionStatus && (
          <Animatable.View animation="fadeIn" duration={500} style={styles.statusContainer}>
            <Text style={[
              styles.statusText, 
              transactionStatus.includes('successful') ? styles.successText : styles.errorText
            ]}>
              {transactionStatus}
            </Text>
          </Animatable.View>
        )}

        {/* Transaction History */}
        <Animatable.View animation="fadeInUp" duration={600} delay={400} style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Ionicons name="time" size={20} color="#00FFEA" />
            <Text style={styles.historyTitle}>Recent Transactions</Text>
          </View>
          
          {transactions.map((tx) => (
            <Animated.View
              key={tx.id}
              style={[styles.transactionCard, { opacity: fadeAnim }]}
            >
              <View style={styles.transactionIcon}>
                <FontAwesome 
                  name={tx.type === 'Sent' ? 'arrow-up' : 'arrow-down'} 
                  size={16} 
                  color={tx.type === 'Sent' ? '#FF5252' : '#4CAF50'} 
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionText}>
                  {tx.type === 'Sent' ? `Sent to ${tx.to}` : `Received from ${tx.from}`}
                </Text>
                <Text style={styles.transactionDate}>{tx.date}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                tx.type === 'Sent' ? styles.sentAmount : styles.receivedAmount
              ]}>
                {tx.type === 'Sent' ? '-' : '+'}{tx.amount} ETH
              </Text>
            </Animated.View>
          ))}
        </Animatable.View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View animation="fadeInUp" duration={300} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Transaction</Text>
            <View style={styles.modalBody}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Amount:</Text>
                <Text style={styles.modalValue}>{amount} ETH</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>To:</Text>
                <Text style={styles.modalValue}>{user.name}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Address:</Text>
                <Text style={[styles.modalValue, styles.walletAddress]}>{user.walletAddress}</Text>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={sendEth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: width / 2, y: 0 }}
          explosionSpeed={500}
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
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
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
  balanceCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.2)',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    color: '#6C6C6C',
    fontSize: 14,
  },
  refreshButton: {
    padding: 6,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  recipientCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.2)',
  },
  recipientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipientName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  walletAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletAddress: {
    color: '#6C6C6C',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    justifyContent: 'center',
  },
  chatButtonText: {
    color: '#00FFEA',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#6C6C6C',
    fontSize: 14,
    marginBottom: 8,
  },
  amountInputWrapper: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D2D42',
    paddingHorizontal: 16,
  },
  amountInput: {
    height: 56,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#00FFEA',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#2D2D42',
  },
  sendButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#00FFEA',
  },
  errorText: {
    color: '#FF5252',
  },
  historyContainer: {
    marginTop: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    color: '#00FFEA',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    color: '#6C6C6C',
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sentAmount: {
    color: '#FF5252',
  },
  receivedAmount: {
    color: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
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
    marginBottom: 16,
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: 24,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalLabel: {
    color: '#6C6C6C',
    fontSize: 16,
  },
  modalValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
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
  confirmButton: {
    backgroundColor: '#00FFEA',
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SendCrypto;