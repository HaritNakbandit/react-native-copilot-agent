import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../utils/constants';

const ThemeScreen: React.FC = () => {
  const { state } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState(
    state.user?.settings?.theme || 'light'
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    state.user?.settings?.language || 'en'
  );

  const themes = [
    { key: 'light' as const, name: 'Light', description: 'Default light theme' },
    { key: 'dark' as const, name: 'Dark', description: 'Dark theme for low-light environments' },
  ];

  const languages = [
    { key: 'en', name: 'English', nativeName: 'English' },
    { key: 'es', name: 'Spanish', nativeName: 'Español' },
    { key: 'fr', name: 'French', nativeName: 'Français' },
    { key: 'de', name: 'German', nativeName: 'Deutsch' },
    { key: 'zh', name: 'Chinese', nativeName: '中文' },
  ];

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setSelectedTheme(theme);
    // In a real app, you would save this setting and apply the theme
    Alert.alert('Theme Changed', `Theme set to ${theme}`);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const languageName = languages.find(l => l.key === language)?.name || language;
    Alert.alert('Language Changed', `Language set to ${languageName}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <Text style={styles.sectionDescription}>
          Choose your preferred app appearance
        </Text>
        
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.key}
            style={[
              styles.optionItem,
              selectedTheme === theme.key && styles.selectedOption
            ]}
            onPress={() => handleThemeChange(theme.key)}
          >
            <View style={styles.optionContent}>
              <Text style={[
                styles.optionTitle,
                selectedTheme === theme.key && styles.selectedText
              ]}>
                {theme.name}
              </Text>
              <Text style={[
                styles.optionDescription,
                selectedTheme === theme.key && styles.selectedDescription
              ]}>
                {theme.description}
              </Text>
            </View>
            {selectedTheme === theme.key && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <Text style={styles.sectionDescription}>
          Select your preferred language
        </Text>
        
        {languages.map((language) => (
          <TouchableOpacity
            key={language.key}
            style={[
              styles.optionItem,
              selectedLanguage === language.key && styles.selectedOption
            ]}
            onPress={() => handleLanguageChange(language.key)}
          >
            <View style={styles.optionContent}>
              <Text style={[
                styles.optionTitle,
                selectedLanguage === language.key && styles.selectedText
              ]}>
                {language.name}
              </Text>
              <Text style={[
                styles.optionDescription,
                selectedLanguage === language.key && styles.selectedDescription
              ]}>
                {language.nativeName}
              </Text>
            </View>
            {selectedLanguage === language.key && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Font Size</Text>
          <Text style={styles.infoValue}>System Default</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Currency Format</Text>
          <Text style={styles.infoValue}>USD ($)</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date Format</Text>
          <Text style={styles.infoValue}>MM/DD/YYYY</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.aboutText}>
          Changes to theme and language will take effect immediately. 
          Some features may require app restart to fully apply.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    backgroundColor: COLORS.surface,
    margin: 15,
    padding: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedText: {
    color: COLORS.primary,
  },
  selectedDescription: {
    color: COLORS.primary + 'aa',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default ThemeScreen;
