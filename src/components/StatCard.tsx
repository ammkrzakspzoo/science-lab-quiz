import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';

const ICON_SIZE = 22;

export interface StatCardProps {
  Icon: LucideIcon;
  value: string;
  label: string;
  valueColor: string;
}

/**
 * One shared statistic card for Topics, Stats and Results.
 * The card takes the full width of its slot and its own content height —
 * never flex:1 inside a flex:1 parent, which would collapse the text.
 */
function StatCardBase({ Icon, value, label, valueColor }: StatCardProps) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon size={ICON_SIZE} color={valueColor} strokeWidth={2.5} />
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

/**
 * A row never shows a single orphaned card: both values must be worth
 * displaying, otherwise the caller gets null and renders plain text instead.
 */
function StatPairBase({ left, right }: { left: StatCardProps | null; right: StatCardProps | null }) {
  if (!left || !right) {
    return null;
  }
  return (
    <View style={styles.row}>
      <View style={styles.slot}>
        <StatCard {...left} />
      </View>
      <View style={styles.slot}>
        <StatCard {...right} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  slot: {
    flex: 1,
  },
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: theme.colors.bg.secondary,
    ...theme.shadows.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    ...theme.typography.counter,
  },
  label: {
    ...theme.typography.micro,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 2,
  },
});

export const StatCard = memo(StatCardBase);
export const StatPair = memo(StatPairBase);
