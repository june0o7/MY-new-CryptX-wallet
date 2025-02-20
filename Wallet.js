import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ethers } from 'ethers';
import { doc, updateDoc, getFirestore, getDoc } from 'firebase/firestore';
import app from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

const db = getFirestore(app);
const auth = getAuth(app);

const Wallet = () => {
    const ganacheUrl = "http://192.168.0.172:7545";
    const provider = new ethers.JsonRpcProvider(ganacheUrl, {
        name: 'ganache',
        chainId: 1337,
    });
    
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState('0.0');
    const [uid, setUid] = useState(null);
    const[address , setAddress ]=useState('');


    useEffect(()=>{

        fetchWallet();
    })
    const fetchWallet=async()=>{
        console.log("inside fetchWallet");
        setUid(auth.currentUser.uid);
        const response=await getDoc(doc(db,"users",uid));
        const data=response.data();

        console.log("Fetched Wallet Address: "+data.walletaddress);
        
        setAddress(data.walletaddress);
        console.log("address in address variable"+address);
        fetchBalance(data.walletaddress);
    }
    const fetchBalance=async(addresss)=>{
        console.log("inside fetchBalance, received address: "+ addresss);
        const takapoisa=await provider.getBalance(addresss);
        setBalance(ethers.formatEther(takapoisa));
        console.log("balance: ",ethers.formatEther(takapoisa));    
    }

    const checkBalance = async () => {
        if (!wallet) return;
        try {
            const balance = await provider.getBalance(address);
            setBalance(ethers.formatEther(balance));
        } catch (error) {
            console.error("Balance check error:", error);
            Alert.alert("Error", "Failed to fetch balance");
        }
    };

    const createWallet = async () => {
        try {
            const w = ethers.Wallet.createRandom();
            setWallet(w);
            setAddress(w.address);
            console.log("Wallet address:", w.address);
            Alert.alert("Wallet Created", `Address: ${w.address}`);
            if (uid) await upload(w.address, w.privateKey);
        } catch (error) {
            console.error("Wallet creation error:", error);
            Alert.alert("Error", "Failed to create wallet");
        }
    };

    const upload = async (walletAddress, pKey) => {
        try {
            await updateDoc(doc(db, "users", uid), { walletaddress: walletAddress, privateKey: pKey });
            Alert.alert("Success", "Wallet address saved");
        } catch (error) {
            console.error("Firebase error:", error);
            Alert.alert("Error", "Failed to save wallet");
        }
    };
    const sendtobro = async()=>{
        try {
            const senderPrivateKey = wallet.privateKey;
            const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
            const amount = ethers.parseEther("0.01");
            
            const tx = await senderWallet.sendTransaction({
                to: "0x95F0B914E36614Aa0B0E6d0B0d86B39b69142638",
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
    const receiveFromBro = async () => {
        if (!wallet) {
            Alert.alert("Error", "Create wallet first");
            return;
        }
        
        try {
            const senderPrivateKey = "0xeeaa9f5abdafa95223a59d748a5337d2129540e157d40373db16ee17c972585a";
            const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
            const amount = ethers.parseEther("0.01");
            
            const tx = await senderWallet.sendTransaction({
                to: address,
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

    return (
        <LinearGradient colors={['#0A0A0A', '#1A1A2E', '#16213E']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.balanceText}>Balance: {balance} ETH</Text>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={receiveFromBro}>
                        <Text style={styles.buttonText}>Receive Test ETH</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.button, styles.createButton]} onPress={createWallet}>
                        <Text style={styles.buttonText}>Create Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.createButton]} onPress={sendtobro}>
                        <Text style={styles.buttonText}>Send ETH</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.createButton]} onPress={fetchWallet}>
                        <Text style={styles.buttonText}>check Balance</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    balanceText: {
        fontSize: 28,
        marginBottom: 30,
        fontWeight: 'bold',
        color: '#00FFEA',
        textShadowColor: 'rgba(0, 255, 234, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#1A1A2E',
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#00FFEA',
        minWidth: 180,
        alignItems: 'center',
    },
    createButton: {
        borderColor: '#4CAF50',
    },
    buttonText: {
        color: '#00FFEA',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Wallet;