# GitHub Copilot Instructions - React Native Investment Fund App

## Architecture Overview

This is a **React Native 0.74.5** investment fund application with TypeScript. The app uses a **context-first** architecture without Redux, featuring custom screen-based navigation instead of React Navigation's standard tab navigator.

### Critical Architecture Patterns

#### 1. Custom Navigation Architecture
- **No Tab Navigator**: Uses `MainNavigator.tsx` with state-based screen switching
- **Screen State Management**: `currentScreen` state controls which component renders
- **Navigation Props**: Each screen receives navigation callbacks as props
```tsx
// MainNavigator pattern - screen switching via state
const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
const handleFundSelect = (fund: Fund) => {
  setSelectedFund(fund);
  setCurrentScreen('fundDetails'); // Direct state navigation
};
```

#### 2. Functional Service Pattern
- **StorageService**: Recently converted from class to functional pattern
- **Object Export**: Functions grouped in exported object maintaining singleton behavior
```typescript
// New functional service pattern
const saveUser = async (user: User): Promise<void> => { ... };
const StorageService = { saveUser, getUser, clearUser, ... };
export default StorageService;
```

#### 3. Context-Heavy State Management
- **AuthContext**: User authentication + profile management + settings
- **PortfolioContext**: Investment data + portfolio calculations + fund management
- **No Redux**: All state through React Context API with reducers

## Key Implementation Details

### Data Layer Architecture
- **TypeScript Interfaces**: All in `src/types/index.ts` (User, Fund, Investment, Transaction, PortfolioSummary)
- **Sample Data Initialization**: `App.tsx` loads `SAMPLE_FUNDS` on startup if none exist
- **Currency Formatting**: INR (Indian Rupee) using `Intl.NumberFormat('en-IN')`
- **Date Handling**: All `Date` objects, formatted with `Intl.DateTimeFormat('en-IN')`

### UI/Styling Conventions
- **Design System**: `src/utils/constants.ts` defines `COLORS`, `FONT_SIZES`, `SPACING`
- **Dark Theme Support**: `DARK_COLORS` object with theme switching capability
- **Risk Level Indicators**: Color-coded based on `RISK_LEVELS` mapping
- **Card-Based UI**: Consistent shadow/elevation styling across components

### Form Patterns
- **Validation Rules**: `VALIDATION_RULES` in constants for email/phone patterns
- **Error State Management**: Local state with `errors` object pattern
- **Loading States**: `loading` boolean with disabled button states
```tsx
// Consistent form validation pattern
const [errors, setErrors] = useState<Record<string, string>>({});
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  // ... validation logic
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Development Workflows

### Testing Strategy
- **Jest Configuration**: `jest.config.js` with React Native preset
- **Testing Library**: `@testing-library/react-native` for component testing
- **Test Location**: `__tests__/` directory with `.test.tsx` files
- **Mock Navigation**: Custom mocks in `__mocks__/@react-navigation/`

### Build Commands
```bash
# Development
npx react-native start          # Metro bundler
npx react-native run-ios        # iOS simulator
npx react-native run-android    # Android emulator

# Testing
npm test                        # Jest test runner

# Clean builds (when needed)
cd ios && xcodebuild clean && cd ..
cd android && ./gradlew clean && cd ..
```

### Storage & Persistence
- **AsyncStorage Keys**: Prefixed with `@` (e.g., `@user_profile`, `@investments`)
- **Session Management**: 30-day expiration with timestamp checking
- **Cache Strategy**: Portfolio cache expires after 1 hour
- **Data Export/Import**: JSON serialization for backup/restore

## Project-Specific Patterns

### Navigation Flow
```
App.tsx (initialization)
├── AuthProvider/PortfolioProvider
├── AppContent (auth state switching)
├── MainNavigator (screen state management)
└── Individual Screens (prop-based navigation)
```

### State Management Flow
```
Context Provider → useReducer → dispatch actions → update state → re-render consumers
```

### Investment Flow
```
FundListScreen → FundDetailsScreen → InvestmentScreen → Transaction Creation → Portfolio Update
```

## Component Integration Patterns

### Context Usage
```tsx
// Standard context integration pattern
import { useAuth } from '../../contexts/AuthContext';
import { usePortfolio } from '../../contexts/PortfolioContext';

const MyScreen = () => {
  const { state, updateUser } = useAuth();
  const { addInvestment, refreshPortfolioSummary } = usePortfolio();
  // ... component logic
};
```

### Screen Communication
```tsx
// Parent-child navigation via props
interface ScreenProps {
  onNavigateToNext: () => void;
  onBack: () => void;
  onSuccess?: () => void;
}
```

### Error Handling
- **Try-catch**: AsyncStorage operations wrapped in try-catch
- **Error Logging**: `console.error` for debugging with descriptive messages
- **User Feedback**: Alert dialogs for user-facing errors
- **Graceful Degradation**: Return empty arrays/null for failed data loads

## Critical Dependencies

- **@react-native-async-storage/async-storage**: Local data persistence
- **react-native-vector-icons**: Icon system (requires native linking)
- **react-native-chart-kit**: Portfolio performance charts
- **react-native-elements**: UI component library

Remember: This app **does not use standard React Navigation tab structure** - it's a custom state-based navigation system. Always use the prop-based navigation callbacks rather than navigation hooks.

## Commit Guidelines
- **Commit Messages**: Use imperative mood (e.g., "Add feature", "Fix bug")
- **Branch Naming**: Use `feature/`, `bugfix/`, or `hotfix/` prefixes
- **Pull Requests**: Include clear descriptions of changes, screenshots if applicable, and link to relevant issues
- **Code Reviews**: Ensure all new code is reviewed by at least one other developer before merging
- **Testing**: All new features must include unit tests and integration tests where applicable
- **Documentation**: Update relevant documentation (README, comments)
- **Versioning**: Follow semantic versioning for releases (major.minor.patch) 