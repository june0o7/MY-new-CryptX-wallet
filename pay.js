import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image,StatusBar, TextInput, Button, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import app from './firebaseConfig';
import { createUserWithEmailAndPassword ,getAuth } from 'firebase/auth';
import { initializeApp ,} from 'firebase/app';
import { collection, Firestore, addDoc, getFirestore , getDoc, doc, getDocs} from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

function Pay(props) {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');

    // Function to handle the payment process
    const handlePayment = () => {
        if (!recipientAddress || !amount) {
            Alert.alert('Error', 'Please enter recipient address and amount.');
            return;
        }

        // Simulate a payment process (replace with actual blockchain transaction logic)
        setTransactionStatus(`Sending ${amount} BTC to ${recipientAddress}...`);

        setTimeout(() => {
            setTransactionStatus('Transaction successful!');
            setRecipientAddress('');
            setAmount('');
        }, 3000); // Simulate a 3-second delay for the transaction
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Pay To</Text>

            {/* Recipient Address Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter Recipient Address"
                value={recipientAddress}
                onChangeText={setRecipientAddress}
            />

            {/* Amount Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter Amount (BTC)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />

            {/* Send Button */}
            <Button title="Send" onPress={handlePayment} />

            {/* Transaction Status Display */}
            {transactionStatus ? (
                <Text style={{ marginTop: 20, color: transactionStatus.includes('successful') ? 'green' : 'black' }}>
                    {transactionStatus}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});

export default Pay;
    