import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableHighlight,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import app from './firebaseConfig';

function SignUp(props) {
    const auth = getAuth(app);
    const [pressed, setPressed] = useState(false);
    const [DOB, setDOB] = useState('');
    const [pressed2, setPressed2] = useState(false);
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [username, setUsername] = useState('');
    const [phNo, setphNo] = useState('');
    const [loading, setLoading]= useState(false);//loading 
    const db = getFirestore(app);
    const navigator = useNavigation();

    const pattern = RegExp("\\w+@\\w+[.]\\w+");

    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.heading}>CryptX Wallet</Text>
                <Text style={styles.subheading}>Safe, Fast, and Ready for Every Transaction</Text>

                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#6C6C6C"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholderTextColor="#6C6C6C"
                    style={styles.input}
                />

                <TextInput
                    placeholder="PIN (4 digits)"
                    value={pin}
                    onChangeText={setPin}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry={true}
                    placeholderTextColor="#6C6C6C"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#6C6C6C"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Phone Number"
                    value={phNo}
                    onChangeText={setphNo}
                    placeholderTextColor="#6C6C6C"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                    placeholderTextColor="#6C6C6C"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Date of Birth"
                    value={DOB}
                    onChangeText={setDOB}
                    placeholderTextColor="#6C6C6C"
                    style={styles.input}
                />

                <TouchableHighlight
                    onPressIn={() => setPressed2(true)}
                    onPressOut={() => setPressed2(false)}
                    onPress={async () => {
                        if (pattern.test(email)) {
                            try {setLoading(true);
                                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                                const uid = userCredential.user.uid;

                                const userDoc = {
                                    uid: uid,
                                    name: username,
                                    email: email,
                                    password: password,
                                    pin: pin,
                                    phone: phNo,
                                    address: address,
                                    DOB: DOB,
                                };

                                const document = doc(db, "users", uid);
                                await setDoc(document, userDoc);
                                console.log("User created");
                                navigator.navigate('Login');
                                setLoading(false);
                            } catch (error) {
                                console.log(error);
                                setLoading(false);
                            }
                        } else {
                            alert("Invalid Email");
                        }
                    }}
                    style={pressed2 ? styles.buttonPressed : styles.button}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableHighlight>

                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>@version 2.0.6</Text>
                {
                     loading && (<ActivityIndicator size="large" color="#00FFEA" />)
                                }
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        color: '#00FFEA',
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        textShadowColor: '#00FFEA',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subheading: {
        color: '#6C6C6C',
        fontSize: 18,
        fontStyle: 'italic',
        fontFamily: 'Roboto',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#00FFEA',
        borderWidth: 2,
        borderRadius: 15,
        padding: 15,
        color: '#FFFFFF',
        fontSize: 16,
        backgroundColor: '#1A1A2E',
        marginTop: 20,
    },
    button: {
        marginTop: 30,
        backgroundColor: '#16213E',
        height: 50,
        width: '100%',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#00FFEA',
        borderWidth: 2,
    },
    buttonPressed: {
        backgroundColor: '#00FFEA',
    },
    buttonText: {
        color: '#00FFEA',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
    },
    forgotPassword: {
        color: '#6C6C6C',
        fontSize: 16,
        marginTop: 20,
        textDecorationLine: 'underline',
    },
    versionText: {
        color: '#6C6C6C',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default SignUp;