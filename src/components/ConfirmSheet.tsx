import React, { memo } from 'react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { SheetFrame } from './SheetFrame';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  reduceMotion?: boolean;
}

/** Destructive choices always confirm first; cancel is the primary action. */
function ConfirmSheetBase({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  reduceMotion,
}: Props) {
  return (
    <SheetFrame
      visible={visible}
      title={title}
      message={message}
      onRequestClose={onCancel}
      reduceMotion={reduceMotion}>
      <PrimaryButton label={cancelLabel} onPress={onCancel} />
      <SecondaryButton label={confirmLabel} onPress={onConfirm} />
    </SheetFrame>
  );
}

export const ConfirmSheet = memo(ConfirmSheetBase);
