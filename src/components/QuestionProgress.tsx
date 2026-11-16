import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  index: number;
  total: number;
}

/** Ten segments. The spoken progress value lives on the wrapper. */
function QuestionProgressBase({ index, total }: Props) {
  const segments = Array.from({ length: total }, (_, i) => i);

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={`Question ${index + 1} of ${total}`}>
      {segments.map(i => (
        <View
          key={`seg-${i}`}
          style={[
            styles.segment,
            i < index ? styles.done : i === index ? styles.current : styles.upcoming,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  done: {
    backgroundColor: theme.colors.lab.olive,
  },
  current: {
    backgroundColor: theme.colors.lab.action,
  },
  upcoming: {
    backgroundColor: theme.colors.lab.green,
  },
});

export const QuestionProgress = memo(QuestionProgressBase);
