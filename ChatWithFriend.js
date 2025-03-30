import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ChatWithFriend = ({ route, navigation }) => {
  const { user } = route.params;
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey there!', time: '10:30 AM', sent: false },
    { id: 2, text: 'Hi! How are you?', time: '10:31 AM', sent: true },
    { id: 3, text: 'I was just about to send you some ETH', time: '10:32 AM', sent: false },
    { id: 4, text: 'Oh great! Thanks!', time: '10:33 AM', sent: true },
    { id: 5, text: 'Just sent you 0.5 ETH', time: '10:35 AM', sent: false },
    { id: 6, text: 'Received it! Youre the best!', time: '10:36 AM', sent: true },
  ]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef();

  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const replyMessage = {
        id: messages.length + 2,
        text: 'Thanks for your message!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sent: false
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sent ? styles.sentMessage : styles.receivedMessage]}>
      <View style={[styles.messageBubble, item.sent ? styles.sentBubble : styles.receivedBubble]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#0F0F2D", "#1A1A2E"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
              style={styles.userImage}
            />
            <View style={styles.userText}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userStatus}>online</Text>
            </View>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="video" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="call" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="ellipsis-v" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Chat Messages */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
          keyboardVerticalOffset={90}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
          />
          
          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Feather name="paperclip" size={24} color="#6C6C6C" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              placeholder="Type a message"
              placeholderTextColor="#6C6C6C"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            
            <TouchableOpacity style={styles.emojiButton}>
              <Feather name="smile" size={24} color="#6C6C6C" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSend}
              disabled={message.trim() === ''}
            >
              {message.trim() === '' ? (
                <Feather name="mic" size={24} color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userText: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userStatus: {
    color: '#00FFEA',
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  sentMessage: {
    alignItems: 'flex-end',
  },
  receivedMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: '#202C33',
    borderTopRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
  },
  sentMessageText: {
    color: '#0A0A0A',
  },
  messageTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentMessageTime: {
    color: 'rgba(10, 10, 10, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
  },
  attachmentButton: {
    padding: 8,
  },
  emojiButton: {
    padding: 8,
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 15,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00FFEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ChatWithFriend;