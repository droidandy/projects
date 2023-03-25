import React, { FC, memo, useEffect, useMemo, useRef } from 'react';
import { Schema } from 'yup';
import { useFormState } from 'react-final-form';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import {
  IdentitySchema,
  EquipmentSchema,
  HistorySchema,
  RegistrationSchema,
  AuthorizationSchema,
  PriceSchema,
  MediaSchema,
} from '../FieldSet';
import { EventLabel, fireSellCreateAnalytics } from 'helpers/analytics/sell_create';
import { STEP_STATUS, StepBlockItem, StepBlockItemProps } from './StepBlockItem';

const SubmitReadySchema = HistorySchema.concat(AuthorizationSchema);

// TODO create component
// {
//   text: 'Фото и видео',
//   status: getStepStatus(historyReady, imagesExterior && imagesExterior.length),
//   id: 'images',
// },

const ValidateAll = <T extends { [k: string]: any }>(values: T, schemas: (Schema<Partial<T>> | boolean)[]) => {
  const initial: boolean[] = [];
  return schemas.reduce((r, c) => {
    if (typeof c === 'boolean') {
      return [...r, c];
    }
    try {
      c.validateSync(values);
      return [...r, true];
    } catch (e) {
      return [...r, false];
    }
  }, initial);
};

interface StepProps<P extends Partial<VehicleFormSellValues>, C extends Partial<VehicleFormSellValues>>
  extends Omit<StepBlockItemProps, 'status'> {
  eventLabel: EventLabel;
  previousSchema?: Schema<P> | boolean;
  currentSchema?: Schema<C> | boolean;
}

const Step = <P, C>({ previousSchema, currentSchema, eventLabel, ...itemProps }: StepProps<P, C>) => {
  const { values } = useFormState<VehicleFormSellValues>();
  const [previousValid, currentValid] = ValidateAll(values, [previousSchema || false, currentSchema || false]);
  const init = useRef(false);

  const status = useMemo<STEP_STATUS>(() => {
    if (previousValid) {
      return currentValid ? STEP_STATUS.SUCCESS : STEP_STATUS.PROGRESS;
    }
    return STEP_STATUS.WAITING;
  }, [previousValid, currentValid]);

  useEffect(() => {
    if (status !== STEP_STATUS.SUCCESS || init.current) return;
    init.current = true;
    fireSellCreateAnalytics(eventLabel);
    // console.log(`event fired: ${eventLabel}`);
  }, [eventLabel, status]);

  return <StepBlockItem status={status} {...itemProps} />;
};

interface StepBlockProps {
  route: string;
}

export const StepBlock: FC<StepBlockProps> = memo(({ route }) => {
  const { isMobile } = useBreakpoints();
  return (
    <Box
      p={3.75}
      display={isMobile ? 'none' : 'block'}
      borderRadius="0.5rem"
      bgcolor="secondary.light"
      position="sticky"
      top="5.75rem"
    >
      <Box style={{ height: 0, overflow: 'hidden' }}>
        <Step
          eventLabel={EventLabel.CAR_CONTACTS}
          previousSchema
          currentSchema={RegistrationSchema}
          id="contacts"
          text="Контакты"
          number={1}
          route={route}
        />
      </Box>
      <Step
        eventLabel={EventLabel.CAR_MODEL}
        previousSchema={AuthorizationSchema}
        currentSchema={AuthorizationSchema.concat(IdentitySchema)}
        id="brand"
        text="Марка и модель"
        number={1}
        route={route}
        pt={1.25}
      />
      <Step
        eventLabel={EventLabel.CAR_SPECIFICATIONS}
        previousSchema={AuthorizationSchema.concat(IdentitySchema)}
        currentSchema={EquipmentSchema}
        id="equipment"
        text="Технические характеристики"
        number={2}
        route={route}
        pt={1.25}
      />
      <Step
        eventLabel={EventLabel.CAR_CONDITION}
        previousSchema={EquipmentSchema}
        currentSchema={HistorySchema}
        id="history"
        text="История и состояние"
        number={3}
        route={route}
        pt={1.25}
      />
      <Step
        eventLabel={EventLabel.CAR_PRICE}
        previousSchema={HistorySchema}
        currentSchema={PriceSchema}
        id="price"
        text="Оценка"
        number={4}
        route={route}
        pt={1.25}
      />
      <Step
        eventLabel={EventLabel.CAR_PHOTO}
        previousSchema={HistorySchema}
        currentSchema={MediaSchema}
        id="media"
        text="Фото и видео"
        number={5}
        route={route}
        pt={1.25}
      />
      <Step
        eventLabel={EventLabel.FORM_COMPLETED}
        previousSchema={SubmitReadySchema}
        currentSchema={false}
        id="publication"
        text="Публикация"
        number={6}
        route={route}
        pt={1.25}
      />
    </Box>
  );
});
