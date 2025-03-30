import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import app from './firebaseConfig';

const SignUpScreen = () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const navigation = useNavigation();
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        pin: '',
        phone: '',
        address: '',
        dob: ''
    });
    const [loading, setLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [errors, setErrors] = useState({});

    // Input focus state
    const [focusedField, setFocusedField] = useState(null);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Username is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.pin) {
            newErrors.pin = 'PIN is required';
        } else if (formData.pin.length !== 4 || !/^\d+$/.test(formData.pin)) {
            newErrors.pin = 'PIN must be 4 digits';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\d\s+()-]{10,15}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.dob.trim()) newErrors.dob = 'Date of birth is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                formData.email, 
                formData.password
            );
            
            // Store additional user data in Firestore
            const userDoc = {
                uid: userCredential.user.uid,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                dob: formData.dob,
                pin: formData.pin, // Note: In production, never store PINs in plain text
                createdAt: new Date().toISOString(),
            };

            await setDoc(doc(db, "users", userCredential.user.uid), userDoc);
            
            Alert.alert(
                'Account Created', 
                'Your account has been successfully created!',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'An error occurred during sign up. Please try again.';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already in use.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
            }
            
            Alert.alert('Sign Up Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join CryptX Wallet for secure transactions</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Username */}
                        <View style={[
                            styles.inputContainer, 
                            focusedField === 'name' && styles.inputFocused,
                            errors.name && styles.inputError
                        ]}>
                            <MaterialIcons 
                                name="person-outline" 
                                size={20} 
                                color={focusedField === 'name' ? '#00FFEA' : '#6C6C6C'} 
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="name"
                                textContentType="oneTimeCode"  // Prevents autofill suggestions
                                importantForAutofill="no" // Android: Disables autofill
                                autoComplete="off" // Android & iOS: Prevents autofill
                                disableFullscreenUI={true}
                                placeholderTextColor="#6C6C6C"
                                value={formData.username}
                                onChangeText={(text) => handleInputChange('name', text)}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                        {/* Email */}
                        <View style={[
                            styles.inputContainer, 
                            focusedField === 'email' && styles.inputFocused,
                            errors.email && styles.inputError
                        ]}>
                            <MaterialIcons 
                                name="email" 
                                size={20} 
                                color={focusedField === 'email' ? '#00FFEA' : '#6C6C6C'} 
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#6C6C6C"
                                value={formData.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        {/* Password */}
                        <View style={[
                            styles.inputContainer, 
                            focusedField === 'password' && styles.inputFocused,
                            errors.password && styles.inputError
                        ]}>
                            <MaterialIcons 
                                name="lock-outline" 
                                size={20} 
                                color={focusedField === 'password' ? '#00FFEA' : '#6C6C6C'} 
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password (min 6 characters)"
                                placeholderTextColor="#6C6C6C"
                                value={formData.password}
                                onChangeText={(text) => handleInputChange('password', text)}
                                secureTextEntry={secureTextEntry}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                            />
                            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                                <MaterialIcons 
                                    name={secureTextEntry ? 'visibility-off' : 'visibility'} 
                                    size={20} 
                                    color="#6C6C6C" 
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        {/* PIN */}
                        <View style={[
                            styles.inputContainer, 
                            focusedField === 'pin' && styles.inputFocused,
                            errors.pin && styles.inputError
                        ]}>
                            <MaterialIcons 
                                name="lock" 
                                size={20} 
                                color={focusedField === 'pin' ? '#00FFEA' : '#6C6C6C'} 
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="4-digit PIN"
                                placeholderTextColor="#6C6C6C"
                                value={formData.pin}
                                onChangeText={(text) => handleInputChange('pin', text)}
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry={true}
                                onFocus={() => setFocusedField('pin')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                        {errors.pin && <Text style={styles.errorText}>{errors.pin}</Text>}

                        {/* Phone */}
                        <View style={[
                            styles.inputContainer, 
                            focusedField === 'phone' && styles.inputFocused,
                            errors.phone && styles.inputError
                        ]}>
                            <MaterialIcons 
                                name="phone" 
                                size={20} 
                                color={focusedField === 'phone' ? '#00FFEA' : '#6C6C6C'} 
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor="#6C6C6C"
                                value={formData.phone}
                                onChangeText={(text) => handleInputChange('phone', text)}
                                keyboardType="phone-pad"
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                        {/* Address */}
                        <View style={[
                            styles.inputContainer, 
                            focusedField === 'address' && styles.inputFocused
                        ]}>
                            <MaterialIcons 
                                name="home" 
                                size={20} 
                                color={focusedField === 'address' ? '#00FFEA' : '#6C6C6C'} 
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Address (Optional)"
                                placeholderTextColor="#6C6C6C"
                                value={formData.address}
                                onChangeText={(text) => handleInputChange('address', text)}
                                onFocus={() => setFocusedField('address')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Date of Birth */}
                        <View style={[
                            styles.inputContainer, 
                            focusedField === 'dob' && styles.inputFocused,
                            errors.dob && styles.inputError
                        ]}>
                            <MaterialIcons 
                                name="cake" 
                                size={20} 
                                color={focusedField === 'dob' ? '#00FFEA' : '#6C6C6C'} 
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Date of Birth (MM/DD/YYYY)"
                                placeholderTextColor="#6C6C6C"
                                value={formData.dob}
                                onChangeText={(text) => handleInputChange('dob', text)}
                                onFocus={() => setFocusedField('dob')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                        {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#0A0A0A" />
                            ) : (
                                <Text style={styles.buttonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        {/* Already have an account */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.versionText}>CryptX Wallet v2.0.6</Text>
                        <Text style={styles.copyright}>© {new Date().getFullYear()} CryptX Inc.</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    header: {
        marginTop: 40,
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        color: '#00FFEA',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#6C6C6C',
        fontSize: 16,
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A2E',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#252540',
        marginTop: 16,
    },
    inputFocused: {
        borderColor: '#00FFEA',
    },
    inputError: {
        borderColor: '#FF5733',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 12,
        marginRight: 8,
        paddingVertical: 0,
    },
    errorText: {
        color: '#FF5733',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 8,
    },
    button: {
        backgroundColor: '#00FFEA',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#0A0A0A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        color: '#6C6C6C',
        fontSize: 14,
    },
    loginLink: {
        color: '#00FFEA',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
    },
    versionText: {
        color: '#6C6C6C',
        fontSize: 12,
    },
    copyright: {
        color: '#6C6C6C',
        fontSize: 12,
        marginTop: 4,
    },
});

export default SignUpScreen;