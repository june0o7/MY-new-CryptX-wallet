import { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  Animated,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native';
import React from 'react';
// import { useFonts } from 'react-native-vector-icons/Fontello';

export default function LoginScreen() {
    const auth = getAuth();
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [isFocused, setIsFocused] = useState({
        email: false,
        password: false
    });

    // Animation refs and values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const lottieRef = useRef(null);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Button press animation
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Play success animation
            lottieRef.current?.play();
            setTimeout(() => navigation.navigate('Main'), 1500);
        } catch (error) {
            let errorMessage = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage = 'Invalid email or password';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Try again later';
                    break;
            }
            
            Alert.alert('Login Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFocus = (field) => {
        setIsFocused(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field) => {
        setIsFocused(prev => ({ ...prev, [field]: false }));
    };

    // Start animations when component mounts
    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true
            }),
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.back(1)),
                useNativeDriver: true
            })
        ]).start();
    }, []);

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
                    {/* Ethereum Animation */}
                    <View style={styles.animationContainer}>
                        <LottieView
                            ref={lottieRef}
                            source={require('./assets/animations/ETH.json')} // Add your Ethereum animation JSON file
                            autoPlay={true}
                            loop={true}
                            style={styles.animation}
                            resizeMode="cover"
                        />
                    </View>

                    <Animated.View 
                        style={[
                            styles.header,
                            { 
                                opacity: fadeAnim,
                                transform: [{ translateY: slideUpAnim }] 
                            }
                        ]}
                    >
                        <Text style={styles.title}>CryptX Wallet</Text>
                        <Text style={styles.subtitle}>Secure Crypto Management</Text>
                    </Animated.View>

                    <Animated.View 
                        style={[
                            styles.formContainer,
                            { 
                                opacity: fadeAnim,
                                transform: [{ translateY: slideUpAnim }] 
                            }
                        ]}
                    >
                        <View style={[styles.inputContainer, isFocused.email && styles.inputFocused]}>
                            <MaterialIcons name="email" size={20} color={isFocused.email ? '#00FFEA' : '#6C6C6C'} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#6C6C6C"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                disableFullscreenUI={true}
                                onFocus={() => handleFocus('email')}
                                onBlur={() => handleBlur('email')}
                            />
                        </View>

                        <View style={[styles.inputContainer, isFocused.password && styles.inputFocused]}>
                            <MaterialIcons name="lock" size={20} color={isFocused.password ? '#00FFEA' : '#6C6C6C'} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#6C6C6C"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={secureTextEntry}
                                onFocus={() => handleFocus('password')}
                                onBlur={() => handleBlur('password')}
                            />
                            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                                <MaterialIcons 
                                    name={secureTextEntry ? 'visibility-off' : 'visibility'} 
                                    size={20} 
                                    color="#6C6C6C" 
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.forgotPasswordButton}
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.7}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#0A0A0A" />
                                ) : (
                                    <Text style={styles.buttonText}>Login</Text>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.navigate('SignUp')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.secondaryButtonText}>Create New Account</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View 
                        style={[
                            styles.footer,
                            { 
                                opacity: fadeAnim,
                                transform: [{ translateY: slideUpAnim }] 
                            }
                        ]}
                    >
                        <Text style={styles.versionText}>Version 2.0.6</Text>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    animationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        marginBottom: 20,
    },
    animation: {
        width: 150,
        height: 150,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        color: '#00FFEA',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#6C6C6C',
        fontSize: 16,
    },
    formContainer: {
        width: '100%',
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
        marginBottom: 16,
    },
    inputFocused: {
        borderColor: '#00FFEA',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 12,
        paddingVertical: 0,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#6C6C6C',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: '#00FFEA',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#0A0A0A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#252540',
    },
    dividerText: {
        color: '#6C6C6C',
        fontSize: 14,
        marginHorizontal: 12,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#00FFEA',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: '#00FFEA',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    versionText: {
        color: '#6C6C6C',
        fontSize: 12,
    },
});