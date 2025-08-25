import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../utils/constants';

const NotificationsScreen: React.FC = () => {
  const { state } = useAuth();
  const [notifications, setNotifications] = useState({
    transactionAlerts: state.user?.settings?.notifications?.transactionAlerts || true,
    performanceUpdates: state.user?.settings?.notifications?.performanceUpdates || true,
    marketNews: state.user?.settings?.notifications?.marketNews || false,
    pushNotifications: state.user?.settings?.notifications?.pushNotifications || true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications(prev => ({
      ...prev,
      [key]: newValue,
    }));

    // In a real app, you would save this to storage/backend
    const settingName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    Alert.alert(
      'Notification Setting',
      `${settingName} ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  const notificationSettings = [
    {
      key: 'transactionAlerts' as const,
      title: 'Transaction Alerts',
      description: 'Get notified when your investments are processed',
    },
    {
      key: 'performanceUpdates' as const,
      title: 'Performance Updates',
      description: 'Daily and weekly portfolio performance summaries',
    },
    {
      key: 'marketNews' as const,
      title: 'Market News',
      description: 'Important market updates and investment insights',
    },
    {
      key: 'pushNotifications' as const,
      title: 'Push Notifications',
      description: 'Allow the app to send notifications to your device',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        <Text style={styles.sectionDescription}>
          Choose which notifications you'd like to receive
        </Text>
        
        {notificationSettings.map((setting) => (
          <View key={setting.key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{setting.title}</Text>
              <Text style={styles.settingDescription}>{setting.description}</Text>
            </View>
            <Switch
              value={notifications[setting.key]}
              onValueChange={() => handleToggle(setting.key)}
              trackColor={{ false: COLORS.lightGrey, true: COLORS.primary }}
              thumbColor={notifications[setting.key] ? COLORS.surface : COLORS.textSecondary}
            />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Timing</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Transaction Alerts</Text>
          <Text style={styles.infoValue}>Immediate</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Performance Updates</Text>
          <Text style={styles.infoValue}>Daily at 9:00 AM</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Market News</Text>
          <Text style={styles.infoValue}>Weekly on Mondays</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Notifications</Text>
        <Text style={styles.aboutText}>
          We respect your privacy and will only send notifications that are relevant to your investments. 
          You can change these settings at any time.{'\n\n'}
          For push notifications to work, please ensure notifications are enabled in your device settings.
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
  },
});

export default NotificationsScreen;
