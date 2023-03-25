import { Box, Button, Typography } from '@marketplace/ui-kit';
import { useStyles } from './MeetingModal.styles';
import { Input } from 'components/Fields';
import React from 'react';
import { Form } from 'react-final-form';
import { makeValidateSync } from 'components/Fields/validation';
import { DateTimeSchema } from './dateTime.schema';
import { FormValues } from './MeetingModal';
import { ReactComponent as CalendarIcon } from 'icons/iconCalendarBlankBlack.svg';
import { ReactComponent as ClockIcon } from 'icons/iconClock.svg';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';

type MeetingModalSetDatetimeContentProps = {
  onSetDatetime: (values: FormValues) => void;
  loading: boolean;
};

const validate = makeValidateSync(DateTimeSchema);

export const MeetingModalSetDatetimeContent = ({ onSetDatetime, loading }: MeetingModalSetDatetimeContentProps) => {
  const s = useStyles();

  return (
    <>
      <Box pb={2.5} textAlign="center">
        <Typography variant="body1" component="h5" className={s.title}>
          Выберите удобную дату визита в дилерский центр
        </Typography>
      </Box>
      <Box mb={2.5}>
        <Form onSubmit={onSetDatetime} initialValues={{}} validate={validate}>
          {({ handleSubmit, invalid }) => {
            return (
              <>
                <Input
                  useFormattedValue
                  name="date"
                  placeholder="Дата"
                  mask="##.##.####"
                  disabled={loading}
                  endAdornment={
                    <InputAdornment position="end">
                      <CalendarIcon />
                    </InputAdornment>
                  }
                />
                <Input
                  useFormattedValue
                  name="time"
                  placeholder="Время"
                  mask="##:##"
                  disabled={loading}
                  endAdornment={
                    <InputAdornment position="end">
                      <ClockIcon />
                    </InputAdornment>
                  }
                />
                <Box mt={2.5}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={invalid || loading}
                  >
                    <Typography variant="subtitle1" component="span">
                      Подтвердить
                    </Typography>
                  </Button>
                </Box>
              </>
            );
          }}
        </Form>
      </Box>
    </>
  );
};
