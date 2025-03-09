import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import app from './firebaseConfig';

const auth = getAuth(app);

function Set() {
    const navigation = useNavigation();

    // Handle Sign Out
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Login'); // Navigate to the Login screen
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Failed to sign out. Please try again.');
        }
    };

    // Handle Lock App
    const handleLockApp = () => {
        // Implement your lock app logic here
        alert('App locked!');
    };

    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Personal Info */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('profile')}
                >
                    <Text style={styles.buttonText}>Personal Info</Text>
                </TouchableOpacity>

                {/* Notifications */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <Text style={styles.buttonText}>Notifications</Text>
                </TouchableOpacity>

                {/* Privacy and Security */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('PrivacyAndSecurity')}
                >
                    <Text style={styles.buttonText}>Privacy and Security</Text>
                </TouchableOpacity>

                {/* Help & Feedback */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('HelpAndFeedback')}
                >
                    <Text style={styles.buttonText}>Help & Feedback</Text>
                </TouchableOpacity>

                {/* Lock App */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLockApp}
                >
                    <Text style={styles.buttonText}>Lock App</Text>
                </TouchableOpacity>

                {/* Sign Out */}
                <TouchableOpacity
                    style={[styles.button, styles.signOutButton]}
                    onPress={handleSignOut}
                >
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#1A1A2E',
        padding: 20,
        borderRadius: 15,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: '#00FFEA',
        alignItems: 'center',
    },
    buttonText: {
        color: '#00FFEA',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: '#00FFEA',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    signOutButton: {
        borderColor: '#FF5733',
        backgroundColor: '#2A0A0A',
    },
});

export default Set;