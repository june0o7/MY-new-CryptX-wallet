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

function Pay(props) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [balance, setBalance] = useState(10.5); // Example balance in BTC
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Sent', amount: 0.5, to: 'Rajdeep Pal', date: '2023-10-01' },
    { id: 2, type: 'Received', amount: 1.2, from: 'Rumpa Paul', date: '2023-10-02' },
  ]);

  // Function to handle the payment process
  const handlePayment = () => {
    if (!recipientAddress || !amount) {
      Alert.alert('Error', 'Please enter recipient address and amount.');
      return;
    }

    // Simulate a payment process (replace with actual blockchain transaction logic)
    setIsModalVisible(false); // Close the modal
    setTransactionStatus(`Sending ${amount} BTC to ${recipientAddress}...`);

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
        <Text style={styles.balanceText}>Balance: {balance} BTC</Text>

        {/* Recipient Address Input */}
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
          placeholder="Enter Amount (BTC)"
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