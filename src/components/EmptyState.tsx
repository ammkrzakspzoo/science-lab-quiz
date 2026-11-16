import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Honest zero-data presentation — never an empty decorative card. */
function EmptyStateBase({ title, body, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <Image source={assets.sprite5} style={styles.art} accessibilityElementsHidden />
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  art: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  title: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  body: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 6,
  },
  action: {
    width: '100%',
    marginTop: 18,
  },
});

export const EmptyState = memo(EmptyStateBase);
