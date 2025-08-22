# 🔄 GitHub Actions Workflows

This document describes the automated CI/CD workflows set up for the Investment Fund App.

## 📋 Available Workflows

### 1. 🧪 Pull Request Validation (`pr-validation.yml`)
**Triggers**: Pull requests to `main`, `develop`, or `release/*` branches

**Jobs**:
- **Code Quality & Tests**: TypeScript checking, ESLint, Prettier, Jest tests with coverage
- **Android Build**: Gradle build verification and APK generation
- **iOS Build**: Xcode build verification 
- **Security Scan**: npm audit and vulnerability scanning
- **PR Size Check**: Automatic PR size analysis and warnings
- **Summary**: Overall validation status

**Status Badges**:
```markdown
![PR Validation](https://github.com/HaritNakbandit/react-native-copilot-agent/workflows/Pull%20Request%20Validation/badge.svg)
```

### 2. 📦 Dependency Updates (`dependency-updates.yml`)
**Triggers**: Weekly schedule (Mondays 9 AM UTC) + manual dispatch

**Jobs**:
- **Dependency Review**: Checks for outdated packages and security vulnerabilities
- **Auto-merge Dependabot**: Automatically merges minor/patch updates from Dependabot

**Features**:
- Creates GitHub issues for dependency reports
- Automatic approval and merging of safe updates
- Weekly maintenance notifications

### 3. ⚡ Performance & Bundle Analysis (`performance-analysis.yml`)
**Triggers**: Pull requests affecting source code or dependencies

**Jobs**:
- **Bundle Analysis**: Compares bundle sizes between base and PR branches
- **Performance Checks**: Analyzes code for performance anti-patterns

**Features**:
- Bundle size comparison with percentage changes
- Performance recommendations based on React Native best practices
- Automatic comments on PRs with analysis results

### 4. 🏷️ Auto Label PRs (`auto-label.yml`)
**Triggers**: PR opened, edited, or synchronized

**Jobs**:
- **Auto Label**: Applies labels based on file changes and PR content
- **Template Compliance**: Checks PR description against recommended template

**Label Categories**:
- **Size**: `size/S`, `size/M`, `size/L`, `size/XL`
- **Type**: `frontend`, `backend`, `testing`, `documentation`
- **Domain**: `domain/funds`, `domain/portfolio`, `domain/user`
- **Priority**: `priority/high`, `priority/medium`
- **Platform**: `android`, `ios`

## 🛠️ Setup Instructions

### Prerequisites
1. GitHub repository with admin access
2. Repository secrets configured (if needed)
3. Branch protection rules enabled

### Required Repository Settings

#### Branch Protection Rules
For `main` and `develop` branches:
```
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging
✅ Status checks: 
   - Code Quality & Tests
   - Android Build Verification  
   - iOS Build Verification
✅ Restrict pushes to matching branches
✅ Allow force pushes: false
✅ Allow deletions: false
```

#### Repository Labels
The auto-labeling workflow expects these labels to exist:
```
# Size labels
size/S, size/M, size/L, size/XL

# Type labels  
frontend, backend, testing, documentation, ci/cd

# Domain labels
domain/funds, domain/portfolio, domain/user, domain/transactions, domain/analytics

# Priority labels
priority/high, priority/medium, priority/low

# Platform labels
android, ios

# Special labels
breaking-change, performance, security, dependencies, automated
```

### Manual Label Creation Script
Run this in your repository to create all required labels:

```bash
gh label create "size/S" --color "0052cc" --description "Small changes"
gh label create "size/M" --color "1d76db" --description "Medium changes"  
gh label create "size/L" --color "fbca04" --description "Large changes"
gh label create "size/XL" --color "d93f0b" --description "Extra large changes"

gh label create "frontend" --color "7057ff" --description "Frontend/UI changes"
gh label create "backend" --color "008672" --description "Backend/service changes"
gh label create "testing" --color "0052cc" --description "Test related changes"

gh label create "domain/funds" --color "84b6eb" --description "Fund management features"
gh label create "domain/portfolio" --color "c2e0c6" --description "Portfolio features"
gh label create "domain/user" --color "f9d0c4" --description "User management features"

gh label create "priority/high" --color "d93f0b" --description "High priority"
gh label create "priority/medium" --color "fbca04" --description "Medium priority"

gh label create "android" --color "a4f287" --description "Android platform"
gh label create "ios" --color "5319e7" --description "iOS platform"

gh label create "performance" --color "ff6b6b" --description "Performance related"
gh label create "security" --color "ee0701" --description "Security related"
gh label create "dependencies" --color "0366d6" --description "Dependency updates"
gh label create "automated" --color "ededed" --description "Automated changes"
```

## 📊 Monitoring & Maintenance

### Workflow Status
Monitor workflow health in the Actions tab:
- **Success Rate**: Aim for >95% success rate
- **Build Times**: Monitor for increasing build times
- **Failure Patterns**: Address recurring failures promptly

### Performance Metrics
The workflows track:
- Bundle size changes
- Test coverage percentages  
- Build duration trends
- Dependency update frequency

### Maintenance Tasks
- **Weekly**: Review dependency update reports
- **Monthly**: Analyze workflow performance metrics
- **Quarterly**: Update workflow configurations as needed

## 🔧 Customization

### Adding New Checks
To add new validation steps:

1. **Code Quality**: Add new linting rules in `.eslintrc.js`
2. **Performance**: Extend performance checks in `performance-analysis.yml`
3. **Security**: Add custom security scanning tools
4. **Platform-specific**: Add platform-specific build validations

### Workflow Modifications
Key files to modify:
- `pr-validation.yml`: Core PR validation logic
- `auto-label.yml`: Label assignment rules  
- `dependabot.yml`: Dependency update configuration

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clean builds
cd android && ./gradlew clean
cd ios && xcodebuild clean
```

#### Node.js Version Conflicts
Ensure all workflows use Node.js 18 (matches your package.json engines requirement)

#### Permission Issues
Check repository permissions for:
- Writing to PRs (auto-labeling)
- Creating issues (dependency reports)  
- Merging PRs (Dependabot auto-merge)

### Support
For issues with these workflows:
1. Check the Actions tab for detailed error logs
2. Review workflow run artifacts for debugging info
3. Ensure all required repository settings are configured

---

*This CI/CD setup is specifically tailored for the React Native Investment Fund App architecture with custom navigation and context-heavy state management.*
