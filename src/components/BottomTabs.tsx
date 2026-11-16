import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Award, BarChart3, FlaskConical, Settings } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { CONTENT_W, TAB_BAR_HEIGHT } from '../constants/config';
import { theme } from '../constants/theme';
import type { TabId } from '../game/types';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const TAB_W = Math.floor(CONTENT_W / 4);
const ICON_SIZE = 24;

const TABS: Array<{ id: TabId; label: string; Icon: LucideIcon }> = [
  { id: 'topics', label: 'Topics', Icon: FlaskConical },
  { id: 'badges', label: 'Badges', Icon: Award },
  { id: 'stats', label: 'Stats', Icon: BarChart3 },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

function Tab({
  id,
  label,
  Icon,
  selected,
  onSelect,
}: {
  id: TabId;
  label: string;
  Icon: LucideIcon;
  selected: boolean;
  onSelect: (tab: TabId) => void;
}) {
  const handlePress = useCallback(() => onSelect(id), [id, onSelect]);
  const color = selected ? theme.colors.lab.action : theme.colors.text.tertiary;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={styles.tab}>
      <View style={styles.tabInner}>
        <View style={[styles.indicator, selected ? styles.indicatorOn : null]} />
        <Icon size={ICON_SIZE} color={color} strokeWidth={selected ? 2.6 : 2} />
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function BottomTabsBase({
  selectedTab,
  onSelect,
}: {
  selectedTab: TabId;
  onSelect: (tab: TabId) => void;
}) {
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {TABS.map(tab => (
        <Tab
          key={tab.id}
          id={tab.id}
          label={tab.label}
          Icon={tab.Icon}
          selected={tab.id === selectedTab}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: CONTENT_W,
    height: TAB_BAR_HEIGHT,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.card,
  },
  tab: {
    width: TAB_W,
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 22,
    height: 3,
    borderRadius: 2,
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  indicatorOn: {
    backgroundColor: theme.colors.lab.action,
  },
  label: {
    ...theme.typography.micro,
    letterSpacing: 0.2,
    marginTop: 3,
  },
});

export const BottomTabs = memo(BottomTabsBase);
