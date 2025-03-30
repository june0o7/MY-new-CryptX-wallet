import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hey there! How can I help with your crypto transactions today?',
      time: '10:30 AM',
      sender: 'other',
    },
    {
      id: '2',
      text: 'I need help transferring ETH to my wallet',
      time: '10:32 AM',
      sender: 'me',
    },
    {
      id: '3',
      text: 'Sure! Can you share the wallet address?',
      time: '10:33 AM',
      sender: 'other',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const inputScale = useRef(new Animated.Value(1)).current;

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    // Button press animation
    Animated.sequence([
      Animated.timing(inputScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(inputScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const newMsg = {
      id: Date.now().toString(),
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate reply after 1 second
    setTimeout(() => {
      const replyMsg = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for sharing. Your transaction will be processed shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'other',
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1000);
  };

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
          {
            opacity: 0,
            transform: [{ translateY: 20 }],
          },
        ]}
        entering={() => {
          return Animated.parallel([
            Animated.timing(new Animated.Value(0), {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(new Animated.Value(20), {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]);
        }}
      >
        {!isMe && (
          <Image
            source={require('./assets/chat-avatar.png')} // Add your avatar image
            style={styles.avatar}
          />
        )}
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isMe ? styles.myTime : styles.otherTime]}>
            {item.time}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#0A0A0A', '#1A1A2E', '#16213E']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#00FFEA" />
        </TouchableOpacity>
        <Image
          source={require('./assets/chat-avatar.png')} // Add your avatar image
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>CryptX Support</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <TouchableOpacity>
          <Feather name="more-vertical" size={20} color="#00FFEA" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachmentButton}>
          <MaterialIcons name="attach-file" size={24} color="#00FFEA" />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#6C6C6C"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <Animated.View style={{ transform: [{ scale: inputScale }] }}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={newMessage.trim() === ''}
          >
            <MaterialIcons
              name={newMessage.trim() === '' ? 'mic' : 'send'}
              size={24}
              color="#0A0A0A"
            />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#252540',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerStatus: {
    color: '#00FFEA',
    fontSize: 12,
  },
  messagesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: width * 0.7,
    padding: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#00FFEA',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#1A1A2E',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#252540',
  },
  messageText: {
    fontSize: 15,
  },
  myText: {
    color: '#0A0A0A',
  },
  otherText: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myTime: {
    color: '#0A0A0A',
  },
  otherTime: {
    color: '#6C6C6C',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#252540',
    backgroundColor: '#0A0A0A',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    color: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#252540',
  },
  attachmentButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#00FFEA',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;