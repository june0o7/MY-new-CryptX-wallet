import { useState, useEffect } from 'react';
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
import { arrayUnion } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { ethers } from 'ethers';
import { doc, getFirestore, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import app from './firebaseConfig';
import ConfettiCannon from 'react-native-confetti-cannon';

const db = getFirestore(app);
const auth = getAuth(app);

function Pay(props) {
  const ganacheUrl = 'http://192.168.29.107:7545'; // home2
  const provider = new ethers.JsonRpcProvider(ganacheUrl, {
    name: 'ganache',
    chainId: 1337,
  });

  const [payTo, setPayTo] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]); // Recent transactions
  const [balance, setBalance] = useState('0.0');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // For fade-in animation

  // Fetch balance and recent transactions from Firestore
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBalance(userData.balance || '0.0');
        setTransactions(userData.transactions || []); // Set recent transactions
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Upload transaction to Firestore
  const uploadTransaction = async (receiverUid, amt) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error('No authenticated user found.');
        return;
      }

      const senderRef = doc(db, 'users', uid);
      const receiverRef = doc(db, 'users', receiverUid);

      const senderSnap = await getDoc(senderRef);
      const receiverSnap = await getDoc(receiverRef);

      if (!senderSnap.exists() || !receiverSnap.exists()) {
        console.error('One or both users not found in Firestore.');
        return;
      }

      // Create transaction objects
      const transactionSent = {
        type: 'sent',
        sender: uid,
        receiver: receiverUid,
        amount: amt,
        date: new Date().toISOString().split('T')[0],
      };

      const transactionReceived = {
        type: 'received',
        sender: uid,
        receiver: receiverUid,
        amount: amt,
        date: new Date().toISOString().split('T')[0],
      };

      // Update Firestore documents
      await updateDoc(senderRef, {
        transactions: arrayUnion(transactionSent),
      });

      await updateDoc(receiverRef, {
        transactions: arrayUnion(transactionReceived),
      });

      console.log('Transaction uploaded successfully.');
    } catch (error) {
      console.error('Error uploading transaction:', error);
    }
  };

  // Update balance in Firestore
  const updateBalance = async (uid, newBalance) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        balance: newBalance,
      });
      console.log('Balance updated successfully.');
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  // Send ETH function
  const sendEth = async (senderPrivateKey, recipientAddress, ethamount) => {
    if (!senderPrivateKey || !recipientAddress || !ethamount) {
      Alert.alert('Error', 'Missing sender private key, recipient address, or amount.');
      return;
    }

    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
    const amount = ethers.parseEther(ethamount);

    try {
      console.log('Sending transaction...');
      const tx = await senderWallet.sendTransaction({
        to: recipientAddress,
        value: amount,
      });

      console.log('Transaction hash:', tx.hash);
      await tx.wait();
      console.log('Transaction completed');

      // Update sender's balance
      const senderBalance = parseFloat(balance) - parseFloat(ethamount);
      setBalance(senderBalance.toFixed(2));
      await updateBalance(auth.currentUser.uid, senderBalance.toFixed(2));

      // Trigger UI updates after successful transaction
      handlePayment();
      setShowConfetti(true); // Show confetti animation
      setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
    } catch (error) {
      console.error('Transaction failed:', error);
      Alert.alert('Error', 'Failed to send transaction.');
    }
  };

  // Send function to handle payment logic
  const send = async () => {
    if (!payTo || !amount) {
      Alert.alert('Error', 'Please enter recipient address/phone and amount.');
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    if (!userDoc.exists()) {
      Alert.alert('Error', 'User data not found.');
      return;
    }

    const data = userDoc.data();
    const pkey = data.privateKey;
    let walletFound = false;

    console.log("Sender's private key:", pkey);
    console.log(`TO: ${payTo} Amount: ${amount}`);

    if (/^\d+$/.test(payTo)) {
      console.log('payto contains phone number');
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (userData.phone === payTo) {
          if (!userData.walletaddress) {
            Alert.alert('Error', 'Recipient wallet address not found.');
            return;
          }
          console.log('Recipient wallet found:', userData.walletaddress);
          walletFound = true;
          await sendEth(pkey, userData.walletaddress, amount);
          await uploadTransaction(userData.uid, amount);
          break;
        }
      }

      if (!walletFound) {
        Alert.alert('Error', 'No user with that phone number found.');
      }
    } else {
      console.log('payto is wallet address');
      await sendEth(pkey, payTo, amount);

      // Find recipient UID by wallet address
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (userData.walletaddress === payTo) {
          await uploadTransaction(userData.uid, amount);
          break;
        }
      }
    }
  };

  // Handle payment UI updates
  const handlePayment = () => {
    if (!payTo || !amount) {
      Alert.alert('Error', 'Please enter recipient address/phone and amount.');
      return;
    }

    setIsModalVisible(false); // Close the modal
    setTransactionStatus(`Sending ${amount} ETH to ${payTo}...`);

    setTimeout(() => {
      setTransactionStatus('Transaction successful!');
      setPayTo('');
      setAmount('');
      fetchData(); // Refresh transactions and balance
    }, 3000); // Simulate a 3-second delay for the transaction
  };

  // Confirm transaction
  const confirmTransaction = () => {
    if (!payTo || !amount) {
      Alert.alert('Error', 'Please enter recipient address/phone and amount.');
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
          <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
            {isLoading ? (
              <ActivityIndicator color="#00FFEA" />
            ) : (
              <Text style={styles.refreshButtonText}>↻</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recipient Address Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Recipient Address/Phone"
          placeholderTextColor="#6C6C6C"
          value={payTo}
          onChangeText={setPayTo}
        />

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
        <ScrollView style={styles.historyContainer}
         showsVerticalScrollIndicator={false}>  
          {/* showsHorizontalScrollIndicator={false} */}
          {transactions.map((tx, index) => (
            <Animated.View
              key={index}
              style={[styles.transactionItem, { opacity: fadeAnim }]}
            >
              <LinearGradient
                colors={['#1A1A2E', '#16213E']}
                style={styles.transactionGradient}
              >
                <Text style={styles.transactionText}>
                  {tx.type === 'sent' ? `Sent ${tx.amount} ETH to ${tx.receiver}` : `Received ${tx.amount} ETH from ${tx.sender}`}
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
            <Text style={styles.modalText}>Send {amount} ETH to {payTo}?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={send}>
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

export default Pay;