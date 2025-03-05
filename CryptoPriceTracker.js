import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function CryptoPriceTracker() {
  const [cryptoData, setCryptoData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch cryptocurrency data from CoinGecko API
  const fetchCryptoData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      const data = await response.json();
      setCryptoData(data);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      Alert.alert("Error", "Failed to fetch cryptocurrency data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCryptoData();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = () => {
    fetchCryptoData();
  };

  // Convert USD to INR (approximate conversion rate)
  const usdToInr = (usd) => (usd * 82.5).toFixed(2);

  return (
    <LinearGradient
      colors={["#0A0A0A", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator color="#00FFEA" size="large" />
        ) : (
          cryptoData.map((crypto) => (
            <View key={crypto.id} style={styles.cryptoItem}>
              <View style={styles.cryptoHeader}>
                <Image
                  source={{ uri: crypto.image }}
                  style={styles.cryptoImage}
                />
                <Text style={styles.cryptoName}>{crypto.name}</Text>
              </View>
              <View style={styles.cryptoDetails}>
                <Text style={styles.cryptoPrice}>
                  ${crypto.current_price.toFixed(2)}
                </Text>
                <Text style={styles.cryptoPrice}>
                  ₹{usdToInr(crypto.current_price)}
                </Text>
              </View>
              <View style={styles.cryptoChange}>
                <Text
                  style={[
                    styles.cryptoChangeText,
                    {
                      color:
                        crypto.price_change_percentage_24h >= 0
                          ? "#00FFEA"
                          : "#FF5733",
                    },
                  ]}
                >
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  cryptoItem: {
    backgroundColor: "#1A1A2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cryptoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cryptoImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  cryptoName: {
    color: "#00FFEA",
    fontSize: 16,
    fontWeight: "bold",
  },
  cryptoDetails: {
    alignItems: "flex-end",
  },
  cryptoPrice: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  cryptoChange: {
    alignItems: "flex-end",
  },
  cryptoChangeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CryptoPriceTracker;