import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ActivityIndicator, Animated } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

import * as Font from 'expo-font';
import { Link } from 'expo-router';
import axios from 'axios';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plantData, setPlantData] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const cameraRef = useRef(null);
  
  // Animation values
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const captureButtonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    loadFonts();
  }, []);

  useEffect(() => {
    if (capturedImage) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [capturedImage]);

  useEffect(() => {
    if (capturedImage && plantData) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [capturedImage, plantData]);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Pacifico': require('../assets/fonts/Head.ttf'),
      'Roboto': require('../assets/fonts/Detail.ttf'),
    });
    setFontsLoaded(true);
  };
  const addToGarden = () => {
    const send=axios.post('http://localhost:3000/plant', { name: plantData.name });
    console.log('Adding to garden');
   
  };
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    Animated.timing(flipAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setFacing(current => (current === 'back' ? 'front' : 'back'));
      flipAnimation.setValue(0);
    });
  }

  async function takePicture() {
    Animated.sequence([
      Animated.timing(captureButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(captureButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setIsAnalyzing(true);
      sendToBackend(photo.uri);
    }
  }

  async function sendToBackend(uri) {
    console.log('Sending photo to backend:', uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpeg');
    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
      setPlantData(result);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error sending photo to backend:', error);
      setIsAnalyzing(false);
    }
  }

  if (capturedImage && !plantData) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <Text style={styles.analyzingText}>Analyzing Your photo</Text>
        </View>
        {isAnalyzing && (
          <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
        )}
      </Animated.View>
    );
  }

  if (capturedImage && plantData) {
    return (
      <Animated.View 
        style={[
          styles.infoContainer, 
          { 
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ] 
          }
        ]}
      >
        <ScrollView>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <Animated.Text 
            style={[
              styles.plantName,
              {
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            {plantData.name}
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.plantDetails,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {plantData.details}
          </Animated.Text>
        </ScrollView>
        <Link href={{
          pathname: '/garden',
          params: { name: plantData.name }
        }}>
        <TouchableOpacity 
        style={styles.addToGardenButton} 
        onPress={addToGarden}
      >
        <Ionicons name="leaf" size={24} color="green" />
        <Text style={styles.addToGardenText}>Add to Garden</Text>
      </TouchableOpacity>
      </Link>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.camera,
        {
          transform: [
            {
              rotateY: flipAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            },
          ],
        },
      ]}>
        <CameraView 
          style={StyleSheet.absoluteFill}
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
            <Animated.View style={[
              styles.captureButton,
              {
                transform: [{ scale: captureButtonScale }],
              },
            ]}>
              <TouchableOpacity onPress={takePicture}>
                <Ionicons name="camera" size={36} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </CameraView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    backgroundColor: 'white',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  flipButton: {
    position: 'absolute',
    left: 30,
    bottom: 10,
    padding: 10,
  },

  addToGardenButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50', // A green color to represent plants/garden
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
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  preview: {
    width: 300,
    height: 400,
    borderRadius: 20,
  },
  previewImage: {
    width: '100%',
    height: 400,
    borderRadius: 20,
    marginBottom: 20,
  },
  analyzingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  loader: {
    marginTop: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  plantName: {
    fontFamily: 'Pacifico',
    fontSize: 38,
    fontWeight: '800',
    marginBottom: 18,
    marginTop: 18,
    textAlign: 'center',
    color: '#2c3e50',
  },
  plantDetails: {
    fontFamily: 'Roboto',
    fontSize: 18,
    lineHeight: 30,
    color: '#34495e',
  },
});