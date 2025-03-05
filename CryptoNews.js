import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const API_KEY = 'd6c02cef02b4415e8c48ca0aa4eed73b'; // Replace with your NewsAPI key
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=${API_KEY}`;

function CryptoNews() {
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch news from the API
  const fetchNews = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(NEWS_API_URL);
      const data = await response.json();
      if (data.articles) {
        setNews(data.articles);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      Alert.alert('Error', 'Failed to fetch news.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = () => {
    fetchNews();
  };

  // Open news article in browser
  const openArticle = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <LinearGradient
      colors={['#0A0A0A', '#1A1A2E', '#16213E']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator color="#00FFEA" size="large" />
        ) : news.length === 0 ? (
          <Text style={styles.noNewsText}>No news found.</Text>
        ) : (
          news.map((article, index) => (
            <TouchableOpacity
              key={index}
              style={styles.newsItem}
              onPress={() => openArticle(article.url)}
            >
              <Image
                source={{
                  uri: article.urlToImage || 'https://via.placeholder.com/150',
                }}
                style={styles.newsImage}
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{article.title}</Text>
                <Text style={styles.newsDescription}>
                  {article.description}
                </Text>
                <Text style={styles.newsSource}>{article.source.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  newsItem: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    color: '#00FFEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newsDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 10,
  },
  newsSource: {
    color: '#6C6C6C',
    fontSize: 12,
    fontStyle: 'italic',
  },
  noNewsText: {
    color: '#6C6C6C',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CryptoNews;