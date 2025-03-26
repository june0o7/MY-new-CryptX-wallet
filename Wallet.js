import 'react-native-get-random-values';
import { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  TextInput, 
  Keyboard, 
  ScrollView, 
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ethers } from 'ethers';
import { doc, updateDoc, getFirestore, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import app from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const db = getFirestore(app);
const auth = getAuth(app);

const Wallet = ({ navigation }) => {
    const ganacheUrl = "http://192.168.29.107:7545";
    const provider = new ethers.JsonRpcProvider(ganacheUrl, {
        name: 'ganache',
        chainId: 1337,
    });
    
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState('0.0');
    const [uid, setUid] = useState(null);
    const [address, setAddress] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [storedPin, setStoredPin] = useState(null);
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState('');
    const [actionToConfirm, setActionToConfirm] = useState(null);
    const [pinError, setPinError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch wallet data including transactions
    const fetchWalletData = useCallback(async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;
            
            const currentUid = user.uid;
            setUid(currentUid);
            
            const docRef = doc(db, "users", currentUid);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) return;
            
            const data = docSnap.data();
            if (!data?.walletaddress) return;
            
            setAddress(data.walletaddress);
            setPrivateKey(data.privateKey);
            setStoredPin(data.pin);
            
            // Fetch balance and transactions in parallel
            await Promise.all([
                fetchBalance(data.walletaddress),
                fetchTransactions(currentUid)
            ]);
            
        } catch (error) {
            console.error("Wallet fetch error:", error);
            Alert.alert("Error", "Failed to load wallet information");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Fetch balance from blockchain
    const fetchBalance = async (walletAddress) => {
        try {
            const balance = await provider.getBalance(walletAddress);
            const ethBalance = ethers.formatEther(balance);
            setBalance(ethBalance);
            
            if(uid) {
                await updateDoc(doc(db, "users", uid), { balance: ethBalance });
            }
        } catch (error) {
            console.error("Balance update error:", error);
        }
    };

    // Fetch transactions from Firestore
    const fetchTransactions = async (userId) => {
        try {
            const transactionsRef = collection(db, "transactions");
            const q = query(transactionsRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            
            const txData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().timestamp?.toDate().toLocaleDateString() || 'N/A'
            }));
            
            setTransactions(txData.sort((a, b) => 
                new Date(b.timestamp?.toDate()) - new Date(a.timestamp?.toDate())
            ));
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    // Pull-to-refresh handler
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchWalletData();
    }, [fetchWalletData]);

    // Automatic refresh on focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchWalletData();
        });
        return unsubscribe;
    }, [navigation, fetchWalletData]);

    // Initial load
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchWalletData();
            }
        });
        return () => unsubscribe();
    }, [fetchWalletData]);

    // Wallet functions (create, send, receive, etc.)
    const createWallet = async () => {
        try {
            const w = ethers.Wallet.createRandom();
            setWallet(w);
            setAddress(w.address);
            Alert.alert("Wallet Created", `Address: ${w.address}`);
            if (uid) await upload(w.address, w.privateKey);
        } catch (error) {
            console.error("Wallet creation error:", error);
            Alert.alert("Error", "Failed to create wallet");
        }
    };

    const upload = async (walletAddress, pKey) => {
        try {
            await updateDoc(doc(db, "users", uid), { 
                walletaddress: walletAddress, 
                privateKey: pKey 
            });
        } catch (error) {
            console.error("Firebase error:", error);
        }
    };
    
    const sendtobro = async() => {
        try {
            const senderWallet = new ethers.Wallet(privateKey, provider);
            const amount = ethers.parseEther("1");
            
            const tx = await senderWallet.sendTransaction({
                to: "0x24C82E6E446Ca0bd7be2E14e83C11c7b3f13134C",
                value: amount,
            });
            
            await tx.wait();
            Alert.alert("Success", "Transaction completed");
            fetchWalletData(); // Refresh all data
        } catch (error) {
            console.error("Transaction error:", error);
            Alert.alert("Error", "Transaction failed");
        }
    };
    
    const receiveFromBro = async () => {
        if (!address) {
            Alert.alert("Error", "No wallet address found");
            return;
        }
        
        try {
            const senderWallet = new ethers.Wallet(
                "0x6980e71cf3228eb20b6ad4ff588a76349aa6513c187da7928a13e5f7ffd75495", 
                provider
            );
            const amount = ethers.parseEther("2");
            
            const tx = await senderWallet.sendTransaction({
                to: address,
                value: amount,
            });
            
            await tx.wait();
            Alert.alert("Success", "Transaction completed");
            fetchWalletData(); // Refresh all data
        } catch (error) {
            console.error("Transaction error:", error);
            Alert.alert("Error", "Transaction failed");
        }
    };
    
    const requestPinVerification = (action) => {
        setActionToConfirm(action);
        setShowPinModal(true);
        setPin('');
        setPinError('');
    };
    
    const verifyPin = () => {
        Keyboard.dismiss();
        if (pin === storedPin) {
            setShowPinModal(false);
            setTimeout(() => {
                executeVerifiedAction();
            }, 300);
        } else {
            setPinError('Incorrect PIN. Please try again.');
            setPin('');
        }
    };
    
    const executeVerifiedAction = () => {
        switch(actionToConfirm) {
            case 'send': sendtobro(); break;
            case 'receive': receiveFromBro(); break;
            default: break;
        }
    };

    if (loading) {
        return (
            <LinearGradient colors={['#0A0A0A', '#1A1A2E', '#16213E']} style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00FFEA" />
                    <Text style={styles.loadingText}>Loading Wallet...</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#0A0A0A', '#1A1A2E', '#16213E']} style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#00FFEA"
                        colors={['#00FFEA']}
                    />
                }
            >
                {/* Balance Card */}
                <Animatable.View animation="fadeInDown" duration={800} style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Your Balance</Text>
                    <Text style={styles.balanceAmount}>
                        {balance ? parseFloat(balance).toFixed(4) : "0.0000"} ETH
                    </Text>
                    <Text style={styles.walletAddress}>
                        {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'No wallet'}
                    </Text>
                </Animatable.View>

                {/* Quick Actions */}
                <Animatable.View animation="fadeInUp" duration={600} style={styles.quickActions}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionRow}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Pay')}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name="send" size={24} color="#00FFEA" />
                            </View>
                            <Text style={styles.actionText}>Pay</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Pay To Contact')}
                        >
                            <View style={styles.iconCircle}>
                                <MaterialIcons name="contacts" size={24} color="#00FFEA" />
                            </View>
                            <Text style={styles.actionText}>Pay Contacts</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Add To Contact')}
                        >
                            <View style={styles.iconCircle}>
                                <FontAwesome name="user-plus" size={20} color="#00FFEA" />
                            </View>
                            <Text style={styles.actionText}>Add Contact</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>

                {/* Transaction History */}
                <Animatable.View animation="fadeInUp" duration={800} style={styles.historySection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Transaction History')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {transactions.length > 0 ? (
                        transactions.slice(0, 3).map((tx) => (
                            <Animatable.View 
                                key={tx.id}
                                animation="fadeInRight"
                                duration={600}
                                style={styles.transactionItem}
                            >
                                <View style={styles.transactionContent}>
                                    <View style={styles.transactionIcon}>
                                        <FontAwesome 
                                            name={tx.type === 'send' ? 'arrow-up' : 'arrow-down'} 
                                            size={16} 
                                            color={tx.type === 'send' ? '#FF5252' : '#4CAF50'} 
                                        />
                                    </View>
                                    <View style={styles.transactionDetails}>
                                        <Text style={styles.transactionText}>
                                            {tx.type === 'send' ? `Sent to ${tx.toAddress}` : `Received from ${tx.fromAddress}`}
                                        </Text>
                                        <Text style={styles.transactionAmount}>
                                            {ethers.formatEther(tx.amount || '0')} ETH
                                        </Text>
                                        <Text style={styles.transactionDate}>{tx.date}</Text>
                                    </View>
                                </View>
                            </Animatable.View>
                        ))
                    ) : (
                        <View style={styles.placeholderHistory}>
                            <MaterialIcons name="history" size={40} color="#4A4A4A" />
                            <Text style={styles.placeholderText}>No transactions yet</Text>
                        </View>
                    )}
                </Animatable.View>

                {/* Wallet Management */}
                <Animatable.View animation="fadeInUp" duration={1000} style={styles.managementSection}>
                    <Text style={styles.sectionTitle}>Wallet Management</Text>
                    <View style={styles.managementButtons}>
                        {!address ? (
                            <TouchableOpacity 
                                style={[styles.managementButton, styles.createButton]}
                                onPress={createWallet}
                            >
                                <AntDesign name="pluscircleo" size={20} color="#4CAF50" />
                                <Text style={styles.managementButtonText}>Create Wallet</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity 
                                    style={[styles.managementButton, styles.sendButton]}
                                    onPress={() => requestPinVerification('send')}
                                >
                                    <Ionicons name="arrow-up" size={20} color="#FF5252" />
                                    <Text style={styles.managementButtonText}>Send ETH</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[styles.managementButton, styles.receiveButton]}
                                    onPress={() => requestPinVerification('receive')}
                                >
                                    <Ionicons name="arrow-down" size={20} color="#4CAF50" />
                                    <Text style={styles.managementButtonText}>Receive ETH</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </Animatable.View>
            </ScrollView>
            
            {/* PIN Verification Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showPinModal}
                onRequestClose={() => setShowPinModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animatable.View animation="fadeInUp" duration={400} style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter Security PIN</Text>
                        <Text style={styles.modalSubtitle}>To authorize this transaction</Text>
                        
                        <TextInput
                            style={styles.pinInput}
                            keyboardType="numeric"
                            secureTextEntry={true}
                            maxLength={4}
                            value={pin}
                            onChangeText={setPin}
                            autoFocus={true}
                        />
                        
                        {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}
                        
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowPinModal(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={verifyPin}
                                disabled={pin.length !== 4}
                            >
                                <Text style={styles.modalButtonText}>Authorize</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#00FFEA',
        marginTop: 20,
        fontSize: 16,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    balanceCard: {
        backgroundColor: '#1A1A2E',
        borderRadius: 15,
        padding: 25,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#00FFEA',
        alignItems: 'center',
    },
    balanceLabel: {
        color: '#AAAAAA',
        fontSize: 16,
        marginBottom: 5,
    },
    balanceAmount: {
        color: '#00FFEA',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    walletAddress: {
        color: '#AAAAAA',
        fontSize: 14,
        fontFamily: 'monospace',
    },
    quickActions: {
        marginBottom: 25,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        alignItems: 'center',
        width: '30%',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1A1A2E',
        borderWidth: 1,
        borderColor: '#00FFEA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 12,
        textAlign: 'center',
    },
    historySection: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    viewAllText: {
        color: '#00FFEA',
        fontSize: 14,
    },
    transactionItem: {
        marginBottom: 10,
    },
    transactionContent: {
        flexDirection: 'row',
        backgroundColor: '#1A1A2E',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#2D2D42',
    },
    transactionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 255, 234, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 4,
    },
    transactionAmount: {
        color: '#00FFEA',
        fontSize: 14,
        marginBottom: 4,
    },
    transactionDate: {
        color: '#6C6C6C',
        fontSize: 12,
    },
    placeholderHistory: {
        height: 120,
        backgroundColor: '#1A1A2E',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2D2D42',
    },
    placeholderText: {
        color: '#4A4A4A',
        marginTop: 10,
    },
    managementSection: {
        marginBottom: 20,
    },
    managementButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    managementButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '48%',
    },
    createButton: {
        backgroundColor: '#1A1A2E',
        borderWidth: 1,
        borderColor: '#4CAF50',
        justifyContent: 'center',
    },
    sendButton: {
        backgroundColor: '#1A1A2E',
        borderWidth: 1,
        borderColor: '#FF5252',
        justifyContent: 'space-between',
    },
    receiveButton: {
        backgroundColor: '#1A1A2E',
        borderWidth: 1,
        borderColor: '#4CAF50',
        justifyContent: 'space-between',
    },
    managementButtonText: {
        color: '#FFFFFF',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#1E1E2E',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00FFEA',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#00FFEA',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#AAAAAA',
        marginBottom: 25,
        textAlign: 'center',
    },
    pinInput: {
        width: '100%',
        height: 50,
        borderColor: '#00FFEA',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 5,
    },
    errorText: {
        color: '#FF5252',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FF5252',
    },
    confirmButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#05f043',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default Wallet;