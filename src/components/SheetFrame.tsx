import React, { memo } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CONTENT_W } from '../constants/config';
import { theme } from '../constants/theme';
import { useEntryAnimation } from '../hooks/useEntryAnimation';

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  onRequestClose: () => void;
  reduceMotion?: boolean;
  children: React.ReactNode;
}

/**
 * Shared raised sheet over an ink scrim. The animated wrapper is marked
 * box-none so the buttons inside keep receiving presses on Android.
 */
function SheetFrameBase({
  visible,
  title,
  message,
  onRequestClose,
  reduceMotion = false,
  children,
}: Props) {
  const { opacity, translateY } = useEntryAnimation(0, 16, reduceMotion);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onRequestClose}>
      <View style={styles.scrim}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheetWrap, { opacity, transform: [{ translateY }] }]}>
          <LinearGradient
            colors={[...theme.gradients.plate]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sheet}>
            <View style={styles.bubbleLarge} pointerEvents="none" />
            <View style={styles.bubbleSmall} pointerEvents="none" />

            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}

            <View style={styles.actions}>{children}</View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: theme.colors.ui.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sheetWrap: {
    width: CONTENT_W,
  },
  sheet: {
    width: '100%',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 20,
    overflow: 'hidden',
    ...theme.shadows.raised,
  },
  bubbleLarge: {
    position: 'absolute',
    top: -18,
    right: -14,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(171, 170, 42, 0.14)',
  },
  bubbleSmall: {
    position: 'absolute',
    bottom: -10,
    left: -8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(40, 41, 224, 0.08)',
  },
  title: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  message: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    marginTop: 8,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
});

export const SheetFrame = memo(SheetFrameBase);
