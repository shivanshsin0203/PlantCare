import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { State } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'


const profile = () => {
  return (
    <View style={styles.container}>
      <Text>profile</Text>
      <StatusBar style="auto" />
    </View>
  )
}

export default profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
})