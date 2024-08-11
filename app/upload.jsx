import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

import * as Font from 'expo-font';
import { Link } from 'expo-router';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Inside your component

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plantData, setPlantData] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Pacifico': require('../assets/fonts/Head.ttf'),
      'Roboto': require('../assets/fonts/Detail.ttf'),
    });
    setFontsLoaded(true);
  };

  const addToGarden = async() => {
    await axios.post('https://plantcare-backend.onrender.com/plant', { name: plantData.name })

  };
  const handleAddToGarden = () => {
    console.log('Navigating to garden');
    addToGarden();
    router.push({
      pathname: '/garden',
      params: { name: plantData.name }
    });
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
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.base64;
      setCapturedImage(data.uri);
      setIsAnalyzing(true);

      if (source) {
        let base64Img = `data:image/jpg;base64,${source}`;
        let apiUrl = 'https://api.cloudinary.com/v1_1/drnq1u9cx/image/upload';
        let uploadData = {
          file: base64Img,
          upload_preset: 'ml_default',
        };

        fetch(apiUrl, {
          body: JSON.stringify(uploadData),
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
        })
          .then(async response => {
            let data = await response.json();
            if (data.secure_url) {
              const plantData = await axios.post('https://plantcare-backend.onrender.com/upload', { imageURL: data.secure_url });
              console.log('Plant data:', plantData.data);
              setPlantData(plantData.data);
              setIsAnalyzing(false);
            }
          })
          .catch(err => {
            alert('Cannot upload');
            setIsAnalyzing(false);
          });
      }
    }
  }

  if (capturedImage && !plantData) {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <Text style={styles.analyzingText}>Analyzing Your photo</Text>
        </View>
        {isAnalyzing && (
          <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
        )}
      </View>
    );
  }

  if (capturedImage && plantData) {
    return (
      <View style={styles.infoContainer}>
        <ScrollView>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <Text style={styles.plantName}>
            {plantData.name}
          </Text>
          <Text style={styles.plantDetails}>
            {plantData.details}
          </Text>
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.addToGardenButton} 
          onPress={handleAddToGarden}
        >
          <Ionicons name="leaf" size={24} color="green" />
          <Text style={styles.addToGardenText}>Add to Garden</Text>
        </TouchableOpacity>
        
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.camera}>
        <CameraView 
          style={StyleSheet.absoluteFill}
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.captureButton}>
              <TouchableOpacity onPress={takePicture}>
                <Ionicons name="camera" size={36} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
      <StatusBar style="dark" />
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
  addToGardenButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
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
