import React, { memo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  label: string;
  description: string;
  value: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

function PreferenceRowBase({ label, description, value, disabled = false, onChange }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.body}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        accessibilityLabel={label}
        thumbColor={value ? theme.colors.lab.action : theme.colors.bg.secondary}
        trackColor={{ false: theme.colors.ui.border, true: 'rgba(40, 41, 224, 0.35)' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
  },
  body: {
    flex: 1,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  description: {
    ...theme.typography.caption,
    fontWeight: '400',
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },
});

export const PreferenceRow = memo(PreferenceRowBase);
