import React from 'react';
import {StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import {COLORS, FONT_SIZES, SPACING} from '../../utils/constants';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  testID?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  testID = 'custom-button',
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        break;
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }
    
    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButtonText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButtonText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButtonText);
        break;
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButtonText);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
      >
      <Text style={[...getTextStyle(), textStyle]}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: COLORS.transparent,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGrey,
    borderColor: COLORS.lightGrey,
  },
  buttonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: COLORS.surface,
  },
  secondaryButtonText: {
    color: COLORS.surface,
  },
  outlineButtonText: {
    color: COLORS.primary,
  },
  disabledButtonText: {
    color: COLORS.textSecondary,
  },
});

export default CustomButton;
