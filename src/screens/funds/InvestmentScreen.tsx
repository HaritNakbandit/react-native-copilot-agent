import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Fund, Investment, Transaction} from '../../types';
import {COLORS, FONT_SIZES, SPACING} from '../../utils/constants';
import {useAuth} from '../../contexts/AuthContext';
import StorageService from '../../services/StorageService';
import CustomButton from '../../components/common/CustomButton';

interface InvestmentScreenProps {
  fund: Fund;
  onSuccess: () => void;
  onBack: () => void;
}

const InvestmentScreen: React.FC<InvestmentScreenProps> = ({
  fund,
  onSuccess,
  onBack,
}) => {
  const {state: authState} = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Net Banking');

  const paymentMethods = ['Net Banking', 'UPI', 'Debit Card', 'Bank Transfer'];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const validateAmount = (): boolean => {
    const numAmount = parseFloat(amount);
    
    if (!amount.trim() || isNaN(numAmount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid investment amount.');
      return false;
    }
    
    if (numAmount < fund.minimumInvestment) {
      Alert.alert(
        'Minimum Investment',
        `Minimum investment amount is ${formatCurrency(fund.minimumInvestment)}.`
      );
      return false;
    }
    
    if (numAmount > 10000000) { // 1 Crore limit
      Alert.alert(
        'Maximum Investment',
        'Maximum investment amount is ₹1,00,00,000 per transaction.'
      );
      return false;
    }
    
    return true;
  };

  const calculateUnits = (): number => {
    const numAmount = parseFloat(amount);
    return numAmount / fund.currentNAV;
  };

  const handleInvest = async () => {
    if (!validateAmount()) return;
    
    if (!authState.user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    Alert.alert(
      'Confirm Investment',
      `Invest ${formatCurrency(parseFloat(amount))} in ${fund.name}?\n\nYou will receive ${calculateUnits().toFixed(4)} units at NAV ${formatCurrency(fund.currentNAV)}.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', onPress: processInvestment},
      ]
    );
  };

  const processInvestment = async () => {
    setLoading(true);
    
    try {
      const investmentAmount = parseFloat(amount);
      const units = calculateUnits();
      const now = new Date();

      // Create investment record
      const investment: Investment = {
        id: `inv_${Date.now()}`,
        userId: authState.user!.id,
        fundId: fund.id,
        amount: investmentAmount,
        units,
        purchaseNAV: fund.currentNAV,
        purchaseDate: now,
        currentValue: investmentAmount, // Initially same as investment amount
        status: 'Active',
      };

      // Create transaction record
      const transaction: Transaction = {
        id: `txn_${Date.now()}`,
        userId: authState.user!.id,
        fundId: fund.id,
        type: 'SUBSCRIPTION',
        amount: investmentAmount,
        units,
        nav: fund.currentNAV,
        date: now,
        status: 'Completed',
        reference: `INV${Date.now()}`,
      };

      // Save to storage
      await StorageService.saveInvestment(investment);
      await StorageService.saveTransaction(transaction);

      Alert.alert(
        'Investment Successful!',
        `Your investment of ${formatCurrency(investmentAmount)} in ${fund.name} has been processed successfully.\n\nUnits allocated: ${units.toFixed(4)}\nReference: ${transaction.reference}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Investment error:', error);
      Alert.alert('Error', 'Failed to process investment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setAmount(cleanValue);
  };

  const getEstimatedUnits = (): string => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return '0.0000';
    return calculateUnits().toFixed(4);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Fund Info Header */}
        <View style={styles.fundInfo}>
          <Text style={styles.fundName}>{fund.name}</Text>
          <Text style={styles.currentNav}>Current NAV: {formatCurrency(fund.currentNAV)}</Text>
          <Text style={styles.minInvestment}>
            Min. Investment: {formatCurrency(fund.minimumInvestment)}
          </Text>
        </View>

        {/* Investment Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="Enter amount"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountContainer}>
            <Text style={styles.quickAmountLabel}>Quick Select:</Text>
            <View style={styles.quickAmountButtons}>
              {[1000, 5000, 10000, 25000].map(quickAmount => (
                <TouchableOpacity
                  key={quickAmount}
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(quickAmount.toString())}>
                  <Text style={styles.quickAmountButtonText}>
                    {quickAmount >= 1000 ? `${quickAmount/1000}k` : quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Investment Summary */}
        {amount && parseFloat(amount) > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment Summary</Text>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Investment Amount</Text>
                <Text style={styles.summaryValue}>{formatCurrency(parseFloat(amount))}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>NAV per Unit</Text>
                <Text style={styles.summaryValue}>{formatCurrency(fund.currentNAV)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated Units</Text>
                <Text style={styles.summaryValue}>{getEstimatedUnits()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodContainer}>
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === method && styles.selectedPaymentMethod,
                ]}
                onPress={() => setSelectedPaymentMethod(method)}>
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === method && styles.selectedPaymentMethodText,
                  ]}>
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>Important Notice</Text>
          <Text style={styles.noticeText}>
            • Units will be allotted based on the NAV at the time of processing{'\n'}
            • Investment is subject to market risks{'\n'}
            • Please read the scheme documents carefully{'\n'}
            • Past performance is not indicative of future results
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <CustomButton
          title="Back"
          onPress={onBack}
          variant="outline"
          style={styles.backButton}
        />
        <CustomButton
          title={loading ? 'Processing...' : 'Invest Now'}
          onPress={handleInvest}
          loading={loading}
          disabled={!amount || parseFloat(amount) < fund.minimumInvestment}
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
  fundInfo: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  fundName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  currentNav: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  minInvestment: {
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
  },
  currencySymbol: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: SPACING.md,
  },
  quickAmountContainer: {
    marginTop: SPACING.md,
  },
  quickAmountLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: COLORS.background,
    borderRadius: 6,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    flex: 1,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  quickAmountButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  summaryContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  paymentMethodButton: {
    backgroundColor: COLORS.background,
    borderRadius: 6,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    margin: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  selectedPaymentMethod: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  paymentMethodText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  selectedPaymentMethodText: {
    color: COLORS.surface,
  },
  noticeContainer: {
    backgroundColor: COLORS.surface,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  noticeTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  noticeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
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

export default InvestmentScreen;
