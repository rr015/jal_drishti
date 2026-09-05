// src/components/MenuButton.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';

const MenuButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Text style={styles.menuIcon}>☰</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MenuButton;