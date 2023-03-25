// @flow
import DayPicker from 'react-day-picker';

import Input from 'components/forms-components/Input';
import Button from 'components/styled/FormButton';
import format from 'date-fns/format';
import isEqual from 'date-fns/is_equal';

type CalendarProps = {
  placeholder?: string,
  input: {
    // TODO: eslint doesn't provide support for nested values
    // value: {
    //   calendarOpen: boolean,
    //   day: Date
    // }
  },
  notDisabledSince: Date
};

export default ({ placeholder, input: { value, onChange }, notDisabledSince }: CalendarProps) => {
  const { calendarOpen, day } = value;
  return (
    <div>
      <div className="d-flex">
        <Input
          type="text"
          placeholder={placeholder}
          value={day ? format(day, 'DD/MM/YYYY') : 'Use calendar'}
        />
        <Button onClick={() => onChange({ ...value, calendarOpen: !calendarOpen })}>
          {calendarOpen ? 'Close calendar' : 'Open Calendar'}
        </Button>
      </div>
      {calendarOpen
        ? <DayPicker
          disabledDays={{
            before: notDisabledSince,
          }}
          onDayClick={(chosenDay) => {
            if (isEqual(day, chosenDay)) onChange({ ...value, day: null });
            else onChange({ ...value, day: chosenDay });
          }}
          selectedDays={day}
        />
        : null}
    </div>
  );
};
