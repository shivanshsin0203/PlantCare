import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import axios from 'axios';

const FeaturedSection = ({ title, subtitle, color, source }) => (
  <View style={[styles.featuredSection, { backgroundColor: color }]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    <Image 
      source={source} 
      style={styles.featuredImage}
    />
  </View>
);

const HomePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await axios.post('https://plantcare-backend.onrender.com/getplant');
      setPlants(response.data);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  const navigateToGarden = (name) => {
    console.log('Navigating to garden');
    
    router.push({
      pathname: '/garden',
      params: { name: name }
    });
  };

  const featuredSections = [
    { title: "Check which plant", subtitle: "Explore our beautiful collection of plants just by a pic.", color: "#6C63FF", source: require('../assets/images/one.jpg') },
    { title: "Add to your Garden", subtitle: "Learn important requirements to grow a plant", color: "#FF6C6C", source: require('../assets/images/two.jpg') },
    { title: "Health check up", subtitle: "Check health of your plant in garden and see its cure", color: "#63FF6C", source: require('../assets/images/three.jpg')  },
  ];

  const filteredPlants = plants.filter(plant => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Healthy') return plant.health;
    if (activeTab === 'Unhealthy') return !plant.health;
    return false;
  });

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
            {['All', 'Healthy', 'Unhealthy'].map(tab => (
              <TouchableOpacity 
                key={tab}
                style={tab === activeTab ? styles.activeTab : styles.tab}
                onPress={() => setActiveTab(tab)}
              >
                <Text>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {filteredPlants.map((plant, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.historyItem}
              onPress={() => navigateToGarden(plant.name)}  // Updated this line
            >
              <Image 
                source={require('../assets/images/plant2.jpg')} 
                style={styles.historyImage}
              />
              <View>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={[
                  styles.plantStatus,
                  { color: plant.health ? 'green' : 'red' }
                ]}>
                  {plant.health ? '🌿 Healthy' : '🚫 Unhealthy'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
    marginTop: 5,
  },
});

export default HomePage;
