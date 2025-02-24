import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import app from "./firebaseConfig";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  collection,
  Firestore,
  addDoc,
  getFirestore,
  getDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

// import Pay from "./pay";
import PayToContact from "./PayToContact";
import { 
  ActivityIndicator 
} from "react-native";

import { auth, db } from "./firebaseConfig";



async function convertETHtoINR(ethAmount) {
  try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr");
      const data = await response.json();
      const ethToInrRate = data.ethereum.inr;

      const convertedAmount = ethAmount * ethToInrRate;
      console.log(`💰 ${ethAmount} ETH = ₹ $ { convertedAmount.toFixed(2)} INR`);
  } catch (error) {
      console.error("Error fetching exchange rate:", error);
  }
}


function Home({ navigation }) {


  //......................

  const auth = getAuth(app);
  const db = getFirestore(app);
  const [data, setData] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Add loading state
const [refreshing, setRefreshing] = useState(false);

// Update handleRefresh


// Add activity indicator
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
  

useEffect(() => {
  fetchData();
}, [refreshTrigger]); // Add refreshTrigger as dependency

// Add refresh handler function
const handleRefresh = () => {
  setRefreshTrigger(prev => prev + 1);
};


  //.....................





  //.......................
  return (
    <LinearGradient
      colors={["#0A0A0A", "#1A1A2E", "#16213E"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Existing Balance Section */}
          <View style={styles.balanceContainer}>
            <Text style={styles.greetingText}>Hello, {data && data.name}!</Text>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
                        {data && data.balance ? parseFloat(data.balance).toFixed(2) : "0.00"} ETH
            </Text>
            <TouchableOpacity 
    onPress={handleRefresh}
    style={styles.refreshButton}
>
    <Text style={styles.refreshButtonText}>↻</Text>
</TouchableOpacity>
            <View style={styles.marketGrowthContainer}>
              <Text style={styles.marketGrowthText}> ETH ≈ ₹{(data.balance * 300000).toFixed(2)} </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.iconButton}onPress={() => navigation.navigate('Pay')}>
                <Image
                  source={require("./assets/icons/uparrow.png")}
                  style={styles.iconImage}
                />
                <Text style={styles.iconText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}onPress={() => navigation.navigate('Wallet')}>
                <Image
                  source={require("./assets/icons/downarrow.png")}
                  style={styles.iconImage}
                />
                <Text style={styles.iconText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}onPress={() => navigation.navigate('Pay To Contact')}>
                <Image
                  source={require("./assets/icons/mg.png")}
                  style={styles.iconImage}
                />
                <Text style={styles.iconText}>Find</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* New: Quick Actions Section */}
          <Text style={styles.sectionHeader}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Scan QR</Text>
            </TouchableOpacity>
          </View>

          {/* New: Portfolio Performance Chart */}
          <Text style={styles.sectionHeader}>Portfolio Performance</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Chart Placeholder</Text>
          </View>

          {/* Existing Popular Section */}
          <Text style={styles.sectionHeader}>Popular</Text>
          <View style={styles.popularContainer}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={styles.popularItem}>
                <Image
                  source={require("./assets/images/eth.jpg")}
                  style={styles.popularImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.popularItem}>
                <Image
                  source={require("./assets/images/dbi.jpg")}
                  style={styles.popularImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.popularItem}>
                <Image
                  source={require("./assets/images/eth.jpg")}
                  style={styles.popularImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.popularItem}>
                <Image
                  source={require("./assets/images/dbi.jpg")}
                  style={styles.popularImage}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* New: News Section */}
          <Text style={styles.sectionHeader}>Latest News</Text>
          <View style={styles.newsContainer}>
            <Text style={styles.newsItem}>Bitcoin hits all-time high!</Text>
            <Text style={styles.newsItem}>Ethereum 2.0 launching soon.</Text>
            <Text style={styles.newsItem}>New altcoin gaining traction.</Text>
          </View>

          {/* Existing Businesses Section */}
          <Text style={styles.sectionHeader}>Businesses</Text>
          <View style={styles.businessesContainer}>
            {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {[
                "jio-logo-icon",
                "zomato",
                "swiggy",
                "bms",
                "lenskart",
                "jio-logo-icon",
                "zomato",
                "swiggy",
                "bms",
                "lenskart",
              ].map((icon, index) => (
                <TouchableOpacity key={index} style={styles.businessIcon}>
                  <Image
                    source={require(`./assets/icons/${icon}.png`)}
                    style={styles.businessImage}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView> */}




<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity>
            <Image
              source={require("./assets/icons/jio-logo-icon.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/zomato.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/swiggy.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/bms.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/lenskart.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/jio-logo-icon.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/zomato.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/swiggy.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/bms.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("./assets/icons/lenskart.png")}
              style={{ width: 50, height: 50, margin: 5 }}
            />
          </TouchableOpacity>
        </ScrollView>
          </View>

          {/* New: Recent Transactions */}
          <Text style={styles.sectionHeader}>Recent Transactions</Text>
          <View style={styles.transactionsContainer}>
            <Text style={styles.transactionItem}>Sent 0.5 BTC to Rajdeep</Text>
            <Text style={styles.transactionItem}>Received 1.2 BTC from Rumpa</Text>
            <Text style={styles.transactionItem}>Exchanged 0.3 BTC for ETH</Text>
          </View>

          {/* Existing People Section */}
          <Text style={styles.sectionHeader}>People</Text>
          <View style={styles.peopleContainer}>
            {[
              "Rajdeep",
              "Rumpa",
              "Rangan Nath",
              "Shyan Mandal",
              "Saptarshi Mandal",
              "Sradha",
              "Riya Pal",
              "Subhadeep Pal",
              "Soumik",
              "Rajesh Patra",
            ].map((name, index) => (
              <TouchableOpacity key={index} style={styles.personItem}>
                <Image
                  source={require("./assets/icons/profile.png")}
                  style={styles.personImage}
                />
                <Text style={styles.personName}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  balanceContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  greetingText: {
    color: "#00FFEA",
    fontSize: 30,
    fontWeight: "bold",
  },
  balanceLabel: {
    color: "#00FFEA",
    fontSize: 15,
    marginTop: 10,
  },
  balanceAmount: {
    color: "#00FFEA",
    fontSize: 25,
    marginTop: 5,
  },
  marketGrowthContainer: {
    backgroundColor: "#00FFEA",
    borderRadius: 10,
    padding: 5,
    width: 110,
    marginTop: 10,
  },
  marketGrowthText: {
    color: "#0A0A0A",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  iconButton: {
    alignItems: "center",
  },
  iconImage: {
    width: 30,
    height: 30,
    tintColor: "#00FFEA",
  },
  iconText: {
    color: "#00FFEA",
    fontSize: 12,
    marginTop: 5,
  },
  sectionHeader: {
    color: "#00FFEA",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickActionButton: {
    backgroundColor: "#1A1A2E",
    padding: 15,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00FFEA",
  },
  quickActionText: {
    color: "#00FFEA",
    fontSize: 14,
    fontWeight: "bold",
  },
  chartPlaceholder: {
    backgroundColor: "#1A1A2E",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  chartPlaceholderText: {
    color: "#00FFEA",
    fontSize: 16,
  },
  popularContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  popularItem: {
    margin: 10,
  },
  popularImage: {
    width: 200,
    height: 100,
    borderRadius: 15,
  },
  newsContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  newsItem: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 10,
  },
  businessesContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  businessIcon: {
    margin: 5,
  },
  businessImage: {
    width: 50,
    height: 50,
  },
  transactionsContainer: {
    backgroundColor: "#1A1A2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 20,
    top: 20,
},
  transactionItem: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 10,
  },
  peopleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  personItem: {
    alignItems: "center",
    marginBottom: 10,
    width: "30%",
  },
  personImage: {
    width: 50,
    height: 50,
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
  personName: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
});

export default Home;