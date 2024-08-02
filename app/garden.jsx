import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useRoute } from '@react-navigation/native'

const Garden = () => {
  const route = useRoute();
  const { name } = route.params || { name: 'Guest' };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {name}!</Text>
      <StatusBar style="dark" />
    </View>
  )
}

export default Garden

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
    },
})