import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator,TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import axios from 'axios';

const Garden = () => {
  const route = useRoute();
  const { name } = route.params || { name: 'Guest' };
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [process, setProcess] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/getreq', { name: name });
        const result = response.data;
        setRequirements(result.requirements);
        setProcess(result.process);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      console.log('Garden screen unmounted');
    };
  }, [name]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading plant information...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.header}>Welcome {name} in your Garden</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Requirements</Text>
        {requirements.map((req, index) => (
          <Text key={index} style={styles.requirementText}>• {req}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Planting Process</Text>
        {process.map((step, index) => (
          <View key={index} style={styles.processStep}>
            <Text style={styles.processTitle}>{index + 1}. {step.title}</Text>
            <Text style={styles.processDescription}>{step.description}</Text>
          </View>
        ))}
      </View>
      <Link href={{
          pathname: '/health',
          params: { name: name }
        }}>
        <TouchableOpacity 
        style={styles.addToGardenButton} 
        
      >
        <Ionicons name="medkit" size={24} color="white" />
        <Text style={styles.addToGardenText}>Check Health</Text>
      </TouchableOpacity>
      </Link>
    </ScrollView>
  );
};

export default Garden;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    lineHeight: 22,
  },
  processStep: {
    marginBottom: 15,
  },
  processTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 5,
  },
  processDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  addToGardenButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue', // A green color to represent plants/garden
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addToGardenText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});