import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function PayToContact() {
    return (
        <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.container}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {[
                    "Subhendu Dhali",
                    "Rajdeep Pal",
                    "Rumpa Paul",
                    "Riya Pal",
                    "Rangan Nath",
                    "Subhadeep Pal",
                    "Rishav Dey",
                    "Saikat Adhikari",
                    "Virat Pathak",
                    "Suman Bera",
                    "Pratik Biswas",
                    "Rajesh Shaw",
                    "Rittik Pandey",
                    "Romit Nandi",
                    "Raman Tiwari",
                ].map((name, index) => (
                    <TouchableOpacity key={index} style={styles.contacts}>
                        <Image
                            source={require("./assets/icons/boy.png")}
                            style={styles.contactImage}
                        />
                        <View style={styles.contactInnerBox}>
                            <Text style={styles.contactName}>{name}</Text>
                            <Text style={styles.contactHint}>Touch to open this contact</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contacts: {
        width: '95%',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A2E',
        borderRadius: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#00FFEA', // Neon blue border
    },
    contactImage: {
        height: 50,
        width: 50,
        borderRadius: 25, // Circular image
    },
    contactInnerBox: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    contactName: {
        color: '#00FFEA', // Neon blue text
        fontSize: 16,
        fontWeight: 'bold',
    },
    contactHint: {
        color: '#6C6C6C', // Gray text for hint
        fontSize: 14,
    },
});

export default PayToContact;