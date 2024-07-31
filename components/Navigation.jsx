import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const Navigation = () => {
  const [isActive, setIsActive] = React.useState('home');

  return (
    
      <View style={styles.bottomNav}>
        <Link href="/" onPress={() => setIsActive('home')}>
          <Icon name="home" size={24} color={isActive === 'home' ? '#6C63FF' : '#888'} />
        </Link>
        <Link href="/upload" onPress={() => setIsActive('upload')}>
          <Icon name="camera" size={24} color={isActive === 'upload' ? '#6C63FF' : '#888'} />
        </Link>
        <Link href="/profile" onPress={() => setIsActive('profile')}>
          <Icon name="user" size={24} color={isActive === 'profile' ? '#6C63FF' : '#888'} />
        </Link>
        
      </View>
    
  );
};

export default Navigation;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 60,
  },
});