import { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import ID from "./ID";
import Wallet from "./Wallet";
import Set from "./Set";
import Ab from "./Ab";
import Pay from "./pay";
import PayToContact from "./PayToContact";
import { Image, TouchableOpacity } from "react-native";

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
          backgroundColor: "#121212", // Dark background for the header
          shadowColor: "#121212",
        },
        headerTintColor: "#00FFEA", // White text for the header
        headerRight: () => (
          <TouchableOpacity>
            <Image
              source={require("./assets/icons/profile.png")}
              style={{ height: 40, width: 40, marginRight: 10}} // Neon blue tint for the profile icon
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
      
    </Drawer.Navigator>
  );
}

export default Main;