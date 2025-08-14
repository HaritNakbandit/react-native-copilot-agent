import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Transaction, Fund} from '../../types';
import {COLORS, FONT_SIZES, SPACING} from '../../utils/constants';
import {useAuth} from '../../contexts/AuthContext';
import StorageService from '../../services/StorageService';
import CustomButton from '../../components/common/CustomButton';

const TransactionScreen: React.FC = () => {
  const {state: authState} = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'SUBSCRIPTION' | 'REDEMPTION'>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionData, fundData] = await Promise.all([
        StorageService.getTransactions(),
        StorageService.getFunds(),
      ]);

      // Filter transactions for current user
      const userTransactions = transactionData.filter(
        txn => txn.userId === authState.user?.id
      );

      setTransactions(userTransactions);
      setFunds(fundData);
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getFundName = (fundId: string): string => {
    const fund = funds.find(f => f.id === fundId);
    return fund ? fund.name : 'Unknown Fund';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed':
        return COLORS.success;
      case 'Processing':
        return COLORS.warning;
      case 'Failed':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getTypeColor = (type: string): string => {
    return type === 'SUBSCRIPTION' ? COLORS.success : COLORS.error;
  };

  const getTypeIcon = (type: string): string => {
    return type === 'SUBSCRIPTION' ? '↗' : '↙';
  };

  const filteredTransactions = transactions.filter(txn => 
    filter === 'ALL' || txn.type === filter
  );

  const renderTransactionItem = ({item}: {item: Transaction}) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionTypeContainer}>
          <View style={[styles.typeIcon, {backgroundColor: getTypeColor(item.type)}]}>
            <Text style={styles.typeIconText}>{getTypeIcon(item.type)}</Text>
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionType}>
              {item.type === 'SUBSCRIPTION' ? 'Investment' : 'Redemption'}
            </Text>
            <Text style={styles.fundName} numberOfLines={1}>
              {getFundName(item.fundId)}
            </Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, {color: getTypeColor(item.type)}]}>
            {item.type === 'SUBSCRIPTION' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Text style={[styles.status, {color: getStatusColor(item.status)}]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Units</Text>
          <Text style={styles.detailValue}>{item.units.toFixed(4)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>NAV</Text>
          <Text style={styles.detailValue}>{formatCurrency(item.nav)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDate(item.date)}</Text>
        </View>
        {item.reference && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference</Text>
            <Text style={styles.detailValue}>{item.reference}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {['ALL', 'SUBSCRIPTION', 'REDEMPTION'].map(filterType => (
        <TouchableOpacity
          key={filterType}
          style={[
            styles.filterButton,
            filter === filterType && styles.activeFilterButton,
          ]}
          onPress={() => setFilter(filterType as any)}>
          <Text
            style={[
              styles.filterButtonText,
              filter === filterType && styles.activeFilterButtonText,
            ]}>
            {filterType === 'ALL' ? 'All' : 
             filterType === 'SUBSCRIPTION' ? 'Investments' : 'Redemptions'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No transactions found</Text>
      <Text style={styles.emptyStateText}>
        {filter === 'ALL' 
          ? 'You haven\'t made any transactions yet'
          : `No ${filter.toLowerCase()} transactions found`}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Transaction History</Text>
      <Text style={styles.subtitle}>
        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilterButtons()}
      
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  header: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  filterButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: COLORS.surface,
  },
  transactionsList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100, // Space for action bar
  },
  transactionCard: {
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
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  typeIconText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  fundName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  status: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  transactionDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    paddingTop: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  backButton: {
    width: '100%',
  },
});

export default TransactionScreen;
