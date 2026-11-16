import React, { memo, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs } from '../components/BottomTabs';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { IconButton } from '../components/IconButton';
import { PreferenceRow } from '../components/PreferenceRow';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { YearSelector } from '../components/YearSelector';
import { assets } from '../assets';
import { CONTENT_W } from '../constants/config';
import { theme } from '../constants/theme';
import type { TabId } from '../game/types';

interface Props {
  selectedYear: number;
  roundActive: boolean;
  hapticsOn: boolean;
  reduceMotion: boolean;
  onYearChange: (year: number) => void;
  onHapticsChange: (value: boolean) => void;
  onMotionChange: (value: boolean) => void;
  onResetProgress: () => void;
  onResume: () => void;
  onNavigate: (tab: TabId) => void;
  onHome: () => void;
}

function SettingsScreenBase({
  selectedYear,
  roundActive,
  hapticsOn,
  reduceMotion,
  onYearChange,
  onHapticsChange,
  onMotionChange,
  onResetProgress,
  onResume,
  onNavigate,
  onHome,
}: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  const openConfirm = useCallback(() => setConfirmReset(true), []);
  const closeConfirm = useCallback(() => setConfirmReset(false), []);
  const confirmAndReset = useCallback(() => {
    setConfirmReset(false);
    onResetProgress();
  }, [onResetProgress]);

  return (
    <AppBackground variant="settings">
      <ScreenHeader
        title="Set up your lab"
        leftSlot={
          <IconButton onPress={onHome} accessibilityLabel="Back to topics" image={assets.iconHome} />
        }
        rightSlot={<View />}
      />

      <View style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle} accessibilityRole="header">
              School year
            </Text>
            <Text style={styles.cardHint}>Choose the year you are studying.</Text>

            {roundActive ? (
              <View style={styles.notice}>
                <Text style={styles.noticeText}>
                  Finish or end your round to change school year.
                </Text>
                <View style={styles.noticeAction}>
                  <SecondaryButton label="GO TO ROUND" onPress={onResume} />
                </View>
              </View>
            ) : null}

            <View style={styles.selectorWrap}>
              <YearSelector
                selectedYear={selectedYear}
                disabled={roundActive}
                onChange={onYearChange}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle} accessibilityRole="header">
              Preferences
            </Text>
            <PreferenceRow
              label="Haptic feedback"
              description="A short, gentle buzz after a correct answer."
              value={hapticsOn}
              onChange={onHapticsChange}
            />
            <View style={styles.divider} />
            <PreferenceRow
              label="Reduce motion"
              description="Replaces movement with a simple fade."
              value={reduceMotion}
              onChange={onMotionChange}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle} accessibilityRole="header">
              Local data
            </Text>
            <Text style={styles.cardHint}>
              Answers, rounds and badges are stored on this device only.
            </Text>
            <View style={styles.resetWrap}>
              <SecondaryButton label="RESET LEARNING PROGRESS" onPress={openConfirm} />
            </View>
          </View>

          <Text style={styles.info}>Free science practice. No account needed.</Text>
          <Text style={styles.info}>
            Question levels cover general school science and are not tied to one national
            curriculum.
          </Text>
        </ScrollView>
      </View>

      <View style={styles.tabs}>
        <BottomTabs selectedTab="settings" onSelect={onNavigate} />
      </View>

      {confirmReset ? (
        <ConfirmSheet
          visible
          title="Reset learning progress?"
          message="Answers, rounds, badges and any active round will be cleared on this device. Your year, haptic and motion settings are kept."
          cancelLabel="KEEP PROGRESS"
          confirmLabel="RESET PROGRESS"
          onCancel={closeConfirm}
          onConfirm={confirmAndReset}
          reduceMotion={reduceMotion}
        />
      ) : null}
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: CONTENT_W,
    alignSelf: 'center',
    paddingTop: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
    gap: 12,
  },
  card: {
    width: '100%',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 16,
    ...theme.shadows.card,
  },
  cardTitle: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  cardHint: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  notice: {
    marginTop: 12,
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(171, 170, 42, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(171, 170, 42, 0.45)',
  },
  noticeText: {
    ...theme.typography.caption,
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.text.primary,
  },
  noticeAction: {
    marginTop: 10,
  },
  selectorWrap: {
    marginTop: 14,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.ui.divider,
  },
  resetWrap: {
    marginTop: 14,
  },
  info: {
    ...theme.typography.caption,
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  tabs: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});

export const SettingsScreen = memo(SettingsScreenBase);
