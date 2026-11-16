import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';

interface Props {
  explanation: string;
  takeaway: string;
  streak: number;
}

function ExplanationCardBase({ explanation, takeaway, streak }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <Text style={styles.heading} accessibilityRole="header">
          Why it works
        </Text>
        <Image source={assets.sprite5} style={styles.mark} accessibilityElementsHidden />
      </View>

      <Text style={styles.body}>{explanation}</Text>

      <View style={styles.rememberRow}>
        <Text style={styles.rememberLabel}>Remember</Text>
        <Text style={styles.rememberText}>{takeaway}</Text>
      </View>

      <Text style={styles.streak}>{`Streak: ${streak}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 20,
    ...theme.shadows.card,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heading: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
    flexShrink: 1,
    paddingRight: 12,
  },
  mark: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  body: {
    ...theme.typography.explanation,
    color: theme.colors.text.primary,
  },
  rememberRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  rememberLabel: {
    ...theme.typography.micro,
    color: theme.colors.lab.oliveDeep,
    marginBottom: 2,
  },
  rememberText: {
    ...theme.typography.support,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  streak: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 12,
  },
});

export const ExplanationCard = memo(ExplanationCardBase);
