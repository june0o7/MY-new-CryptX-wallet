import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ethers } from 'ethers';
import { doc, updateDoc, getFirestore, getDoc } from 'firebase/firestore';
import app from './firebaseConfig';
// import { LinearGradient } from 'expo-linear-gradient';

const db = getFirestore(app);
const auth = getAuth(app);

function Pay(props) {

const ganacheUrl = "http://192.168.29.107:7545";
    // const ganacheUrl = "HTTP://192.168.29.107:7545";
    // const ganacheUrl = "http://192.168.0.172:7545";
    const provider = new ethers.JsonRpcProvider(ganacheUrl, {
        name: 'ganache',
        chainId: 1337,
    });

  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [balance, setBalance] = useState(10.5); // Example balance in BTC
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Sent', amount: 0.5, to: 'Rajdeep Pal', date: '2023-10-01' },
    { id: 2, type: 'Received', amount: 1.2, from: 'Rumpa Paul', date: '2023-10-02' },
  ]);


  //............

  const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState('0.0');
    const [uid, setUid] = useState(null);
    const[address , setAddress ]=useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Add loading state
const [refreshing, setRefreshing] = useState(false);
{refreshing && <ActivityIndicator color="#00FFEA" style={styles.loadingIndicator} />}

const fetchData = async () => {
  try {
      const user = auth.currentUser;
      if (!user) return;
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
          setData(docSnap.data());
      }
  } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Failed to refresh data");
  }
};
// useEffect(() => {
//   fetchData();
// }, [refreshTrigger]); 

// const handleRefresh = () => {
//   setRefreshTrigger(prev => prev + 1);
// };
// Add refresh handler function
// Add refreshTrigger as dependency



    //fetching the balance from firestore database 
    

    

  // Function to handle the payment process


  const send = async(recipientAddressLocal, paybleamount)=>{
    try {
        //what is the sender private key....


        const info= await getDoc(doc(getFirestore(app), "users", getAuth(app).currentUser.uid));
        const data=info.data();

        console.log("fethed pkey in send(): ", data.privateKey);
        const senderPrivateKey = data.privateKey;
        console.log("send to bro ", recipientAddressLocal);
        // const senderPrivateKey = w.privateKey;
        const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
        const amount = ethers.parseEther(paybleamount);
        
        const tx = await senderWallet.sendTransaction({
            to: recipientAddressLocal,
            value: amount,
        });
        
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt.hash);
        Alert.alert("Success", "Transaction completed");
        checkBalance();
    } catch (error) {
        console.error("Transaction error:", error);
        Alert.alert("Error", "Transaction failed");
    }
    

};
  const handlePayment = () => {
    if (!recipientAddress || !amount) {
      Alert.alert('Error', 'Please enter recipient address and amount.');
      return;
    }

    // Simulate a payment process (replace with actual blockchain transaction logic)
    setIsModalVisible(false); // Close the modal
    setTransactionStatus(`Sending ${amount} BTC to ${recipientAddress}...`);
    send("0x2c7167E99d83646e0d3cddc9aA74aD876834208A", "0.1");
    setTimeout(() => {
      setTransactionStatus('Transaction successful!');
      setRecipientAddress('');
      setAmount('');
      // Add the transaction to the history
      setTransactions([
        {
          id: transactions.length + 1,
          type: 'Sent',
          amount: parseFloat(amount),
          to: recipientAddress,
          date: new Date().toISOString().split('T')[0],
        },
        ...transactions,
      ]);
    }, 3000); // Simulate a 3-second delay for the transaction
  };

  // Function to open the confirmation modal
  const confirmTransaction = () => {
    if (!recipientAddress || !amount) {
      Alert.alert('Error', 'Please enter recipient address and amount.');
      return;
    }
    setIsModalVisible(true);
  };

  return (
    <LinearGradient
      colors={['#0A0A0A', '#1A1A2E', '#16213E']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Balance Display */}
        
        <TextInput
          style={styles.input}
          placeholder="Enter Recipient Address"
          placeholderTextColor="#6C6C6C"
          value={recipientAddress}
          onChangeText={setRecipientAddress}
        />

        {/* QR Code Scanner Button */}
        <TouchableOpacity style={styles.qrButton} onPress={() => Alert.alert('QR Scanner', 'Scan QR Code')}>
          <Text style={styles.qrButtonText}>Scan QR Code</Text>
        </TouchableOpacity>

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

        {/* Transaction Status Display */}
        {transactionStatus ? (
          <Text style={[styles.statusText, { color: transactionStatus.includes('successful') ? '#00FFEA' : '#FF5733' }]}>
            {transactionStatus}
          </Text>
        ) : null}

        {/* Transaction History */}
        <Text style={styles.historyHeader}>Recent Transactions</Text>
        <ScrollView style={styles.historyContainer}>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <Text style={styles.transactionText}>
                {tx.type === 'Sent' ? `Sent ${tx.amount} BTC to ${tx.to}` : `Received ${tx.amount} BTC from ${tx.from}`}
              </Text>
              <Text style={styles.transactionDate}>{tx.date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Confirm Transaction</Text>
            <Text style={styles.modalText}>Send {amount} BTC to {recipientAddress}?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handlePayment}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFEA',
    marginBottom: 20,
    textAlign: 'center',
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
  loadingIndicator: {
    position: 'absolute',
    right: 20,
    top: 20,
},
refreshButton: {
  position: 'absolute',
  right: 10,
  top: 5,
  padding: 10,
  borderRadius: 180,
  backgroundColor: '#1A1A2E',
  borderWidth: 2,
  borderColor: '#1A1A2E',
},
refreshButtonText: {
  color: '#00FFEA',
  fontSize: 30,
  fontWeight: 'bold',
},
  qrButton: {
    backgroundColor: '#00FFEA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  qrButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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