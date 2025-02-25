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
    
    const ganacheUrl = "http://192.168.29.107:7545";//home 
    
    // const ganacheUrl = "http://192.168.0.172:7545";
    // const ganacheUrl = "http://192.168.0.172:7545";
    const provider = new ethers.JsonRpcProvider(ganacheUrl, {
        name: 'ganache',
        chainId: 1337,
    });
    
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState('0.0');
    const [uid, setUid] = useState(null);
    const[address , setAddress ]=useState('');
    const [privateKey, setPrivateKey]=useState('');


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchWallet();
            }
        });
        
        return () => unsubscribe();
    }, []);
    const fetchWallet = async () => {
        try {
            console.log("inside fetchWallet");
            const user = auth.currentUser;
            
            if (!user) {
                console.log("No authenticated user");
                return;
            }
            
            const currentUid = user.uid;
            setUid(currentUid);
            
            const docRef = doc(db, "users", currentUid);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                console.log("No document found for user");
                return;
            }
            
            const data = docSnap.data();
            
            if (!data?.walletaddress) {
                console.log("No wallet address found in document");
                return;
            }
            
            console.log("Fetched Wallet Address:", data.walletaddress);
            // console.log("Fetched Wallet Address:", w.privateKey);
            setAddress(data.walletaddress);
            setPrivateKey(data.privateKey);
            await fetchBalance(data.walletaddress);
            
        } catch (error) {
            console.error("Wallet fetch error:", error);
            Alert.alert("Error", "Failed to load wallet information");
        }
    };
    const fetchBalance = async (addresss) => {
        try {
            console.log("inside fetchBalance, received address: "+ addresss);
            const takapoisa = await provider.getBalance(addresss);
            const ethBalance = ethers.formatEther(takapoisa);
            
            // Update local state
            setBalance(ethBalance);
            
            // Update Firestore
            if(uid) {
                await updateDoc(doc(db, "users", uid), {
                    balance: ethBalance
                });
                console.log("Balance updated in Firestore");
            }
        } catch (error) {
            console.error("Balance update error:", error);
            Alert.alert("Error", "Failed to save balance to database");
        }
    };

    const checkBalance = async () => {
        if (!address) return;
        try {
            const balance = await provider.getBalance(address);
            const ethBalance = ethers.formatEther(balance);
            
            // Update both state and Firestore
            setBalance(ethBalance);
            if(uid) {
                await updateDoc(doc(db, "users", uid), {
                    balance: ethBalance
                });
            }
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
            console.log("Wallet address:", w.privateKey);
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
            //what is the sender private key....
            const senderPrivateKey = privateKey;
            console.log("send to bro ", address);
            // const senderPrivateKey = w.privateKey;
            const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
            const amount = ethers.parseEther("0.01");
            
            const tx = await senderWallet.sendTransaction({
                to: "0x3e2058885342e874774c2FA6cB18A0398931Ed1f",
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
        if (!Wallet) {
            Alert.alert("Error", "Create wallet first");
            return;
        }
        
        try {
            const senderPrivateKey = "0x689a190151f56743e65d8f4e0a177239a4cd449a9b3d1574826ef95d3bc37d9b";
            const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
            const amount = ethers.parseEther("5");
            
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
            <Text style={styles.balanceText}>
  Balance: {balance ? parseFloat(balance).toFixed(2) : "0.00"} ETH
</Text>

                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={receiveFromBro}>
                        <Text style={styles.buttonText}>Receive Test ETH</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.button, styles.createButton]} onPress={createWallet}>
                        <Text style={styles.buttonText}>Create Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.createButton]} onPress={sendtobro}>
                        <Text style={styles.buttonText}>Send Test ETH</Text>
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