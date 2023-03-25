import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { DATE_TIME } from 'constants/dateFormats';
import { useStyles } from './MeetingModal.styles';
import { ModalLight } from 'components/ModalLight';
import { MeetingModalInitContent } from './MeetingModalInitContent';
import { MeetingModalCallbackRequestSuccessContent } from './MeetingModalCallbackRequestSuccessContent';
import { MeetingModalSetDatetimeContent } from './MeetingModalSetDatetimeContent';

type MeetingModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onScheduleMeeting: (date: number) => Promise<void>;
  onRequestCallback?: () => Promise<void>;
  initialStep?: ModalStep;
};

export type FormValues = {
  date: string | null;
  time: string | null;
};

export enum ModalStep {
  INIT = 'INIT',
  CALLBACK_REQUEST_SUCCESS = 'CALLBACK_REQUEST_SUCCESS',
  SET_DATETIME = 'SET_DATETIME',
}

export const MeetingModal = ({
  isOpen,
  setIsOpen,
  onScheduleMeeting,
  onRequestCallback,
  initialStep = ModalStep.INIT,
}: MeetingModalProps) => {
  const s = useStyles();
  const handleCloseModal = useCallback(() => setIsOpen(false), [setIsOpen]);

  const [step, setStep] = useState<ModalStep>(initialStep);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setStep(isOpen ? initialStep : ModalStep.INIT);
  }, [isOpen]);

  const handleSetDatetimeStep = () => {
    setStep(ModalStep.SET_DATETIME);
  };

  const handleSetDatetime = useCallback(
    (values: FormValues) => {
      setLoading(true);
      const date = moment(`${values.date} ${values.time}`, 'DD.MM.YYYY HH:mm');
      onScheduleMeeting(date.unix())
        .then(() => {
          handleCloseModal();
        })
        .finally(() => setLoading(false));
    },
    [onScheduleMeeting, handleCloseModal, setLoading],
  );

  const handleCallbackRequest = useCallback(() => {
    onRequestCallback!().then(() => {
      setStep(ModalStep.CALLBACK_REQUEST_SUCCESS);
    });
  }, [onRequestCallback]);

  const { content } = useMemo(() => {
    switch (step) {
      case ModalStep.INIT:
        return {
          content: (
            <MeetingModalInitContent
              onChooseDatetime={handleSetDatetimeStep}
              onRequestCallback={onRequestCallback ? handleCallbackRequest : undefined}
            />
          ),
        };
      case ModalStep.SET_DATETIME:
        return {
          content: <MeetingModalSetDatetimeContent onSetDatetime={handleSetDatetime} loading={loading} />,
        };
      case ModalStep.CALLBACK_REQUEST_SUCCESS:
        return {
          content: <MeetingModalCallbackRequestSuccessContent onClose={handleCloseModal} />,
        };
    }
  }, [step, onRequestCallback]);

  return (
    <ModalLight
      isOpen={isOpen}
      handleOpened={setIsOpen}
      onClose={handleCloseModal}
      classes={{
        root: s.root,
      }}
    >
      {content}
    </ModalLight>
  );
};
