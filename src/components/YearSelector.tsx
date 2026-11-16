import React, { memo, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { CONTENT_W, SCHOOL_YEARS } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressAnimation } from '../hooks/usePressAnimation';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const GAP = 12;
const CELL_W = Math.floor((CONTENT_W - 32 - GAP) / 2);
const CELL_H = 52;

function YearCell({
  year,
  selected,
  disabled,
  onChange,
}: {
  year: number;
  selected: boolean;
  disabled: boolean;
  onChange: (year: number) => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressAnimation(!disabled);
  const handlePress = useCallback(() => onChange(year), [onChange, year]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="radio"
      accessibilityLabel={`Year ${year}`}
      accessibilityState={{ selected, disabled }}
      style={styles.pressable}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.cell,
          selected ? styles.cellSelected : null,
          disabled ? styles.disabled : null,
          { transform: [{ scale }] },
        ]}>
        <View style={[styles.marker, selected ? styles.markerOn : null]} />
        <Text style={styles.label}>{`Year ${year}`}</Text>
      </Animated.View>
    </Pressable>
  );
}

function YearSelectorBase({
  selectedYear,
  disabled = false,
  onChange,
}: {
  selectedYear: number;
  disabled?: boolean;
  onChange: (year: number) => void;
}) {
  return (
    <View style={styles.grid} accessibilityRole="radiogroup">
      {SCHOOL_YEARS.map(year => (
        <YearCell
          key={year}
          year={year}
          selected={year === selectedYear}
          disabled={disabled}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  pressable: {
    width: CELL_W,
    height: CELL_H,
  },
  cell: {
    width: CELL_W,
    height: CELL_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.primary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  cellSelected: {
    backgroundColor: theme.colors.bg.accent,
    borderWidth: 2,
    borderColor: theme.colors.lab.action,
  },
  disabled: {
    opacity: 0.5,
  },
  marker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: 'transparent',
  },
  markerOn: {
    borderColor: theme.colors.lab.action,
    backgroundColor: theme.colors.lab.action,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
});

export const YearSelector = memo(YearSelectorBase);
