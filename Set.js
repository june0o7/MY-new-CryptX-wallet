import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import app from './firebaseConfig';
import { MaterialIcons, Ionicons, Feather, FontAwesome } from '@expo/vector-icons';

const auth = getAuth(app);

const SettingsScreen = () => {
    const navigation = useNavigation();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    const handleLockApp = () => {
        // Implement biometric locking here
        Alert.alert('App Locked', 'Use your biometrics to unlock next time');
        navigation.navigate('LockScreen');
    };

    const settingsSections = [
        {
            title: 'Account',
            items: [
                {
                    icon: <Ionicons name="person-outline" size={24} color="#00FFEA" />,
                    label: 'Personal Information',
                    action: () => navigation.navigate('Profile'),
                },
                {
                    icon: <MaterialIcons name="security" size={24} color="#00FFEA" />,
                    label: 'Privacy & Security',
                    action: () => navigation.navigate('PrivacyAndSecurity'),
                },
            ],
        },
        {
            title: 'Preferences',
            items: [
                {
                    icon: <Ionicons name="notifications-outline" size={24} color="#00FFEA" />,
                    label: 'Notifications',
                    action: () => navigation.navigate('Notifications'),
                },
                {
                    icon: <Feather name="moon" size={24} color="#00FFEA" />,
                    label: 'Dark Mode',
                    action: () => console.log('Toggle dark mode'),
                    isToggle: true,
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    icon: <Ionicons name="help-circle-outline" size={24} color="#00FFEA" />,
                    label: 'Help & Feedback',
                    action: () => navigation.navigate('HelpAndFeedback'),
                },
                {
                    icon: <MaterialIcons name="lock-outline" size={24} color="#00FFEA" />,
                    label: 'Lock App',
                    action: handleLockApp,
                },
            ],
        },
    ];

    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.headerTitle}>Settings</Text>
                
                {settingsSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionContent}>
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={itemIndex}
                                    style={styles.settingItem}
                                    onPress={item.action}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.iconContainer}>
                                        {item.icon}
                                    </View>
                                    <Text style={styles.settingLabel}>{item.label}</Text>
                                    <View style={styles.arrowContainer}>
                                        {item.isToggle ? (
                                            <Ionicons name="toggle" size={24} color="#00FFEA" />
                                        ) : (
                                            <Ionicons name="chevron-forward" size={20} color="#6C6C6C" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                    activeOpacity={0.7}
                >
                    <FontAwesome name="sign-out" size={20} color="#FF5733" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 30,
        marginLeft: 10,
    },
    sectionContainer: {
        marginBottom: 25,
    },
    sectionTitle: {
        color: '#6C6C6C',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 15,
    },
    sectionContent: {
        backgroundColor: '#1A1A2E',
        borderRadius: 15,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#252540',
    },
    iconContainer: {
        width: 30,
        alignItems: 'center',
        marginRight: 15,
    },
    settingLabel: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    arrowContainer: {
        marginLeft: 10,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2A0A0A',
        padding: 16,
        borderRadius: 12,
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#FF5733',
    },
    signOutText: {
        color: '#FF5733',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    versionText: {
        color: '#6C6C6C',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 30,
    },
});

export default SettingsScreen;