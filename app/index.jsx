import React from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather'; // Make sure to install this package
import { StatusBar } from 'expo-status-bar'
const FeaturedSection = ({ title, subtitle, color }) => (
  <View style={[styles.featuredSection, { backgroundColor: color }]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    <Image 
      source={require('../assets/images/icon.png')} 
      style={styles.featuredImage}
    />
   
  </View>
);

const HomePage = () => {
  const featuredSections = [
    { title: "Safe plants collection", subtitle: "Explore our beautiful collection of cat friendly plants & designer pots.", color: "#6C63FF" },
    { title: "Toxic plants guide", subtitle: "Learn about common toxic plants to keep your pets safe.", color: "#FF6C6C" },
    { title: "Plant care tips", subtitle: "Discover how to care for your indoor plants effectively.", color: "#63FF6C" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Explore</Text>
        
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#888" />
          <TextInput 
            placeholder="Search" 
            style={styles.searchInput}
          />
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={featuredSections}
          renderItem={({ item }) => <FeaturedSection {...item} />}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.featuredContainer}
        />

        <View style={styles.scanHistorySection}>
          <Text style={styles.sectionTitle}>Scan history</Text>
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={styles.activeTab}>
              <Text>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text>Safe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text>Unsafe</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.historyItem}>
            <Image 
              source={require('../assets/images/icon.png')} 
              style={styles.historyImage}
            />
            <View>
              <Text style={styles.plantName}>Ficus elastica</Text>
              <Text style={styles.plantStatus}>🐱 Cat unsafe</Text>
            </View>
          </View>
         
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
  featuredContainer: {
    paddingHorizontal: 10,
  },
  featuredSection: {
    width: 300,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionSubtitle: {
    color: '#fff',
    marginTop: 5,
  },
  featuredImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 15,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 5,
  },
  scanHistorySection: {
    margin: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  activeTab: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#6C63FF',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  historyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  plantName: {
    fontWeight: 'bold',
  },
  plantStatus: {
    color: '#888',
  },
});

export default HomePage;