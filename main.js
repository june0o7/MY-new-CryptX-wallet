import { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import ID from "./ID";
import Wallet from "./Wallet";
import Set from "./Set";
import Ab from "./Ab";
import Pay from "./pay";
import PayToContact from "./PayToContact";
import { Image, TouchableOpacity,StyleSheet } from "react-native";
import Login from "./Login";
// import { StyleSheet, TouchableOpacity, Image } from "react-native";


function Main() {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
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
          shadowRadius:10,
        },
        headerTintColor: "#00FFEA", // neon text for the header
        headerRight: () => (
          <TouchableOpacity style={styles.iconContainer}>
            <Image
              source={require("./assets/icons/profile.png")}
              // style={{ height: 40, width: 40, marginRight: 10}}
               style={styles.iconImage} // Neon blue tint for the profile icon
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/home.png")}
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }} // Neon blue tint for the icon
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
              style={{ height: 23, width: 23, tintColor: "#00FFEA" }} // Neon blue tint for the icon
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
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }} // Neon blue tint for the icon
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Wallet"
        component={Wallet}
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/wallet.png")}
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }} // Neon blue tint for the icon
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
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }} // Neon blue tint for the icon
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
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }} // Neon blue tint for the icon
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
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }} // Neon blue tint for the icon
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={Login}
        options={{
          drawerIcon: () => (
            <Image
              source={require("./assets/icons/log.png")}
              style={{ height: 20, width: 20, tintColor: "#00FFEA" }} // Neon blue tint for the icon
            />
          ),
        }}
      />
      
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#00FFEA", // Neon blue base
    borderRadius: 50, // Circular glow
    padding: 5,
    shadowColor: "#00FFFF", // Neon cyan glow effect
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 10,
    shadowRadius: 5,
    elevation: 5, // Android shadow
  },
  iconImage: {
    height: 40,
    width: 40,
    // tintColor: "#00FFEA", // Neon tint
  },
});


export default Main;