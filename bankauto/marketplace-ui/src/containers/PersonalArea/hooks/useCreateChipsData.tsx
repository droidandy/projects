import { useMemo } from 'react';
import {
  APPLICATION_VEHICLE_STATUS,
  ApplicationMeeting,
  APPLICATION_INSTALMENT_STATUS,
  APPLICATION_CREDIT_STATUS,
} from '@marketplace/ui-kit/types';
import { DATE_FNS } from 'constants/dateFormats';
import { compact } from 'lodash';
import { formatFromTimestamp } from 'helpers';
import { Chip } from '../components';

const LAST_STEP = 6;

type StatusMap = Partial<Record<APPLICATION_CREDIT_STATUS, Chip[]>>;

const useCreateVehicleChipsData = (meetingSchedule?: ApplicationMeeting, status?: APPLICATION_VEHICLE_STATUS): Chip[] =>
  useMemo(() => {
    switch (status) {
      case APPLICATION_VEHICLE_STATUS.SUCCESS: {
        return [{ text: 'Cделка совершена', bgcolor: 'success.main' }];
      }
      case APPLICATION_VEHICLE_STATUS.FROZEN: {
        return [
          { text: 'Условия сделки согласованы', bgcolor: 'success.main' },
          { text: 'Ожидается дата сделки', bgcolor: 'primary.main' },
        ];
      }
      case APPLICATION_VEHICLE_STATUS.CANCEL: {
        return [{ text: 'Сделка отменена', bgcolor: 'primary.main' }];
      }
      default: {
        if (meetingSchedule) {
          const meetingDate = meetingSchedule.dateTime || meetingSchedule.desiredDateTime;

          return compact([
            { text: 'Условия сделки согласованы', bgcolor: 'success.main' },
            meetingDate && {
              text: `Дата сделки ${formatFromTimestamp(meetingDate, DATE_FNS)}`,
              bgcolor: 'success.main',
            },
          ]);
        }
        return [
          { text: 'Автомобиль забронирован', bgcolor: 'success.main' },
          { text: 'Подтверждение условий сделки', bgcolor: 'primary.main' },
        ];
      }
    }
  }, [meetingSchedule, status]);

const useCreateInstalmentChipsData = (
  instalmentStatus: APPLICATION_INSTALMENT_STATUS,
  creditStatus: APPLICATION_CREDIT_STATUS,
  meetingSchedule?: ApplicationMeeting,
  lastSentStep?: number,
): Chip[] =>
  useMemo(() => {
    if (instalmentStatus === APPLICATION_INSTALMENT_STATUS.CANCEL) {
      return [{ text: 'Сделка отменена', bgcolor: 'primary.main' }];
    }

    const STATUS_MAP: StatusMap = {
      [APPLICATION_CREDIT_STATUS.CREATED]: [
        { text: 'Автомобиль забронирован', bgcolor: 'success.main' },
        { text: 'Заполнение заявки', bgcolor: 'primary.main' },
      ],
      [APPLICATION_CREDIT_STATUS.DRAFT]: [
        { text: 'Автомобиль забронирован', bgcolor: 'success.main' },
        { text: 'Заполнение заявки', bgcolor: 'primary.main' },
      ],
      [APPLICATION_CREDIT_STATUS.FROZEN]: [
        { text: 'Автомобиль забронирован', bgcolor: 'success.main' },
        { text: lastSentStep === LAST_STEP ? 'Рассмотрение заявки' : 'Заполнение заявки', bgcolor: 'primary.main' },
      ],
      [APPLICATION_CREDIT_STATUS.CALCULATED]: [
        { text: 'Автомобиль забронирован', bgcolor: 'success.main' },
        { text: 'Рассмотрение заявки', bgcolor: 'primary.main' },
      ],
      [APPLICATION_CREDIT_STATUS.APPROVED]: [
        { text: 'Рассрочка одобрена', bgcolor: 'success.main' },
        meetingSchedule?.dateTime || meetingSchedule?.desiredDateTime
          ? {
              text: `Дата сделки ${formatFromTimestamp(
                (meetingSchedule.dateTime || meetingSchedule.desiredDateTime)!,
                DATE_FNS,
              )}`,
              bgcolor: 'success.main',
            }
          : {
              text: 'Ожидается дата сделки',
              bgcolor: 'primary.main',
            },
      ],
      [APPLICATION_CREDIT_STATUS.REFUSE]: [{ text: 'Заявка на рассрочку отклонена', bgcolor: 'primary.main' }],
      [APPLICATION_CREDIT_STATUS.EXPIRED]: [{ text: 'Заявка истекла', bgcolor: 'primary.main' }],
    };

    const instalmentMappedStatus = STATUS_MAP[creditStatus];
    if (!instalmentMappedStatus) {
      return [];
    }

    return instalmentMappedStatus;
  }, [instalmentStatus, creditStatus, meetingSchedule, lastSentStep]);

export { useCreateVehicleChipsData, useCreateInstalmentChipsData };
