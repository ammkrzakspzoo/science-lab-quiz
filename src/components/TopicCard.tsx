import React, { memo, useCallback } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { subjectSprite } from '../assets';
import { TOPIC_CARD_H } from '../constants/config';
import type { SubjectId } from '../game/types';
import { usePressAnimation } from '../hooks/usePressAnimation';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const CARD_H = TOPIC_CARD_H;
const PLATE = Math.min(56, CARD_H - 26);

interface Props {
  subject: SubjectId;
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: (subject: SubjectId) => void;
}

function TopicCardBase({ subject, title, description, selected, disabled = false, onSelect }: Props) {
  const { scale, onPressIn, onPressOut } = usePressAnimation(!disabled);
  const handlePress = useCallback(() => onSelect(subject), [onSelect, subject]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="radio"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityState={{ selected, disabled }}
      style={styles.pressable}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          selected ? styles.cardSelected : null,
          disabled ? styles.disabled : null,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.plate}>
          <Image source={subjectSprite[subject]} style={styles.sprite} />
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {selected ? (
              <View style={styles.selectedPill}>
                <Text style={styles.selectedText}>SELECTED</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        </View>

        <View style={[styles.radio, selected ? styles.radioOn : null]}>
          {selected ? <Check size={16} color={theme.colors.text.onAction} strokeWidth={3} /> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    height: CARD_H,
  },
  card: {
    width: '100%',
    height: CARD_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.card,
  },
  cardSelected: {
    backgroundColor: theme.colors.bg.accent,
    borderWidth: 2,
    borderColor: theme.colors.lab.action,
  },
  disabled: {
    opacity: 0.55,
  },
  plate: {
    width: PLATE,
    height: PLATE,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(171, 170, 42, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(171, 170, 42, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: PLATE - 16,
    height: PLATE - 16,
    resizeMode: 'contain',
  },
  body: {
    flex: 1,
    paddingHorizontal: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    flexShrink: 1,
  },
  selectedPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lab.action,
  },
  selectedText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    lineHeight: 13,
    color: theme.colors.text.onAction,
  },
  description: {
    ...theme.typography.support,
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 3,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.ui.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: theme.colors.lab.action,
    borderColor: theme.colors.lab.action,
  },
});

export const TopicCard = memo(TopicCardBase);
