import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GAME_HEADER_HEIGHT, GUTTER, HEADER_HEIGHT, ICON_BUTTON, TOP_INSET } from '../constants/config';
import { theme } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  size?: 'standard' | 'tall';
  align?: 'center' | 'left';
}

/**
 * The one header used on every screen. Screens vary only the slots, never the
 * markup, so padding and surfaces cannot drift apart between screens.
 */
function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  size = 'standard',
  align = 'center',
}: Props) {
  const rowHeight = size === 'tall' ? GAME_HEADER_HEIGHT : HEADER_HEIGHT;

  return (
    <View style={styles.header}>
      <View style={[styles.row, { minHeight: rowHeight }]}>
        <View style={styles.slot}>{leftSlot ?? null}</View>

        <View style={[styles.titleWrap, align === 'left' ? styles.titleLeft : null]}>
          <View style={[styles.plate, align === 'left' ? styles.plateLeft : null]}>
            <Text
              style={[styles.title, align === 'left' ? styles.textLeft : null]}
              numberOfLines={1}
              accessibilityRole="header">
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={[styles.subtitle, align === 'left' ? styles.textLeft : null]}
                numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.slot}>{rightSlot ?? null}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: TOP_INSET,
    paddingHorizontal: GUTTER,
    paddingBottom: 10,
    backgroundColor: theme.colors.ui.headerBacking,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slot: {
    width: ICON_BUTTON,
    height: ICON_BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  titleLeft: {
    alignItems: 'flex-start',
  },
  plate: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    maxWidth: '100%',
  },
  plateLeft: {
    alignItems: 'flex-start',
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
  textLeft: {
    textAlign: 'left',
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
