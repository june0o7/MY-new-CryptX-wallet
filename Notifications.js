import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function Notifications() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Notifications</Text>

                {/* Enable Notifications */}
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Enable Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#767577', true: '#00FFEA' }}
                        thumbColor={notificationsEnabled ? '#00FFEA' : '#f4f3f4'}
                    />
                </View>

                {/* Email Notifications */}
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Email Notifications</Text>
                    <Switch
                        value={emailNotifications}
                        onValueChange={setEmailNotifications}
                        trackColor={{ false: '#767577', true: '#00FFEA' }}
                        thumbColor={emailNotifications ? '#00FFEA' : '#f4f3f4'}
                    />
                </View>

                {/* Sound */}
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Sound</Text>
                    <Switch
                        value={soundEnabled}
                        onValueChange={setSoundEnabled}
                        trackColor={{ false: '#767577', true: '#00FFEA' }}
                        thumbColor={soundEnabled ? '#00FFEA' : '#f4f3f4'}
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

export default Notifications;