import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, TouchableOpacity, StyleSheet, Alert, View, Text, Animated, Easing } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Home from "./Home";
import ChatScreen from "./chat";
import ID from "./ID";
import Wallet from "./Wallet";
import design from "./design";
import Set from "./Set";
import Ab from "./Ab";
import Pay from "./pay";
import PayToContact from "./PayToContact";
import Login from "./Login";
import sendCrypto from "./sendCrypto";
import TransactionHistory from "./TransactionHistory";
import CryptoNews from "./CryptoNews";
import CryptoPriceTracker from "./CryptoPriceTracker";
import AddFriendPage from "./AddFriendPage";

const CustomDrawerContent = (props) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [rotateValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogoutPress = () => {
    Animated.sequence([
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      props.handleLogout();
    });
  };

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg']
  });

  return (
    <LinearGradient colors={["#0F0F2D", "#1A1A2E"]} style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <Animatable.View 
          animation="fadeInDown"
          duration={800}
          style={styles.drawerHeader}
        >
          <Image
            source={require("./assets/icons/pp.jpg")}
            style={styles.profileImage}
          />
          <Text style={styles.headerTitle}>Crypto Wallet</Text>
          <Text style={styles.headerSubtitle}>Premium Account</Text>
        </Animatable.View>

        <View style={styles.drawerSection}>
          <DrawerItemList 
            {...props} 
            activeTintColor="#00FFEA"
            inactiveTintColor="#6C6C6C"
            labelStyle={styles.drawerLabel}
          />
        </View>
      </DrawerContentScrollView>

      <Animated.View 
        style={[
          styles.logoutContainer,
          { transform: [{ scale: scaleValue }, { rotate: rotation }] }
        ]}
      >
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogoutPress}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out" size={24} color="#FF5252" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

function Main({ navigation }) {
  const Drawer = createDrawerNavigator();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  const getIconComponent = (iconName, iconType = 'Ionicons', color = "#00FFEA") => {
    const IconComponent = {
      Ionicons,
      MaterialIcons,
      FontAwesome,
      AntDesign
    }[iconType];
    
    return ({ focused }) => (
      <IconComponent 
        name={iconName} 
        size={22} 
        color={focused ? "#00FFEA" : "#6C6C6C"} 
      />
    );
  };

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} handleLogout={handleLogout} />}
      screenOptions={{
        drawerStyle: {
          width: 280,
        },
        drawerActiveTintColor: "#00FFEA",
        drawerInactiveTintColor: "#6C6C6C",
        drawerActiveBackgroundColor: "rgba(0, 255, 234, 0.1)",
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 10,
          marginVertical: 4,
        },
        headerStyle: {
          backgroundColor: "#0A0A0A",
          shadowColor: "#00FFEA",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
        },
        headerTitleStyle: {
          color: "#00FFEA",
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTintColor: "#00FFEA",
        headerRight: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={require("./assets/icons/pp.jpg")}
              style={styles.headerProfileImage}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: getIconComponent('home'),
          headerTitle: "Dashboard"
        }}
      />
      <Drawer.Screen
        name="Pay"
        component={Pay}
        options={{
          drawerIcon: getIconComponent('send', 'Ionicons'),

          headerTitle: "Send Payment"
        }}
      />
      <Drawer.Screen
        name="Pay To Contact"
        component={PayToContact}
        options={{
          drawerIcon: getIconComponent('account-box', 'MaterialIcons'),
          headerTitle: "Pay Contacts"
        }}
      />
      <Drawer.Screen
        name="Add To Contact"
        component={AddFriendPage}
        options={{
          drawerIcon: getIconComponent('user-plus', 'FontAwesome'),
          headerTitle: "Add Contact"
        }}
      />
      <Drawer.Screen 
        name="sendcrypto" 
        component={sendCrypto} 
        options={{
          drawerItemStyle: { display: 'none' },
          headerTitle: "Send Crypto"
        }}
      />
      <Drawer.Screen
        name="Wallet"
        component={Wallet}
        options={{
          drawerIcon: getIconComponent('wallet'),
          headerTitle: "My Wallet"
        }}
      />
      <Drawer.Screen
        name="Transaction History"
        component={TransactionHistory}
        options={{
          drawerIcon: getIconComponent('history', 'FontAwesome'),
          headerTitle: "Transactions"
        }}
      />
      <Drawer.Screen
        name="News"
        component={CryptoNews}
        options={{
          drawerIcon: getIconComponent('newspaper'),
          headerTitle: "Crypto News"
        }}
      />
      <Drawer.Screen
        name="Crypto Price"
        component={CryptoPriceTracker}
        options={{
          drawerIcon: getIconComponent('line-chart', 'FontAwesome'),
          headerTitle: "Market Data"
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ID}
        options={{
          drawerIcon: getIconComponent('user-circle', 'FontAwesome')
,
          headerTitle: "My Profile"
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          drawerIcon: getIconComponent('chatbubble'),
          
          headerTitle: "chat"
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={Set}
        options={{
          drawerIcon: getIconComponent('settings'),
          headerTitle: "Settings"
        }}
      />
      <Drawer.Screen
        name="About"
        component={Ab}
        options={{
          drawerIcon: getIconComponent('info-circle', 'FontAwesome'),
          headerTitle: "About App"
        }}
      />
      <Drawer.Screen
        name="design"
        component={design}
        options={{
          drawerIcon: getIconComponent('palette', 'MaterialIcons'),
          headerTitle: "Design System"
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 234, 0.1)',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#00FFEA',
    marginBottom: 10,
  },
  headerTitle: {
    color: '#00FFEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#6C6C6C',
    fontSize: 14,
  },
  drawerSection: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: -15,
  },
  logoutContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 255, 234, 0.1)',
    paddingTop: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
  logoutText: {
    color: '#FF5252',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerButton: {
    marginRight: 15,
  },
  headerProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#00FFEA',
  },
});

export default Main;