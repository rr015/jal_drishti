// src/components/SettingsModal.js
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { languageNames } from '../i18n/languages';

const SettingsModal = ({ visible, onClose, currentLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'en', name: languageNames.en },
    { code: 'hi', name: languageNames.hi },
    { code: 'bn', name: languageNames.bn },
    { code: 'te', name: languageNames.te },
    { code: 'mr', name: languageNames.mr },
    { code: 'ta', name: languageNames.ta },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>⚙️ Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Language Selection Section */}
            <Text style={styles.sectionTitle}>🌐 Language / भाषा / ভাষা</Text>
            
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  currentLanguage === lang.code && styles.languageOptionActive
                ]}
                onPress={() => {
                  onLanguageChange(lang.code);
                }}
              >
                <Text style={[
                  styles.languageText,
                  currentLanguage === lang.code && styles.languageTextActive
                ]}>
                  {lang.name}
                </Text>
                {currentLanguage === lang.code && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            {/* Divider */}
            <View style={styles.divider} />

            {/* About Section */}
            <Text style={styles.sectionTitle}>ℹ️ About / के बारे में</Text>
            
            <View style={styles.aboutContainer}>
              <Text style={styles.appName}>Jal Drishti</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                Jal Drishti is an AI-powered fish species identification app that helps users identify different fish species using image recognition technology. Simply take a photo or upload an image from your gallery, and the app will identify the fish species along with detailed information about it.
              </Text>
              
              <Text style={styles.appDescriptionHindi}>
                जल दृष्टि एक एआई-संचालित मछली प्रजाति पहचान ऐप है जो उपयोगकर्ताओं को छवि पहचान तकनीक का उपयोग करके विभिन्न मछली प्रजातियों की पहचान करने में मदद करता है। बस एक फोटो लें या अपनी गैलरी से एक छवि अपलोड करें, और ऐप मछली की प्रजाति और उसके बारे में विस्तृत जानकारी पहचान लेगा।
              </Text>
              
              <Text style={styles.sectionSubtitle}>👨‍💻 Developers</Text>
              <View style={styles.developersList}>
                <View style={styles.developerCard}>
                  <Text style={styles.developerIcon}>👨‍💻</Text>
                  <Text style={styles.developerName}>Rachif</Text>
                </View>
                <View style={styles.developerCard}>
                  <Text style={styles.developerIcon}>👨‍💻</Text>
                  <Text style={styles.developerName}>Tridip</Text>
                </View>
                <View style={styles.developerCard}>
                  <Text style={styles.developerIcon}>👨‍💻</Text>
                  <Text style={styles.developerName}>Rajat</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalButtonText}>Close / बंद करें</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2E7D32',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 16,
    marginBottom: 10,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  languageOptionActive: {
    backgroundColor: '#E8F5E9',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  languageTextActive: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  checkMark: {
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  aboutContainer: {
    padding: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  appDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  appDescriptionHindi: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  developersList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  developerCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  developerIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  developerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  closeModalButton: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  closeModalButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default SettingsModal;