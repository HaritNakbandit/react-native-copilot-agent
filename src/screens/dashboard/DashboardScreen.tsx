import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONT_SIZES, SPACING} from '../../utils/constants';
import CustomButton from '../../components/common/CustomButton';
import {useAuth} from '../../contexts/AuthContext';

interface DashboardScreenProps {
  onNavigateToFunds: () => void;
  onNavigateToTransactions: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToFunds,
  onNavigateToTransactions,
}) => {
  const {state, logout} = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.nameText}>{state.user?.fullName || 'User'}</Text>
      </View>

      <View style={styles.portfolioCard}>
        <Text style={styles.cardTitle}>Portfolio Overview</Text>
        <Text style={styles.portfolioValue}>₹0.00</Text>
        <Text style={styles.portfolioSubtext}>Total Investment Value</Text>
        
        <View style={styles.portfolioStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹0.00</Text>
            <Text style={styles.statLabel}>Total Invested</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.gainValue]}>₹0.00</Text>
            <Text style={styles.statLabel}>Total Gains</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={onNavigateToFunds}>
            <Text style={styles.actionButtonText}>Explore Funds</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={onNavigateToTransactions}>
            <Text style={styles.actionButtonText}>View Transactions</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No recent transactions</Text>
          <Text style={styles.emptyStateSubtext}>Start investing to see your activity here</Text>
        </View>
      </View>

      <CustomButton
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  welcomeText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  nameText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  portfolioCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  portfolioValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  portfolioSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  portfolioStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.lightGrey,
    marginHorizontal: SPACING.md,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  gainValue: {
    color: COLORS.success,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  quickActions: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  recentActivity: {
    marginBottom: SPACING.xl,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: SPACING.lg,
  },
});

export default DashboardScreen;
