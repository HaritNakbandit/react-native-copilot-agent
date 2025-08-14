# GitHub Copilot Instructions - React Native Investment Fund App

## Project Status
This is a **partially implemented** React Native investment fund application. The basic structure is in place with navigation, authentication scaffolding, and a complete Settings feature implemented.

## Current Architecture & Implemented Features

### Navigation Structure ✅ COMPLETE
- **AppNavigator.tsx**: Root navigator with auth/main flow switching
- **AuthNavigator.tsx**: Stack navigator for login/register screens
- **MainNavigator.tsx**: Bottom tab navigator (Dashboard, Funds, Transactions, Settings)
- **FundsNavigator.tsx**: Stack navigator for fund-related screens
- **SettingsNavigator.tsx**: Stack navigator for all settings screens

### Settings Feature ✅ COMPLETE
- ✅ **Main Settings Menu**: User profile display, settings categories, logout
- ✅ **Profile Settings**: Edit name, phone, view email (read-only)
- ✅ **Security Settings**: Change password, biometric toggle, security tips
- ✅ **Notification Settings**: Toggle alerts, performance updates, market news
- ✅ **Theme & Language**: Light/dark theme, language selection, display preferences
- ✅ **Full Integration**: Connected to AuthContext, proper navigation, form validation

### Authentication (Partial) ⚠️ NEEDS COMPLETION
- ✅ UI screens (Login/Register) with basic layout
- ✅ AuthContext with state management structure
- ⚠️ Form validation needs implementation
- ⚠️ Actual authentication logic needs completion
- ⚠️ Session persistence needs full implementation

### Technical Stack (Current)
- **React Native CLI**: 0.74.2
- **Language**: TypeScript with strict typing
- **Navigation**: React Navigation 6 (fully implemented)
- **State Management**: React Context API (AuthContext, PortfolioContext)
- **Storage**: AsyncStorage service (structure created, needs implementation)
- **UI**: Native React Native components with consistent styling
- **Redemption confirmation** with estimated proceeds
- **Processing status** tracking
- **Historical redemption** records

### Missing Features (Priority Order)

#### 1. Fund Management (Partial Implementation)
- ⚠️ Complete `FundListScreen.tsx` with search and filtering
- ⚠️ Implement `FundDetailsScreen.tsx` with investment flow
- ⚠️ Add fund performance calculations

#### 2. Portfolio Features (Basic Structure Only)
- ⚠️ Complete `DashboardScreen.tsx` with real portfolio data
- ⚠️ Implement portfolio calculations (gains/losses, allocation)
- ⚠️ Add chart components for performance visualization

#### 3. Transaction System (Basic Screen Only)
- ⚠️ Complete `TransactionScreen.tsx` with history display
- ⚠️ Implement redemption flow
- ⚠️ Add transaction status management

#### 4. Authentication Enhancement
- ⚠️ Complete form validation on login/register screens
- ⚠️ Implement actual authentication logic
- ⚠️ Add session persistence and security

#### 5. Storage Service Implementation
- ⚠️ Complete all methods in `StorageService.ts`
- ⚠️ Add error handling and data encryption
- ⚠️ Create migration logic for data structure changes

## Key Files to Understand

### Core Navigation
- `src/components/AppNavigator.tsx` - Root navigation logic
- `src/components/MainNavigator.tsx` - Main tab navigation 
- `src/components/AuthNavigator.tsx` - Authentication flow
- `src/components/SettingsNavigator.tsx` - Settings stack navigation ✅

### Data Layer
- `src/types/index.ts` - All TypeScript interfaces (User, Fund, Investment, Transaction)
- `src/utils/sampleData.ts` - Sample fund data and constants
- `src/services/StorageService.ts` - AsyncStorage wrapper (needs implementation)

### State Management
- `src/contexts/AuthContext.tsx` - User authentication state
- `src/contexts/PortfolioContext.tsx` - Portfolio data state

### Implemented Screens ✅
- `src/screens/settings/SettingsScreen.tsx` - Main settings menu ✅
- `src/screens/settings/ProfileScreen.tsx` - Profile management ✅
- `src/screens/settings/SecurityScreen.tsx` - Security settings ✅
- `src/screens/settings/NotificationsScreen.tsx` - Notification preferences ✅
- `src/screens/settings/ThemeScreen.tsx` - Theme and language ✅

### Partial Screens (Need Completion)
- `src/screens/auth/` - Login and Register screens (UI only)
- `src/screens/dashboard/` - Portfolio overview (basic structure)
- `src/screens/funds/` - Fund listing and details (basic structure)

## Current Data Structure

The app uses these TypeScript interfaces (defined in `src/types/index.ts`):

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  profilePicture?: string;
  createdAt: Date;
  settings: UserSettings;
}

interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
  biometricEnabled: boolean;
}

interface NotificationSettings {
  transactionAlerts: boolean;
  performanceUpdates: boolean;
  marketNews: boolean;
  pushNotifications: boolean;
}

interface Fund {
  id: string;
  name: string;
  category: string;
  description: string;
  minimumInvestment: number;
  currentNAV: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  fundManager: string;
  inceptionDate: Date;
  totalAssets: number;
}

interface Investment {
  id: string;
  userId: string;
  fundId: string;
  amount: number;
  units: number;
  purchaseNAV: number;
  purchaseDate: Date;
  currentValue: number;
  status: 'Active' | 'Redeemed' | 'Partial';
}
```

## Sample Data Available

The project includes realistic sample data in `src/utils/sampleData.ts`:
- 6 sample funds with real-world fund names and data
- Fund categories: Equity, Bond, Hybrid, Index
- Performance data spanning 1-5 years
- Risk levels and minimum investment amounts

## Development Guidelines

### Building & Running
```bash

# Start Metro bundler
npx react-native start

# iOS
npx react-native run-ios

# Android  
npx react-native run-android

# Clean build (if needed)
cd ios && xcodebuild clean && cd ..
cd android && ./gradlew clean && cd ..
```

### Testing
```bash
# Run tests
npm test

# Test files are in __tests__/ directory
# Current tests: App.test.tsx, RegisterScreen.test.tsx, SettingsScreen.test.tsx
```

### Settings Feature Usage
The complete Settings feature is now implemented:

1. **Access Settings**: Tap Settings tab in bottom navigation
2. **Profile Management**: 
   - Edit name and phone number
   - View email (read-only)
   - Save changes with validation
3. **Security Settings**:
   - Change password with confirmation
   - Toggle biometric authentication
   - View security tips
4. **Notifications**:
   - Control transaction alerts
   - Toggle performance updates
   - Manage market news notifications
5. **Theme & Language**:
   - Switch between light/dark themes
   - Select from 5 languages
   - View display preferences

### Code Patterns to Follow
1. **Use existing TypeScript interfaces** - don't create new ones without checking `src/types/index.ts`
2. **Follow navigation structure** - use the established navigator hierarchy
3. **Use sample data** - reference `src/utils/sampleData.ts` for realistic test data
4. **Context pattern** - follow the AuthContext pattern for new context providers
5. **Screen structure** - follow the pattern in settings screens for consistency
6. **Form validation** - use the patterns established in ProfileScreen and SecurityScreen

### Settings Integration Example
```typescript
// Using AuthContext in screens
import { useAuth } from '../../contexts/AuthContext';

const MyScreen = () => {
  const { state, updateUser } = useAuth();
  
  // Access user data
  const user = state.user;
  
  // Update user profile
  await updateUser({ fullName: 'New Name' });
};
```

## Common Issues & Solutions
- **Navigation typing**: Use `NavigationProp<any>` for now (can be improved later)
- **AsyncStorage**: Import from `@react-native-async-storage/async-storage`
- **Context updates**: Always dispatch actions through reducers, not direct state mutations
- **Settings persistence**: Currently saved to context, needs StorageService integration

## Next Steps for AI Agents
1. **Complete StorageService implementation** - this is the foundation for data persistence
2. **Add real authentication logic** - currently just UI shells with basic validation
3. **Implement fund investment flow** - connect UI to data layer
4. **Add portfolio calculations** - use the Investment interface to calculate portfolio performance
5. **Create reusable UI components** - build a component library for consistent styling

Remember: The Settings feature is fully functional and serves as a template for implementing other features. Use the same patterns for form handling, navigation, and context integration.

## Code Review Guidelines
When performing a code review, follow these guidelines:
When performing a code review, follow our internal security checklist.
When performing a code review, focus on readability and avoid nested ternary operators.