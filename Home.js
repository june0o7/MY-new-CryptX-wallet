import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions
} from "react-native";
import { RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { ethers } from "ethers";
import app from "./firebaseConfig";
import * as Animatable from 'react-native-animatable';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const auth = getAuth(app);
const db = getFirestore(app);

function Home({ navigation }) {
  const [data, setData] = useState({});
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0.0");
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  const provider = new ethers.JsonRpcProvider("http://192.168.29.107:7545", {
    name: "ganache",
    chainId: 1337,
  });

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    fetchData();
    fetchNews();
  }, []);

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
        setAddress(docSnap.data().walletaddress);
        if (docSnap.data().balance) {
          setBalance(docSnap.data().balance);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(
        'https://cryptopanic.com/api/v1/posts/?auth_token=0b506b16c9ef6df9a91aeb3a21f676ec5fa39ec6&public=true'
      );
      const data = await response.json();
      setNews(data.results.slice(0, 3)); // Show only 3 latest news
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async () => {
    if (!address) {
      Alert.alert("Error", "Wallet address not found.");
      return;
    }

    setRefreshing(true);
    try {
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(balance);
      
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          balance: ethBalance,
        });
        setBalance(ethBalance);
      }
    } catch (error) {
      console.error("Balance check error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
    checkBalance();
    fetchNews();
  };

  const formatAddress = (addr) => {
    return addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : 'No wallet';
  };

  return (
    <LinearGradient
      colors={["#0F0F2D", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00FFEA"
            colors={['#00FFEA']}
          />
        }
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Header Balance Card */}
          <Animatable.View animation="fadeInDown" duration={800} style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.greetingText}>Hello, {data?.name || 'User'}!</Text>
              <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                {refreshing ? (
                  <ActivityIndicator color="#00FFEA" size="small" />
                ) : (
                  <Ionicons name="refresh" size={24} color="#00FFEA" />
                )}
              </TouchableOpacity>
            </View>
            
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
              {parseFloat(balance || '0').toFixed(4)} ETH
            </Text>
            
            <View style={styles.balanceDetails}>
              <Text style={styles.walletAddress}>{formatAddress(address)}</Text>
              <View style={styles.conversionBox}>
                <Text style={styles.conversionText}>≈ ₹{(parseFloat(balance || '0') * 300000).toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Pay')}
              >
                <Ionicons name="send" size={20} color="#00FFEA" />
                <Text style={styles.actionButtonText}>Send</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Wallet')}
              >
                <Ionicons name="wallet" size={20} color="#00FFEA" />
                <Text style={styles.actionButtonText}>Wallet</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Pay To Contact')}
              >
                <Ionicons name="people" size={20} color="#00FFEA" />
                <Text style={styles.actionButtonText}>Friends</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>

          {/* Quick Actions Section */}
          <Animatable.View animation="fadeInUp" duration={800} delay={200}>
            <Text style={styles.sectionHeader}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Wallet')}
                >
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="wallet" size={24} color="#00FFEA" />
                  </View>
                  <Text style={styles.quickActionText}>Wallet</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Pay')}
                >
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="send" size={24} color="#00FFEA" />
                  </View>
                  <Text style={styles.quickActionText}>Pay</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Transaction History')}
                >
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="time" size={24} color="#00FFEA" />
                  </View>
                  <Text style={styles.quickActionText}>Transactions</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.quickActionsRow}>
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('News')}
                >
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="newspaper" size={24} color="#00FFEA" />
                  </View>
                  <Text style={styles.quickActionText}>News</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Crypto Price')}
                >
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="trending-up" size={24} color="#00FFEA" />
                  </View>
                  <Text style={styles.quickActionText}>Market</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Add To Contact')}
                >
                  <View style={styles.quickActionIcon}>
                    <Ionicons name="person-add" size={24} color="#00FFEA" />
                  </View>
                  <Text style={styles.quickActionText}>Contacts</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>

          {/* Crypto Assets Section */}
          <Animatable.View animation="fadeInUp" duration={800} delay={400}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Popular Assets</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.assetsContainer}
            >
              {[
                { name: 'Ethereum', symbol: 'ETH', icon: require('./assets/images/eth.jpg') },
                { name: 'Bitcoin', symbol: 'BTC', icon: require('./assets/images/dbi.jpg') },
                { name: 'Cardano', symbol: 'ADA', icon: require('./assets/images/eth.jpg') },
                { name: 'Solana', symbol: 'SOL', icon: require('./assets/images/dbi.jpg') },
              ].map((asset, index) => (
                <TouchableOpacity key={index} style={styles.assetCard}>
                  <Image source={asset.icon} style={styles.assetImage} />
                  <Text style={styles.assetName}>{asset.name}</Text>
                  <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animatable.View>

          {/* News Section */}
          <Animatable.View animation="fadeInUp" duration={800} delay={600}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Latest News</Text>
              <TouchableOpacity onPress={fetchNews}>
                <Ionicons name="refresh" size={20} color="#00FFEA" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.newsContainer}>
              {loading ? (
                <ActivityIndicator color="#00FFEA" />
              ) : (
                news.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.newsItem}>
                    <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.newsSource}>{item.source?.name || 'Unknown Source'}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </Animatable.View>

          {/* Partners Section */}
          <Animatable.View animation="fadeInUp" duration={800} delay={800}>
            <Text style={styles.sectionHeader}>Our Partners</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.partnersContainer}
            >
              {[
                require('./assets/icons/jio-logo-icon.png'),
                require('./assets/icons/zomato.png'),
                require('./assets/icons/swiggy.png'),
                require('./assets/icons/bms.png'),
                require('./assets/icons/lenskart.png'),
              ].map((icon, index) => (
                <TouchableOpacity key={index} style={styles.partnerLogo}>
                  <Image source={icon} style={styles.partnerImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animatable.View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.2)',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  greetingText: {
    color: '#00FFEA',
    fontSize: 22,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  balanceLabel: {
    color: '#6C6C6C',
    fontSize: 16,
    marginBottom: 5,
  },
  balanceAmount: {
    color: '#00FFEA',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletAddress: {
    color: '#6C6C6C',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  conversionBox: {
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  conversionText: {
    color: '#00FFEA',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.2)',
  },
  actionButtonText: {
    color: '#00FFEA',
    fontSize: 14,
    marginTop: 5,
  },
  sectionHeader: {
    color: '#00FFEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#00FFEA',
    fontSize: 14,
  },
  quickActionsGrid: {
    marginBottom: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  quickActionCard: {
    width: '30%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.1)',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  assetsContainer: {
    paddingBottom: 10,
  },
  assetCard: {
    width: 120,
    marginRight: 15,
    alignItems: 'center',
  },
  assetImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  assetName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  assetSymbol: {
    color: '#6C6C6C',
    fontSize: 12,
  },
  newsContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  newsItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  newsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
  },
  newsSource: {
    color: '#6C6C6C',
    fontSize: 12,
  },
  partnersContainer: {
    paddingBottom: 10,
  },
  partnerLogo: {
    marginRight: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
  },
  partnerImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default Home;