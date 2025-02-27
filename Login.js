import { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
    const auth = getAuth();
    const [pressed, setPressed] = useState(false);
    const [pressed2, setPressed2] = useState(false);
    const [tcolor, setTcolor] = useState('#00FFEA');
    const [t2color, setT2color] = useState('#00FFEA');
    const navigator = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading]= useState(false);

    const [logInPressed, setLoginPressed]= useState(false);


    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.heading}>
                    CryptX Wallet
                </Text>
                <Text style={styles.heading2}>
                    For Seamless Crypto Transactions
                </Text>

                <TextInput
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#6C6C6C"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholderTextColor="#6C6C6C"
                    style={styles.input}
                />

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPressIn={() => { setPressed(true); setT2color('#0A0A0A'); }}
                    onPressOut={() => { setPressed(false); setT2color('#00FFEA'); }}
                    onPress={() => {
                        setLoading(true);
                        signInWithEmailAndPassword(auth, email, password)
                            .then(() => { navigator.navigate('Main'); 
                                setLoading(false);
                            })
                            .catch((error) => { alert("Invalid Credentials");
                                setLoading(false);
                             });
                    }}
                    style={[styles.button, pressed ? styles.buttonPressed : null]}
                >
                    <Text style={[styles.buttonText, { color: t2color }]}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPressIn={() => { setPressed2(true); console.log("pressed2: "+pressed2); setTcolor('#0A0A0A'); }}
                    onPressOut={() => { setPressed2(false); console.log("pressed "+ pressed2); setTcolor('#00FFEA'); }}
                    onPress={() => { navigator.navigate('SignUp'); }}
                    style={[styles.button, pressed2 ? styles.buttonPressed : null]}
                >
                    <Text style={[styles.buttonText, { color: tcolor }]}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                
                <View>
                    
                    <Text style={{color:"#6C6C6C"}}>
                        
                        Version   2.0.6
                        </Text>
                </View>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        alignItems: 'center',
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
    heading2: {
        color: '#6C6C6C',
        fontSize: 18,
        fontStyle: 'italic',
        fontFamily: 'Roboto',
        marginBottom: 40,
        marginTop: 10,
    },
    input: {
        width: '100%',
        height: 60,
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
});