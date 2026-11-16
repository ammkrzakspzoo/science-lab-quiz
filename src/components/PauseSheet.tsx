import React, { memo } from 'react';
import { Play } from 'lucide-react-native';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { SheetFrame } from './SheetFrame';

interface Props {
  visible: boolean;
  onResume: () => void;
  onEndRound: () => void;
  reduceMotion?: boolean;
}

/** Pausing never changes the underlying question or explanation phase. */
function PauseSheetBase({ visible, onResume, onEndRound, reduceMotion }: Props) {
  return (
    <SheetFrame
      visible={visible}
      title="Round paused"
      message="Your question is saved. Take as long as you need."
      onRequestClose={onResume}
      reduceMotion={reduceMotion}>
      <PrimaryButton label="RESUME" onPress={onResume} Icon={Play} />
      <SecondaryButton label="END ROUND" onPress={onEndRound} />
    </SheetFrame>
  );
}

export const PauseSheet = memo(PauseSheetBase);
