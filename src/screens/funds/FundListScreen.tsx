import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {Fund} from '../../types';
import {COLORS, FONT_SIZES, SPACING, FUND_CATEGORIES} from '../../utils/constants';
import StorageService from '../../services/StorageService';
import FundCard from '../../components/common/FundCard';
import { FundsStackParamList } from '../../types/navigation';

type FundListScreenNavigationProp = NativeStackNavigationProp<FundsStackParamList, 'FundList'>;

const FundListScreen: React.FC = () => {
  const navigation = useNavigation<FundListScreenNavigationProp>();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [filteredFunds, setFilteredFunds] = useState<Fund[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFunds();
  }, []);

  useEffect(() => {
    filterFunds();
  }, [funds, searchQuery, selectedCategory]);

  const loadFunds = async () => {
    try {
      setLoading(true);
      const loadedFunds = await StorageService.getFunds();
      setFunds(loadedFunds);
    } catch (error) {
      console.error('Error loading funds:', error);
      Alert.alert('Error', 'Failed to load funds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterFunds = () => {
    let filtered = funds;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        fund =>
          fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fund.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fund.fundManager.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(fund => fund.category === selectedCategory);
    }

    setFilteredFunds(filtered);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleFundPress = (fund: Fund) => {
    navigation.navigate('FundDetails', { fund });
  };

  const renderFundCard = ({item}: {item: Fund}) => (
    <FundCard fund={item} onPress={handleFundPress} />
  );

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        data={['All', ...FUND_CATEGORIES]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.selectedCategoryButton,
            ]}
            onPress={() => handleCategorySelect(item)}>
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === item && styles.selectedCategoryButtonText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No funds found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery.trim() || selectedCategory !== 'All'
          ? 'Try adjusting your search or filter criteria'
          : 'No investment funds available at the moment'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Investment Funds</Text>
      <Text style={styles.subtitle}>
        {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} available
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading funds...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search funds..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {renderCategoryFilter()}

      <FlatList
        data={filteredFunds}
        renderItem={renderFundCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.fundsList}
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
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  categoryContainer: {
    paddingBottom: SPACING.md,
  },
  categoryList: {
    paddingHorizontal: SPACING.lg,
  },
  categoryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: COLORS.surface,
  },
  fundsList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
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
});

export default FundListScreen;
