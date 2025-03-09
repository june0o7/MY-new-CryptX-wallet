import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function HelpAndFeedback() {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (feedback.trim()) {
            alert('Thank you for your feedback!');
            setFeedback('');
        } else {
            alert('Please enter your feedback before submitting.');
        }
    };

    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Help & Feedback</Text>

                {/* Feedback Form */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter your feedback..."
                    placeholderTextColor="#6C6C6C"
                    multiline
                    value={feedback}
                    onChangeText={setFeedback}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </TouchableOpacity>

                {/* FAQ Section */}
                <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>How do I reset my password?</Text>
                    <Text style={styles.faqAnswer}>Go to Settings - Security - Reset Password.</Text>
                </View>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>How do I enable biometric authentication?</Text>
                    <Text style={styles.faqAnswer}>Go to Privacy & Security - Biometric Authentication.</Text>
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
    input: {
        backgroundColor: '#1A1A2E',
        borderRadius: 10,
        padding: 15,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#00FFEA',
        marginBottom: 20,
        minHeight: 100,
    },
    submitButton: {
        backgroundColor: '#00FFEA',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#0A0A0A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00FFEA',
        marginBottom: 10,
    },
    faqItem: {
        backgroundColor: '#1A1A2E',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#00FFEA',
    },
    faqQuestion: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    faqAnswer: {
        color: '#6C6C6C',
        fontSize: 14,
    },
});

export default HelpAndFeedback;