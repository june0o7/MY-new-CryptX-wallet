import { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import Home from "./Home";
import ID from "./ID";
import Wallet from "./Wallet";
import Set from "./Set";
import Ab from "./Ab";
import Pay from "./pay";
import PayToContact from "./PayToContact";
import Login from "./Login";
import sendCrypto from "./sendCrypto";
import TransactionHistory from "./TransactionHistory";
import CryptoNews from "./CryptoNews";

function Main({ navigation }) {
  const Drawer = createDrawerNavigator();
  const auth = getAuth();

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login"); // Navigate to Login screen
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  const handleprofile = async () => {
    try {
      // await signOut(auth);
      navigation.navigate("ID"); // Navigate to Login screen
      // Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: "#1A1A2E", // Dark background for the drawer
        },
        drawerActiveTintColor: "#00FFEA", // Neon blue for active item text
        drawerInactiveTintColor: "#6C6C6C", // Gray for inactive item text
        drawerActiveBackgroundColor: "#16213E", // Dark blue for active item background
        drawerItemStyle: {
          borderRadius: 10, // Rounded corners for drawer items
        },
        headerStyle: {
          backgroundColor: "#0A0A0A", // Dark background for the header
          shadowColor: "#00FFEA",
          shadowRadius: 10,
        },
        headerTintColor: "#00FFEA", // Neon text for the header
        headerRight: () => (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={require("./assets/icons/profile.png")}
              style={{height:35,width:35,shadowColor:"#00FFEA" }}
            />
          </TouchableOpacity>
        ),
      })}
    >

      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: () => (
            <Image
            source={require("./assets/icons/home.png")}
            style={{ height: 20, width: 20, tintColor: "#00FFEA" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Pay"
        component={Pay}
        options={{
          drawerIcon: () => (
            <Image
            source={require("./assets/icons/cash-payment-icon-5.png")}
            style={{ height: 23, width: 23, tintColor: "#00FFEA" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Pay To Contact"
        component={PayToContact}
        options={{
          drawerIcon: () => (
            <Image
            source={require("./assets/icons/paytocontact.png")}
            style={{ height: 20, width: 20, tintColor: "#00FFEA" }}
            />
          ),
        }}
      />
        {/* Screens */}<Drawer.Screen name="sendcrypto" component={sendCrypto} options={{
          drawerItemStyle: { display: 'none' },
          drawerIcon: () => (
            <Image
            source={require("./assets/icons/uparrow.png")}
            style={{ height: 20, width: 20, tintColor: "#00FFEA" }}
            />
          ),
        }}/>
      <Drawer.Screen
        name="Wallet"
        component={Wallet}
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/wallet.png")}
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }}
            />
          ),
        }}
      />
       <Drawer.Screen
        name="Transaction History"
        component={TransactionHistory}
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/bill.png")}
              style={{ height: 25, width: 21, tintColor: "#00FFEA" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="News"
        component={CryptoNews}
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/globe.png")}
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ID}
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/user.png")}
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={Set}
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/settings.png")}
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={Ab}
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/about.png")}
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }}
            />
          ),
        }}
      />
      {/* Logout Button */}
      <Drawer.Screen
        name="Logout"
        component={Login} // This is just a placeholder
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/log.png")}
              style={{ height: 20, width: 20, tintColor: "#FF5733" }} // Red tint for logout
            />
          ),
          drawerLabel: "Logout",
          drawerLabelStyle: { color: "#FF5733" }, // Red color for logout text
        }}
        listeners={{
          drawerItemPress: () => {
            handleLogout();
            return false; // Prevent default navigation
          },
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A2E",
    borderWidth: 0,
    borderColor: "#00FFEA",
  },
  iconImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
});

export default Main;