import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {Fund} from '../../types';
import {COLORS, FONT_SIZES, SPACING, RISK_LEVELS} from '../../utils/constants';
import CustomButton from '../../components/common/CustomButton';
import { FundsStackParamList } from '../../types/navigation';

type FundDetailsScreenNavigationProp = NativeStackNavigationProp<FundsStackParamList, 'FundDetails'>;
type FundDetailsScreenRouteProp = RouteProp<FundsStackParamList, 'FundDetails'>;

const FundDetailsScreen: React.FC = () => {
  const navigation = useNavigation<FundDetailsScreenNavigationProp>();
  const route = useRoute<FundDetailsScreenRouteProp>();
  const { fund } = route.params;
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatReturn = (returnValue: number): string => {
    return `${returnValue > 0 ? '+' : ''}${returnValue.toFixed(2)}%`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatAssets = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    }
    return formatCurrency(amount);
  };

  const getRiskColor = (riskLevel: string): string => {
    return RISK_LEVELS[riskLevel as keyof typeof RISK_LEVELS]?.color || COLORS.textSecondary;
  };

  const getRiskDescription = (riskLevel: string): string => {
    return RISK_LEVELS[riskLevel as keyof typeof RISK_LEVELS]?.description || '';
  };

  const handleInvest = () => {
    navigation.navigate('Investment', { fund });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.fundName}>{fund.name}</Text>
          <View style={styles.categoryRow}>
            <Text style={styles.category}>{fund.category}</Text>
            <View style={styles.riskContainer}>
              <View style={[styles.riskIndicator, {backgroundColor: getRiskColor(fund.riskLevel)}]} />
              <Text style={styles.riskText}>{fund.riskLevel} Risk</Text>
            </View>
          </View>
        </View>

        {/* NAV Section */}
        <View style={styles.navSection}>
          <Text style={styles.navLabel}>Current NAV</Text>
          <Text style={styles.navValue}>{formatCurrency(fund.currentNAV)}</Text>
          <Text style={styles.navDate}>As of {formatDate(new Date())}</Text>
        </View>

        {/* Performance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>1 Year</Text>
              <Text
                style={[
                  styles.performanceValue,
                  {color: fund.oneYearReturn >= 0 ? COLORS.success : COLORS.error},
                ]}>
                {formatReturn(fund.oneYearReturn)}
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>3 Years</Text>
              <Text
                style={[
                  styles.performanceValue,
                  {color: fund.threeYearReturn >= 0 ? COLORS.success : COLORS.error},
                ]}>
                {formatReturn(fund.threeYearReturn)}
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>5 Years</Text>
              <Text
                style={[
                  styles.performanceValue,
                  {color: fund.fiveYearReturn >= 0 ? COLORS.success : COLORS.error},
                ]}>
                {formatReturn(fund.fiveYearReturn)}
              </Text>
            </View>
          </View>
        </View>

        {/* Fund Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fund Details</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fund Manager</Text>
              <Text style={styles.detailValue}>{fund.fundManager}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Inception Date</Text>
              <Text style={styles.detailValue}>{formatDate(fund.inceptionDate)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Assets</Text>
              <Text style={styles.detailValue}>{formatAssets(fund.totalAssets)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expense Ratio</Text>
              <Text style={styles.detailValue}>{fund.expenseRatio}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Benchmark</Text>
              <Text style={styles.detailValue}>{fund.benchmark}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Minimum Investment</Text>
              <Text style={styles.detailValue}>{formatCurrency(fund.minimumInvestment)}</Text>
            </View>
          </View>
        </View>

        {/* Risk Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Information</Text>
          <View style={styles.riskInfoContainer}>
            <View style={styles.riskHeader}>
              <View style={[styles.riskIndicatorLarge, {backgroundColor: getRiskColor(fund.riskLevel)}]} />
              <Text style={styles.riskLevel}>{fund.riskLevel} Risk</Text>
            </View>
            <Text style={styles.riskDescription}>{getRiskDescription(fund.riskLevel)}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Fund</Text>
          <Text style={styles.description}>{fund.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <CustomButton
          title="Back to Funds"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.backButton}
        />
        <CustomButton
          title="Invest Now"
          onPress={handleInvest}
          style={styles.investButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100, // Space for action bar
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  fundName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  riskText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  navSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  navLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  navValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  navDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginTop: SPACING.md,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  performanceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  performanceValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  detailsContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  detailLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  riskInfoContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  riskIndicatorLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  riskLevel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  riskDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  backButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  investButton: {
    flex: 2,
    marginLeft: SPACING.sm,
  },
});

export default FundDetailsScreen;
