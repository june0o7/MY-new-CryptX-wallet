import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Clipboard,
  Alert
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import app from "./firebaseConfig";
import * as Animatable from 'react-native-animatable';

function ID(props) {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [data, setData] = useState({});
  const [scaleValue] = useState(new Animated.Value(0));
  const [fadeValue] = useState(new Animated.Value(0));

  async function fetch() {
    const uid = auth.currentUser.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    setData(docSnap.data());
    animateCards();
  }

  const animateCards = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    ]).start();
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied!", "Information copied to clipboard");
  };

  useEffect(() => {
    fetch();
    StatusBar.setBarStyle('light-content');
  }, []);

  return (
    <LinearGradient colors={["#0F0F2D", "#1A1A2E"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View 
          animation="fadeInDown"
          duration={1000}
          style={styles.profileContainer}
        >
          <TouchableOpacity style={styles.profileImageContainer}>
            <Image 
              source={require("./assets/icons/pp.jpg")} 
              style={styles.profileImage} 
            />
            <View style={styles.editIcon}>
              <Ionicons name="camera" size={18} color="#00FFEA" />
            </View>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View 
          animation="fadeIn"
          duration={1200}
          style={styles.userInfo}
        >
          <Text style={styles.nameText}>Mr. {data?.name}</Text>
          <TouchableOpacity 
            style={styles.userIdContainer}
            onPress={() => copyToClipboard(data?.uid)}
          >
            <Text style={styles.userIdText}>ID: {data?.uid}</Text>
            <MaterialIcons name="content-copy" size={16} color="#00FFEA" />
          </TouchableOpacity>
        </Animatable.View>

        <Animated.View 
          style={[
            styles.infoContainer,
            { 
              opacity: fadeValue,
              transform: [{ scale: scaleValue }] 
            }
          ]}
        >
          <InfoCard 
            icon="phone" 
            text={data?.phone} 
            onPress={() => copyToClipboard(data?.phone)}
          />
          <InfoCard 
            icon="calendar" 
            text={data?.dob} 
            onPress={() => copyToClipboard(data?.dob)}
          />
          <InfoCard 
            icon="map-marker" 
            text={data?.address} 
            onPress={() => copyToClipboard(data?.address)}
          />
          <InfoCard 
            icon="envelope" 
            text={data?.email} 
            onPress={() => copyToClipboard(data?.email)}
          />
        </Animated.View>

        <Animatable.View 
          animation="fadeInUp"
          duration={1000}
          style={styles.actionButtons}
        >
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="qrcode" size={24} color="#00FFEA" />
            <Text style={styles.actionButtonText}>Show QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social" size={24} color="#00FFEA" />
            <Text style={styles.actionButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
}

const InfoCard = ({ icon, text, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <LinearGradient 
      colors={["rgba(22, 33, 62, 0.7)", "rgba(26, 26, 46, 0.7)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.infoCard}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={icon} size={20} color="#00FFEA" />
      </View>
      <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
        {text || 'Not provided'}
      </Text>
      <MaterialIcons name="chevron-right" size={24} color="#4A4A6A" />
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#00FFEA',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#16213E',
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#00FFEA',
  },
  userInfo: {
    alignItems: 'center',
    marginVertical: 15,
  },
  nameText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 5,
  },
  userIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(22, 33, 62, 0.7)",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  userIdText: {
    color: "#00FFEA",
    fontSize: 14,
    marginRight: 5,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.2)',
  },
  iconContainer: {
    backgroundColor: 'rgba(0, 255, 234, 0.1)',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 33, 62, 0.7)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.3)',
    width: '48%',
  },
  actionButtonText: {
    color: "#00FFEA",
    marginLeft: 10,
    fontSize: 14,
  },
});

export default ID;