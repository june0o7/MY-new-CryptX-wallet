import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

function Ab({ navigation }) {
  // Animation configurations
  const fadeIn = {
    from: { opacity: 0 },
    to: { opacity: 1 },
  };

  const slideIn = {
    from: { translateX: -100 },
    to: { translateX: 0 },
  };

  return (
    <LinearGradient colors={['#0F0F2D', '#1A1A2E']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animatable.View 
          animation={fadeIn}
          duration={1000}
          style={styles.header}
        >
          <Text style={styles.headerText}>About CryptX Wallet</Text>
          <Text style={styles.subtitle}>
            Revolutionizing digital asset management with security and simplicity
          </Text>
        </Animatable.View>

        {/* Mission Section */}
        <Animatable.View 
          animation={slideIn}
          duration={800}
          delay={200}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            {/* <MaterialIcons name="mission" size={24} color="#00FFEA" /> */}
            {/* <MaterialIcons name="flag" size={24} color="#00FFEA" />   // Represents a mission or goal */}
{/* <MaterialIcons name="verified" size={24} color="#00FFEA" />  // Represents a trustworthy mission */}
<MaterialIcons name="stars" size={24} color="#00FFEA" /> 

            <Text style={styles.cardTitle}>Our Mission</Text>
          </View>
          <Text style={styles.cardText}>
            To empower individuals with intuitive tools for secure cryptocurrency management, 
            bridging the gap between complex blockchain technology and everyday users.
          </Text>
        </Animatable.View>

        {/* Features Section */}
        <Animatable.View 
          animation={slideIn}
          duration={800}
          delay={400}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#00FFEA" />
            <Text style={styles.cardTitle}>Key Features</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="lock-closed" size={20} color="#00FFEA" />
            <Text style={styles.featureText}>Military-grade encryption for all transactions</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="finger-print" size={20} color="#00FFEA" />
            <Text style={styles.featureText}>Biometric authentication for secure access</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={20} color="#00FFEA" />
            <Text style={styles.featureText}>Lightning-fast transactions with minimal fees</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="eye" size={20} color="#00FFEA" />
            <Text style={styles.featureText}>Real-time portfolio tracking and analytics</Text>
          </View>
        </Animatable.View>

        {/* Technology Section */}
        <Animatable.View 
          animation={slideIn}
          duration={800}
          delay={600}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="hardware-chip" size={24} color="#00FFEA" />
            <Text style={styles.cardTitle}>Advanced Technology</Text>
          </View>
          <Text style={styles.cardText}>
            Built on cutting-edge blockchain infrastructure with:
          </Text>
          
          <View style={styles.techGrid}>
            <View style={styles.techItem}>
              <LottieView
                source={require('./assets/animations/Animation - 1743018944930.json')}
                autoPlay
                loop
                style={styles.techAnimation}
              />
              <Text style={styles.techText}>Non-custodial Architecture</Text>
            </View>
            
            <View style={styles.techItem}>
              <LottieView
                source={require('./assets/animations/Animation - 1743019863899 (1).json')}
                autoPlay
                loop
                style={styles.techAnimation}
              />
              <Text style={styles.techText}>Multi-Sig Security</Text>
            </View>
          </View>
        </Animatable.View>

        {/* Team Section */}
        <Animatable.View 
          animation={slideIn}
          duration={800}
          delay={800}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={24} color="#00FFEA" />
            <Text style={styles.cardTitle}>Our Team</Text>
          </View>
          <Text style={styles.cardText}>
            Founded by blockchain veterans with decades of combined experience in:
          </Text>
          
          <View style={styles.teamStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10+</Text>
              <Text style={styles.statLabel}>Years in Crypto</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Projects Delivered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100K+</Text>
              <Text style={styles.statLabel}>Users Served</Text>
            </View>
          </View>
        </Animatable.View>

        {/* CTA Section */}
        <Animatable.View 
          animation={fadeIn}
          duration={1000}
          delay={1000}
          style={styles.ctaContainer}
        >
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.ctaText}>Get In Touch</Text>
            <Ionicons name="arrow-forward" size={20} color="#0A0A0A" />
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FFEA',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C6C6C',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 234, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#00FFEA',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
  },
  techGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  techItem: {
    width: '48%',
    alignItems: 'center',
  },
  techAnimation: {
    width: 80,
    height: 80,
  },
  techText: {
    color: '#00FFEA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
  },
  statNumber: {
    color: '#00FFEA',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#6C6C6C',
    fontSize: 12,
    textAlign: 'center',
  },
  ctaContainer: {
    marginTop: 20,
  },
  ctaButton: {
    backgroundColor: '#00FFEA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default Ab;