import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { SettingsStackParamList } from '../../types/navigation';
import { COLORS } from '../../utils/constants';

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsHome'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { state, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const settingsOptions = [
    {
      title: 'Profile Settings',
      subtitle: 'Manage your personal information',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      title: 'Security',
      subtitle: 'Password and biometric settings',
      onPress: () => navigation.navigate('Security'),
    },
    {
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      title: 'Theme',
      subtitle: 'Appearance and display settings',
      onPress: () => navigation.navigate('Theme'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{state.user?.fullName}</Text>
          <Text style={styles.userEmail}>{state.user?.email}</Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={option.onPress}
          >
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.versionSection}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  userSection: {
    backgroundColor: COLORS.surface,
    padding: 20,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  settingsSection: {
    backgroundColor: COLORS.surface,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  chevron: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  actionSection: {
    backgroundColor: COLORS.surface,
    marginBottom: 20,
  },
  logoutButton: {
    padding: 20,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.error,
  },
  versionSection: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default SettingsScreen;
