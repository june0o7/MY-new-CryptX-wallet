import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const CryptoPriceTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("usd"); // 'usd' or 'inr'
  const [sortBy, setSortBy] = useState("market_cap"); // 'market_cap' or 'volume' or 'price_change'

  // Exchange rate (could be fetched from an API in a real app)
  const exchangeRate = 82.5;

  const fetchCryptoData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error("No cryptocurrency data available");
      }

      // Sort data based on selected option
      let sortedData = [...data];
      if (sortBy === "volume") {
        sortedData.sort((a, b) => b.total_volume - a.total_volume);
      } else if (sortBy === "price_change") {
        sortedData.sort(
          (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
        );
      }

      setCryptoData(sortedData);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setError(error.message || "Failed to fetch cryptocurrency data");
      Alert.alert("Error", error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, [sortBy]);

  const onRefresh = () => {
    fetchCryptoData();
  };

  const toggleCurrency = () => {
    setCurrency(currency === "usd" ? "inr" : "usd");
  };

  const formatPrice = (price) => {
    if (currency === "inr") {
      return `₹${(price * exchangeRate).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`;
    }
    return `$${price.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap}`;
  };

  const renderCryptoItem = (crypto) => (
    <View key={crypto.id} style={styles.cryptoItem}>
      <View style={styles.cryptoInfo}>
        <Image
          source={{ uri: crypto.image }}
          style={styles.cryptoImage}
          resizeMode="contain"
        />
        <View style={styles.cryptoNameContainer}>
          <Text style={styles.cryptoName}>{crypto.name}</Text>
          <Text style={styles.cryptoSymbol}>{crypto.symbol.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cryptoStats}>
        <Text style={styles.cryptoPrice}>{formatPrice(crypto.current_price)}</Text>
        <Text
          style={[
            styles.cryptoChange,
            {
              color:
                crypto.price_change_percentage_24h >= 0
                  ? "#4CAF50" // Green for positive
                  : "#F44336", // Red for negative
            },
          ]}
        >
          {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
          {crypto.price_change_percentage_24h.toFixed(2)}%
        </Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Cryptocurrency Prices</Text>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.currencyButton}
          onPress={toggleCurrency}
        >
          <Text style={styles.currencyButtonText}>
            {currency.toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            setSortBy(
              sortBy === "market_cap"
                ? "volume"
                : sortBy === "volume"
                ? "price_change"
                : "market_cap"
            );
          }}
        >
          <MaterialIcons
            name="sort"
            size={20}
            color="#00FFEA"
            style={styles.sortIcon}
          />
          <Text style={styles.sortButtonText}>
            {sortBy === "market_cap"
              ? "Market Cap"
              : sortBy === "volume"
              ? "Volume"
              : "24h Change"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00FFEA" />
          <Text style={styles.loadingText}>Loading market data...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <MaterialIcons name="error-outline" size={50} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCryptoData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (cryptoData.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.noDataText}>No cryptocurrency data available</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCryptoData}
          >
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {renderHeader()}
        {cryptoData.map(renderCryptoItem)}
      </>
    );
  };

  return (
    <LinearGradient
      colors={["#0A0A0A", "#1A1A2E", "#16213E"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00FFEA"
            colors={["#00FFEA"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  noDataText: {
    color: "#6C6C6C",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  currencyButton: {
    backgroundColor: "#1A1A2E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00FFEA",
  },
  currencyButtonText: {
    color: "#00FFEA",
    fontWeight: "bold",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00FFEA",
  },
  sortButtonText: {
    color: "#00FFEA",
    fontWeight: "bold",
    marginLeft: 8,
  },
  cryptoItem: {
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cryptoInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cryptoImage: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  cryptoNameContainer: {
    flex: 1,
  },
  cryptoName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  cryptoSymbol: {
    color: "#6C6C6C",
    fontSize: 12,
    textTransform: "uppercase",
  },
  cryptoStats: {
    alignItems: "flex-end",
  },
  cryptoPrice: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cryptoChange: {
    fontSize: 14,
    fontWeight: "bold",
  },
  retryButton: {
    backgroundColor: "#00FFEA",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#0A0A0A",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CryptoPriceTracker;