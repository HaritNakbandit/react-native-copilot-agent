import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Fund} from '../../types';
import {COLORS, FONT_SIZES, SPACING, RISK_LEVELS} from '../../utils/constants';

interface FundCardProps {
  fund: Fund;
  onPress: (fund: Fund) => void;
}

const FundCard: React.FC<FundCardProps> = ({fund, onPress}) => {
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

  const getRiskColor = (riskLevel: string): string => {
    return RISK_LEVELS[riskLevel as keyof typeof RISK_LEVELS]?.color || COLORS.textSecondary;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(fund)} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.fundName} numberOfLines={1}>
            {fund.name}
          </Text>
          <Text style={styles.category}>{fund.category}</Text>
        </View>
        <View style={styles.navSection}>
          <Text style={styles.navLabel}>NAV</Text>
          <Text style={styles.navValue}>{formatCurrency(fund.currentNAV)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.performanceSection}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>1Y Return</Text>
            <Text
              style={[
                styles.performanceValue,
                {color: fund.oneYearReturn >= 0 ? COLORS.success : COLORS.error},
              ]}>
              {formatReturn(fund.oneYearReturn)}
            </Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>3Y Return</Text>
            <Text
              style={[
                styles.performanceValue,
                {color: fund.threeYearReturn >= 0 ? COLORS.success : COLORS.error},
              ]}>
              {formatReturn(fund.threeYearReturn)}
            </Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>5Y Return</Text>
            <Text
              style={[
                styles.performanceValue,
                {color: fund.fiveYearReturn >= 0 ? COLORS.success : COLORS.error},
              ]}>
              {formatReturn(fund.fiveYearReturn)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.riskSection}>
            <View style={[styles.riskIndicator, {backgroundColor: getRiskColor(fund.riskLevel)}]} />
            <Text style={styles.riskText}>{fund.riskLevel} Risk</Text>
          </View>
          <Text style={styles.minInvestment}>
            Min: {formatCurrency(fund.minimumInvestment)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  titleSection: {
    flex: 1,
    marginRight: SPACING.md,
  },
  fundName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  category: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  navSection: {
    alignItems: 'flex-end',
  },
  navLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  navValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    paddingTop: SPACING.md,
  },
  performanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  performanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  performanceLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  performanceValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskSection: {
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
  minInvestment: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default FundCard;
