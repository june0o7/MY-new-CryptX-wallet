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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';

const API_KEY = 'd6c02cef02b4415e8c48ca0aa4eed73b';
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&language=en&pageSize=20&apiKey=${API_KEY}`;

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await fetch(NEWS_API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch news');
      }
      
      if (data.articles && data.articles.length > 0) {
        setNews(data.articles.filter(article => article.title !== '[Removed]'));
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news. Please try again later.');
      Alert.alert('Error', err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = () => {
    fetchNews();
  };

  const openArticle = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', "Don't know how to open this URL");
      }
    }).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Failed to open the article');
    });
  };

  const renderNewsItem = (article, index) => (
    <TouchableOpacity
      key={`${article.publishedAt}-${index}`}
      style={styles.newsItem}
      onPress={() => openArticle(article.url)}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image',
          cache: 'force-cache'
        }}
        style={styles.newsImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.imageOverlay}
      />
      <View style={styles.newsContent}>
        <Text style={styles.newsSource}>
          {article.source.name} • {format(new Date(article.publishedAt), 'MMM d, yyyy')}
        </Text>
        <Text style={styles.newsTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <Text style={styles.newsDescription} numberOfLines={3}>
          {article.description || 'No description available'}
        </Text>
        <TouchableOpacity 
          onPress={() => openArticle(article.url)}
          style={styles.readMoreButton}
        >
          <Text style={styles.readMoreText}>Read Full Article</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00FFEA" />
          <Text style={styles.loadingText}>Fetching latest crypto news...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            onPress={fetchNews}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (news.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.noNewsText}>No cryptocurrency news found</Text>
          <TouchableOpacity 
            onPress={fetchNews}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.sectionTitle}>Latest Crypto News</Text>
        {news.map(renderNewsItem)}
      </>
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
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#00FFEA"
            colors={['#00FFEA']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  noNewsText: {
    color: '#6C6C6C',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  newsItem: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  newsDescription: {
    color: '#B8B8B8',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  newsSource: {
    color: '#00FFEA',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  readMoreText: {
    color: '#00FFEA',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#00FFEA',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#0A0A0A',
    fontWeight: 'bold',
  },
});

export default CryptoNews;