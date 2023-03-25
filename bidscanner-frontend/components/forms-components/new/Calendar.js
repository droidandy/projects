// @flow
import React from 'react';
import styled from 'styled-components';

import type { InputProps } from 'redux-form';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import withRefs from 'utils/hoc/withRefs';

import format from 'date-fns/format';
import isEqual from 'date-fns/is_equal';

import DayPicker from 'react-day-picker';
import Popover from 'material-ui/Popover';
import Input from './Input';

import CalendarSVG from './calendar.svg';

const Container = styled.div`position: relative;`;

const CalendarContainer = styled.div`
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  background-color: white;
`;

const enhance = compose(
  withState('calendarDisplayed', 'setCalendarDisplayed', false),
  withRefs(),
  withHandlers({
    onInputClick: props => () => {
      props.setCalendarDisplayed(true);
    },
    onDayClick: props => chosenDay => {
      const { input, setCalendarDisplayed } = props;
      const sameDate = isEqual(input.value, chosenDay);

      input.onChange(sameDate ? null : chosenDay);
      setCalendarDisplayed(false);
    },
    onRequestClose: props => () => {
      props.setCalendarDisplayed(false);
    },
  })
);

type RecomposeProps = {
  calendarDisplayed: boolean,
  containerRef: any => void & { get: () => any },
  setRef: string => any => void,
  refs: any,
  onInputClick: () => void,
  onDayClick: () => void,
  onRequestClose: () => void,
};

type ExternalProps = {
  className?: string,
  placeholder?: string,
  input: InputProps,
  rangeStart?: Date,
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const {
    className,
    setRef,
    refs,
    input,
    rangeStart,
    calendarDisplayed,
    onInputClick,
    onDayClick,
    onRequestClose,
    ...restProps
  } = props;
  const displayValue = input.value ? format(input.value, 'DD/MM/YYYY') : '';

  return (
    <Container innerRef={setRef('container')} className={className}>
      <Input
        {...restProps}
        type="text"
        input={input}
        value={displayValue}
        onClick={onInputClick}
        pseudo
        icon={CalendarSVG}
      />
      <Popover
        open={calendarDisplayed}
        anchorEl={refs.container}
        anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
        onRequestClose={onRequestClose}
        style={{ boxShadow: 'none' }}
      >
        <CalendarContainer>
          <DayPicker
            disabledDays={{
              before: rangeStart,
            }}
            onDayClick={onDayClick}
            selectedDays={input.value || []}
          />
        </CalendarContainer>
      </Popover>
    </Container>
  );
});

export default EnhancedComponent;
