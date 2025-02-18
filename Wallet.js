import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ethers } from 'ethers';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import app from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

const db = getFirestore(app);
const auth = getAuth(app);

const Wallet = () => {
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(100); // Example balance
    const [uid, setUid] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid); // Set the UID if the user is authenticated
            } else {
                setUid(null); // Set UID to null if the user is not authenticated
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const handleAddBalance = () => {
        setBalance(balance + 10); // Example: Add 10 to balance
    };

    const handleSendCrypto = () => {
        if (balance > 0) {
            setBalance(balance - 10); // Example: Deduct 10
        }
    };

    const createWallet = async () => {
        try {
            const w = await ethers.Wallet.createRandom();
            setWallet(w); // Update the wallet state
            console.log(w.address); // Use the newly created wallet's address
            Alert.alert("Wallet Created", "Address: " + w.address);

            if (uid) {
                await upload(w.address); // Pass the wallet address directly
            } else {
                Alert.alert("Error", "User not authenticated.");
            }
        } catch (error) {
            console.error("Error creating wallet:", error);
            Alert.alert("Error", "Failed to create wallet.");
        }
    };

    const upload = async (walletAddress) => {
        try {
            const document = doc(db, "users", uid);
            const userDoc = {
                walletaddress: walletAddress
            };
            await updateDoc(document, userDoc);
            Alert.alert("Success", "Wallet address uploaded successfully.");
        } catch (error) {
            console.error("Error uploading wallet address:", error);
            Alert.alert("Error", "Failed to upload wallet address.");
        }
    };

    return (
        <LinearGradient
                      colors={['#0A0A0A', '#1A1A2E', '#16213E']}
                      style={styles.container}
                  >
        <View style={styles.container}>
            <Text style={styles.balanceText}>Balance: {balance} BTC</Text>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddBalance}>
                    <Text style={styles.buttonText}>Add Balance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={handleSendCrypto}>
                    <Text style={styles.buttonText}>Send Crypto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={createWallet}>
                    <Text style={styles.buttonText}>Create Wallet</Text>
                </TouchableOpacity>
            </View>
        </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#1A1A2E', // Dark background
    },
    balanceText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00FFEA', // Neon blue text
        marginBottom: 20,
        textShadowColor: '#00FFEA', // Neon glow effect
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        backgroundColor: '#1A1A2E', // Dark blue background
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#00FFEA', // Neon blue border
    },
    sendButton: {
        backgroundColor: '#1A1A2E', 
        borderColor: '#FF5733', // Orange border
    },
    buttonText: {
        color: '#00FFEA', // Neon blue text
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Wallet;