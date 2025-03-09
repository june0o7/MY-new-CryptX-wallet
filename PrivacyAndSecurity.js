import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function PrivacyAndSecurity() {
    const [biometricAuth, setBiometricAuth] = useState(true);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);

    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Privacy & Security</Text>

                {/* Biometric Authentication */}
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Biometric Authentication</Text>
                    <Switch
                        value={biometricAuth}
                        onValueChange={setBiometricAuth}
                        trackColor={{ false: '#767577', true: '#00FFEA' }}
                        thumbColor={biometricAuth ? '#00FFEA' : '#f4f3f4'}
                    />
                </View>

                {/* Two-Factor Authentication */}
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Two-Factor Authentication</Text>
                    <Switch
                        value={twoFactorAuth}
                        onValueChange={setTwoFactorAuth}
                        trackColor={{ false: '#767577', true: '#00FFEA' }}
                        thumbColor={twoFactorAuth ? '#00FFEA' : '#f4f3f4'}
                    />
                </View>
            </ScrollView>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00FFEA',
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1A1A2E',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#00FFEA',
    },
    settingText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default PrivacyAndSecurity;