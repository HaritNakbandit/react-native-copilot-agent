# React Native Investment Fund App - Architecture Overview

This document provides a comprehensive architecture overview of the React Native Investment Fund App using Mermaid diagrams to visualize the structure, data flow, and component relationships.

## Overall Application Architecture

```mermaid
graph TB
    %% Entry Point
    App[App.tsx<br/>Entry Point] --> AuthProvider[AuthProvider<br/>Authentication Context]
    AuthProvider --> PortfolioProvider[PortfolioProvider<br/>Portfolio Context]
    PortfolioProvider --> AppNavigator[AppNavigator<br/>Root Navigator]
    
    %% Storage Initialization
    App --> StorageInit[Sample Data<br/>Initialization]
    StorageInit --> StorageService[StorageService<br/>AsyncStorage Layer]
    
    %% Navigation Layer
    AppNavigator --> |isAuthenticated = false| AuthNavigator[AuthNavigator<br/>Auth Stack]
    AppNavigator --> |isAuthenticated = true| MainNavigator[MainNavigator<br/>Main App Stack]
    
    %% Auth Flow
    AuthNavigator --> LoginScreen[LoginScreen]
    AuthNavigator --> RegisterScreen[RegisterScreen]
    
    %% Main App Flow
    MainNavigator --> DashboardScreen[DashboardScreen]
    MainNavigator --> FundListScreen[FundListScreen]
    MainNavigator --> FundDetailsScreen[FundDetailsScreen]
    MainNavigator --> InvestmentScreen[InvestmentScreen]
    MainNavigator --> TransactionScreen[TransactionScreen]
    MainNavigator --> SettingsNavigator[SettingsNavigator<br/>Settings Stack]
    
    %% Settings Flow
    SettingsNavigator --> SettingsScreen[SettingsScreen]
    SettingsNavigator --> ProfileScreen[ProfileScreen]
    SettingsNavigator --> SecurityScreen[SecurityScreen]
    SettingsNavigator --> NotificationsScreen[NotificationsScreen]
    SettingsNavigator --> ThemeScreen[ThemeScreen]
    
    %% Data Storage
    StorageService --> AsyncStorage[(AsyncStorage<br/>Device Storage)]
    
    %% Styling
    classDef entryPoint fill:#e1f5fe
    classDef provider fill:#f3e5f5
    classDef navigator fill:#e8f5e8
    classDef screen fill:#fff3e0
    classDef service fill:#fce4ec
    classDef storage fill:#f1f8e9
    
    class App entryPoint
    class AuthProvider,PortfolioProvider provider
    class AppNavigator,AuthNavigator,MainNavigator,SettingsNavigator navigator
    class LoginScreen,RegisterScreen,DashboardScreen,FundListScreen,FundDetailsScreen,InvestmentScreen,TransactionScreen,SettingsScreen,ProfileScreen,SecurityScreen,NotificationsScreen,ThemeScreen screen
    class StorageService service
    class AsyncStorage storage
```

## State Management Architecture

```mermaid
graph TB
    %% Context Providers
    subgraph "Context Layer"
        AuthContext[AuthContext<br/>User Authentication]
        PortfolioContext[PortfolioContext<br/>Portfolio Data]
    end
    
    %% State Structure
    subgraph "AuthContext State"
        AuthState[AuthState<br/>- isAuthenticated: boolean<br/>- user: User or null<br/>- loading: boolean]
        AuthActions[AuthActions<br/>- LOGIN_START/SUCCESS/FAILURE<br/>- REGISTER_START/SUCCESS/FAILURE<br/>- LOGOUT]
    end
    
    subgraph "PortfolioContext State"
        PortfolioState[PortfolioState<br/>- funds: Fund Array<br/>- investments: Investment Array<br/>- transactions: Transaction Array<br/>- portfolioSummary: PortfolioSummary<br/>- loading: boolean]
        PortfolioActions[PortfolioActions<br/>- SET_FUNDS/INVESTMENTS/TRANSACTIONS<br/>- ADD_INVESTMENT/TRANSACTION<br/>- UPDATE_INVESTMENT<br/>- SET_PORTFOLIO_SUMMARY]
    end
    
    %% Context Connections
    AuthContext --> AuthState
    AuthContext --> AuthActions
    PortfolioContext --> PortfolioState
    PortfolioContext --> PortfolioActions
    
    %% Data Persistence
    AuthContext --> StorageService[StorageService<br/>Data Persistence]
    PortfolioContext --> StorageService
    StorageService --> AsyncStorage[(AsyncStorage)]
    
    %% Screen Components Usage
    AuthContext --> |useAuth| Screens[Screen Components]
    PortfolioContext --> |usePortfolio| Screens
    
    %% Styling
    classDef context fill:#e3f2fd
    classDef state fill:#f3e5f5
    classDef actions fill:#e8f5e8
    classDef service fill:#fff3e0
    classDef storage fill:#f1f8e9
    classDef components fill:#fce4ec
    
    class AuthContext,PortfolioContext context
    class AuthState,PortfolioState state
    class AuthActions,PortfolioActions actions
    class StorageService service
    class AsyncStorage storage
    class Screens components
```

## Navigation Flow Architecture

```mermaid
graph TB
    %% Root Navigation
    AppNavigator[AppNavigator<br/>NavigationContainer] --> AuthCheck{User<br/>Authenticated?}
    
    %% Authentication Flow
    AuthCheck --> |No| AuthNavigator[AuthNavigator<br/>Stack Navigator]
    AuthNavigator --> LoginScreen[LoginScreen]
    AuthNavigator --> RegisterScreen[RegisterScreen]
    
    %% Main Application Flow
    AuthCheck --> |Yes| MainNavigator[MainNavigator<br/>Custom Navigator]
    
    %% Main Screens
    MainNavigator --> Dashboard[DashboardScreen<br/>Portfolio Overview]
    MainNavigator --> FundFlow[Fund Management Flow]
    MainNavigator --> TransactionFlow[Transaction Management]
    MainNavigator --> SettingsFlow[Settings Management]
    
    %% Fund Management Sub-Flow
    subgraph "Fund Management"
        FundFlow --> FundList[FundListScreen<br/>Browse Funds]
        FundList --> FundDetails[FundDetailsScreen<br/>Fund Information]
        FundDetails --> Investment[InvestmentScreen<br/>Make Investment]
    end
    
    %% Transaction Management
    subgraph "Transaction Management"
        TransactionFlow --> TransactionScreen[TransactionScreen<br/>Transaction History]
    end
    
    %% Settings Sub-Flow
    subgraph "Settings Management"
        SettingsFlow --> SettingsNavigator[SettingsNavigator<br/>Stack Navigator]
        SettingsNavigator --> SettingsMain[SettingsScreen<br/>Main Menu]
        SettingsNavigator --> ProfileSettings[ProfileScreen<br/>Edit Profile]
        SettingsNavigator --> SecuritySettings[SecurityScreen<br/>Security Options]
        SettingsNavigator --> NotificationSettings[NotificationsScreen<br/>Notification Preferences]
        SettingsNavigator --> ThemeSettings[ThemeScreen<br/>Theme & Language]
    end
    
    %% Navigation Actions
    Dashboard --> |Navigate to Funds| FundList
    Dashboard --> |Navigate to Transactions| TransactionScreen
    FundList --> |Select Fund| FundDetails
    FundDetails --> |Invest| Investment
    Investment --> |Success| Dashboard
    
    %% Styling
    classDef navigator fill:#e3f2fd
    classDef screen fill:#fff3e0
    classDef decision fill:#ffecb3
    classDef subflow fill:#f1f8e9
    
    class AppNavigator,AuthNavigator,MainNavigator,SettingsNavigator navigator
    class LoginScreen,RegisterScreen,Dashboard,FundList,FundDetails,Investment,TransactionScreen,SettingsMain,ProfileSettings,SecuritySettings,NotificationSettings,ThemeSettings screen
    class AuthCheck decision
```

## Data Flow Architecture

```mermaid
graph TB
    %% User Interactions
    subgraph "User Interface Layer"
        Screens[Screen Components<br/>Login, Dashboard, Funds, etc.]
        Forms[Form Components<br/>Input, Buttons, etc.]
    end
    
    %% State Management
    subgraph "State Management Layer"
        AuthContext[AuthContext<br/>Authentication State]
        PortfolioContext[PortfolioContext<br/>Portfolio State]
        Reducers[Reducers<br/>State Updates]
    end
    
    %% Business Logic
    subgraph "Service Layer"
        AuthService[Authentication Logic<br/>Login, Register, Logout]
        PortfolioService[Portfolio Logic<br/>Calculations, Updates]
        StorageService[StorageService<br/>Data Persistence]
    end
    
    %% Data Storage
    subgraph "Data Layer"
        AsyncStorage[(AsyncStorage<br/>Local Storage)]
        SampleData[Sample Data<br/>Initial Fund Data]
    end
    
    %% Data Flow
    Screens --> |User Actions| AuthContext
    Screens --> |User Actions| PortfolioContext
    Forms --> |Form Submissions| AuthContext
    Forms --> |Investment Data| PortfolioContext
    
    AuthContext --> |State Changes| Reducers
    PortfolioContext --> |State Changes| Reducers
    
    AuthContext --> |Auth Operations| AuthService
    PortfolioContext --> |Portfolio Operations| PortfolioService
    
    AuthService --> |Persist User Data| StorageService
    PortfolioService --> |Persist Portfolio Data| StorageService
    
    StorageService --> |Read/Write| AsyncStorage
    SampleData --> |Initialize| StorageService
    
    %% Feedback Loop
    Reducers --> |State Updates| Screens
    StorageService --> |Data Retrieved| PortfolioContext
    StorageService --> |User Session| AuthContext
    
    %% Styling
    classDef ui fill:#e3f2fd
    classDef state fill:#f3e5f5
    classDef service fill:#e8f5e8
    classDef data fill:#fff3e0
    
    class Screens,Forms ui
    class AuthContext,PortfolioContext,Reducers state
    class AuthService,PortfolioService,StorageService service
    class AsyncStorage,SampleData data
```

## Component Structure by Feature

```mermaid
graph TB
    %% Authentication Feature
    subgraph "Authentication Feature"
        AuthNav[AuthNavigator] --> LoginScreen[LoginScreen<br/>Email/Password Form]
        AuthNav --> RegisterScreen[RegisterScreen<br/>Registration Form]
        AuthContext --> |Manages| UserState[User State<br/>isAuthenticated, user, loading]
    end
    
    %% Dashboard Feature
    subgraph "Dashboard Feature"
        DashboardScreen[DashboardScreen<br/>Portfolio Overview] --> PortfolioCard[Portfolio Card<br/>Total Value, Gains/Losses]
        DashboardScreen --> ActionButtons[Action Buttons<br/>Navigate to Funds/Transactions]
        DashboardScreen --> RecentActivity[Recent Activity<br/>Transaction History]
    end
    
    %% Fund Management Feature
    subgraph "Fund Management Feature"
        FundListScreen[FundListScreen<br/>Fund Browser] --> SearchFilter[Search & Filter<br/>Category, Text Search]
        FundListScreen --> FundCard[FundCard Component<br/>Fund Details Display]
        FundDetailsScreen[FundDetailsScreen<br/>Fund Information] --> FundInfo[Fund Information<br/>Performance, Risk, Details]
        FundDetailsScreen --> InvestButton[Invest Button<br/>Navigate to Investment]
        InvestmentScreen[InvestmentScreen<br/>Investment Form] --> InvestmentForm[Investment Form<br/>Amount, Payment Method]
    end
    
    %% Transaction Feature
    subgraph "Transaction Feature"
        TransactionScreen[TransactionScreen<br/>Transaction History] --> TransactionList[Transaction List<br/>Purchase/Redemption History]
        TransactionScreen --> FilterOptions[Filter Options<br/>Date, Type, Status]
    end
    
    %% Settings Feature
    subgraph "Settings Feature ✅ Complete"
        SettingsNav[SettingsNavigator] --> SettingsScreen[SettingsScreen<br/>Main Settings Menu]
        SettingsNav --> ProfileScreen[ProfileScreen<br/>Edit Profile Information]
        SettingsNav --> SecurityScreen[SecurityScreen<br/>Password & Security]
        SettingsNav --> NotificationsScreen[NotificationsScreen<br/>Notification Preferences]
        SettingsNav --> ThemeScreen[ThemeScreen<br/>Theme & Language]
    end
    
    %% Common Components
    subgraph "Common Components"
        CustomButton[CustomButton<br/>Reusable Button]
        FundCard --> CustomButton
        InvestmentForm --> CustomButton
        LoadingSpinner[LoadingSpinner<br/>Loading States]
        ErrorBoundary[ErrorBoundary<br/>Error Handling]
    end
    
    %% Styling
    classDef complete fill:#c8e6c9
    classDef partial fill:#fff3e0
    classDef component fill:#e3f2fd
    
    class SettingsNav,SettingsScreen,ProfileScreen,SecurityScreen,NotificationsScreen,ThemeScreen complete
    class DashboardScreen,FundListScreen,FundDetailsScreen,InvestmentScreen,TransactionScreen partial
    class CustomButton,FundCard,LoadingSpinner,ErrorBoundary component
```

## Technology Stack

```mermaid
graph TB
    %% Frontend Framework
    subgraph "Frontend Framework"
        ReactNative[React Native 0.74.2<br/>Cross-platform Framework]
        TypeScript[TypeScript<br/>Type Safety]
    end
    
    %% Navigation
    subgraph "Navigation"
        ReactNavigation[React Navigation 6<br/>App Navigation]
        StackNavigator[Stack Navigator<br/>Screen Stacks]
        TabNavigator[Tab Navigator<br/>Bottom Navigation]
    end
    
    %% State Management
    subgraph "State Management"
        ContextAPI[React Context API<br/>Global State]
        useReducer[useReducer Hook<br/>State Updates]
        useState[useState Hook<br/>Local State]
    end
    
    %% Data Persistence
    subgraph "Data Persistence"
        AsyncStorage[AsyncStorage<br/>Local Storage]
        JSONData[JSON Data Format<br/>Serialization]
    end
    
    %% Development Tools
    subgraph "Development Tools"
        Metro[Metro Bundler<br/>JavaScript Bundler]
        Jest[Jest<br/>Testing Framework]
        ESLint[ESLint<br/>Code Linting]
        Prettier[Prettier<br/>Code Formatting]
    end
    
    %% Platform Support
    subgraph "Platform Support"
        iOS[iOS Platform<br/>Native iOS App]
        Android[Android Platform<br/>Native Android App]
    end
    
    %% Connections
    ReactNative --> iOS
    ReactNative --> Android
    ReactNative --> ReactNavigation
    ReactNative --> ContextAPI
    ContextAPI --> AsyncStorage
    
    %% Styling
    classDef framework fill:#e3f2fd
    classDef navigation fill:#f3e5f5
    classDef state fill:#e8f5e8
    classDef storage fill:#fff3e0
    classDef tools fill:#fce4ec
    classDef platform fill:#f1f8e9
    
    class ReactNative,TypeScript framework
    class ReactNavigation,StackNavigator,TabNavigator navigation
    class ContextAPI,useReducer,useState state
    class AsyncStorage,JSONData storage
    class Metro,Jest,ESLint,Prettier tools
    class iOS,Android platform
```

## Key Architecture Decisions

### 1. **State Management Pattern**
- **Context API**: Chosen over Redux for simplicity and React's built-in capabilities
- **useReducer**: Used for complex state logic in AuthContext and PortfolioContext
- **Local State**: Component-level state with useState for UI-specific state

### 2. **Navigation Architecture**
- **Conditional Navigation**: AppNavigator switches between AuthNavigator and MainNavigator based on authentication state
- **Custom Navigator**: MainNavigator uses custom navigation logic instead of tab/stack navigators for flexible screen management
- **Nested Navigation**: SettingsNavigator provides a stack-based sub-navigation for settings screens

### 3. **Data Layer Design**
- **StorageService**: Centralized data access layer wrapping AsyncStorage
- **Type Safety**: Full TypeScript interfaces for all data models
- **Caching**: Portfolio summary caching with expiration for performance
- **Session Management**: User session validation with 30-day expiry

### 4. **Feature Organization**
- **Screen-based Structure**: Organized by feature areas (auth, dashboard, funds, transactions, settings)
- **Common Components**: Reusable UI components in separate directory
- **Service Layer**: Business logic separated from UI components

### 5. **Implementation Status**
- ✅ **Complete**: Settings feature fully implemented with all screens and functionality
- ⚠️ **Partial**: Authentication (UI complete, logic needs enhancement)
- ⚠️ **Partial**: Dashboard (basic structure, needs portfolio calculations)
- ⚠️ **Partial**: Funds (UI framework, needs investment flow completion)
- ⚠️ **Basic**: Transactions (screen exists, needs full implementation)

## Development Guidelines

### Adding New Features
1. **Define Types**: Add interfaces to `src/types/index.ts`
2. **Create Context**: If global state needed, add to context providers
3. **Implement Screens**: Follow existing screen patterns
4. **Add Navigation**: Update appropriate navigator
5. **Add Storage**: Extend StorageService if persistence needed
6. **Write Tests**: Add tests following existing patterns

### Code Quality Standards
- **TypeScript**: Strict typing required for all components
- **Component Structure**: Functional components with hooks
- **Error Handling**: Proper error boundaries and try-catch blocks
- **Performance**: Lazy loading and memoization where appropriate
- **Testing**: Unit tests for critical business logic

This architecture supports a scalable, maintainable React Native application with clear separation of concerns and consistent patterns across all features.