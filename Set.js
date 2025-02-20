import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Login from './Login';
import { Component } from 'react';

function Set(props) {
    const handlePress = (section) => {
        // Add your navigation/handling logic here
        console.log(`Pressed: ${section}`);
        // Component={Login};
    };

    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.container}
        >
            <View style={styles.content}>
                <TouchableOpacity style={styles.button} onPress={() => handlePress('Personal Info')}>
                    <Text style={styles.buttonText}>Personal Info</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePress('Notifications')}>
                    <Text style={styles.buttonText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePress('Privacy and Security')}>
                    <Text style={styles.buttonText}>Privacy and Security</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePress('Help & Feedback')}>
                    <Text style={styles.buttonText}>Help & Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePress('Lock App')}>
                    <Text style={styles.buttonText}>Lock App</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={() => handlePress('Login')}>
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
        // fontWeight: 'bold',
        // color: '#00FFEA', // Neon blue text
        textShadowColor: '#00FFEA', // Neon glow effect
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    signOutButton: {
        borderColor: '#FF5733', // Orange border for Sign Out button
        backgroundColor: '#2A0A0A', // Darker background for Sign Out button
    },
});

export default Set;