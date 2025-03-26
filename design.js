import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import * as LocalAuthentication from 'expo-local-authentication';
import app from './firebaseConfig';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const auth = getAuth(app);
const db = getFirestore(app);

function SecuritySettings({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if biometric auth is available and enrolled
  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometric(compatible && enrolled);
  };

  // Verify account with password
  const verifyAccount = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return false;
    }
  
    setIsVerifying(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        Alert.alert('Error', 'User not found. Please log in again.');
        setIsVerifying(false);
        return false;
      }
  
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      setIsVerifying(false);
      Alert.alert('Success', 'Account verified successfully');
      return true;
    } catch (error) {
      setIsVerifying(false);
      console.log('Reauthentication error:', error.message);
      Alert.alert('Error', 'Incorrect password. Please try again.');
      return false;
    }
  };
  

  // Change PIN
  const handleChangePin = async () => {
    if (newPin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    const verified = await verifyAccount();
    if (!verified) return;

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { pin: newPin });
      Alert.alert('Success', 'PIN changed successfully');
      setShowPinModal(false);
      setNewPin('');
      setConfirmPin('');
      setCurrentPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update PIN');
    }
  };

  // Setup biometric authentication
  const setupBiometricAuth = async () => {
    setIsProcessing(true);
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
        fallbackLabel: 'Use Password Instead'
      });

      if (success) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { 
          biometricEnabled: true,
          biometricType: await LocalAuthentication.supportedAuthenticationTypesAsync() 
        });
        Alert.alert('Success', 'Biometric authentication enabled');
        setHasBiometric(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to enable biometric authentication');
    } finally {
      setIsProcessing(false);
      setShowBiometricModal(false);
    }
  };

  useEffect(() => {
    checkBiometrics();
  }, []);

  return (
    <LinearGradient colors={['#0A0A0A', '#1A1A2E', '#16213E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Change PIN Section */}
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setShowPinModal(true)}
        >
          <Icon name="lock" size={24} color="#00FFEA" />
          <Text style={styles.settingText}>Change PIN</Text>
          <Icon name="angle-right" size={24} color="#6C6C6C" />
        </TouchableOpacity>

        {/* Biometric Authentication Section */}
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => hasBiometric ? 
            Alert.alert('Biometric Enabled', 'You can use your fingerprint or face ID to login') : 
            setShowBiometricModal(true)}
        >
          <MaterialIcons name="fingerprint" size={24} color={hasBiometric ? "#00FFEA" : "#6C6C6C"} />
          <Text style={[styles.settingText, hasBiometric && { color: '#00FFEA' }]}>
            {hasBiometric ? 'Biometric Enabled' : 'Setup Biometric Authentication'}
          </Text>
          {hasBiometric ? (
            <Icon name="check-circle" size={18} color="#00FFEA" />
          ) : (
            <Icon name="angle-right" size={24} color="#6C6C6C" />
          )}
        </TouchableOpacity>

        {/* Account Verification Section */}
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={verifyAccount}
        >
          <Icon name="shield" size={24} color="#00FFEA" />
          <Text style={styles.settingText}>Verify Account</Text>
          <Icon name="angle-right" size={24} color="#6C6C6C" />
        </TouchableOpacity>
      </ScrollView>

      {/* Change PIN Modal */}
      <Modal
        visible={showPinModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change PIN</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor="#6C6C6C"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            
            <TextInput
              style={styles.input}
              placeholder="New PIN (4+ digits)"
              placeholderTextColor="#6C6C6C"
              keyboardType="numeric"
              secureTextEntry
              value={newPin}
              onChangeText={setNewPin}
              maxLength={6}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirm New PIN"
              placeholderTextColor="#6C6C6C"
              keyboardType="numeric"
              secureTextEntry
              value={confirmPin}
              onChangeText={setConfirmPin}
              maxLength={6}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPinModal(false);
                  setCurrentPassword('');
                  setNewPin('');
                  setConfirmPin('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleChangePin}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <ActivityIndicator color="#0A0A0A" />
                ) : (
                  <Text style={styles.buttonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* Biometric Setup Modal */}
      <Modal
        visible={showBiometricModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBiometricModal(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.modalContent}>
            <MaterialIcons name="fingerprint" size={60} color="#00FFEA" style={styles.biometricIcon} />
            <Text style={styles.modalTitle}>Enable Biometric Authentication</Text>
            <Text style={styles.modalText}>
              Use your fingerprint or face ID for faster, more secure access to your account.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowBiometricModal(false)}
              >
                <Text style={styles.buttonText}>Not Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={setupBiometricAuth}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#0A0A0A" />
                ) : (
                  <Text style={styles.buttonText}>Enable</Text>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00FFEA',
  },
  settingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00FFEA',
  },
  modalTitle: {
    color: '#00FFEA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00FFEA',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#2A0A0A',
    borderWidth: 1,
    borderColor: '#FF5733',
  },
  confirmButton: {
    backgroundColor: '#00FFEA',
  },
  buttonText: {
    color: '#0A0A0A',
    fontWeight: 'bold',
  },
  biometricIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default SecuritySettings;