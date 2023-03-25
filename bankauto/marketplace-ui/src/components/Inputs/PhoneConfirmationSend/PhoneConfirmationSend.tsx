import React, { FC, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Tooltip } from '@material-ui/core';
import Grid from '@marketplace/ui-kit/components/Grid';
import Typography from '@marketplace/ui-kit/components/Typography';
import { ReactComponent as IconRefresh } from 'icons/iconRefresh.svg';
import { ReactComponent as IconArrowRight } from 'icons/btnArrowRightBlack.svg';
import { ReactComponent as IconError } from 'icons/iconError.svg';
import { useStyles } from './PhoneConfirmationSend.styles';

interface PhoneConfirmationSendProps {
  handleSend: () => void;
  isSent: boolean;
  isConfirmed: boolean;
  area?: string;
  disabled?: boolean;
  error?: string;
}
function getTimeString(time: number): string {
  const date = new Date();
  date.setMinutes(0);
  date.setSeconds(time);
  const m = date.getMinutes();
  const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  return `${m}:${s}`;
}
const PhoneConfirmationSend: FC<PhoneConfirmationSendProps> = ({
  handleSend: handleSendProp,
  isSent,
  area,
  disabled,
  isConfirmed,
  error,
}) => {
  const s = useStyles();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState<number | null>();

  const handleSend = useCallback(() => {
    let limit = 70;
    setTime(limit);

    timer.current = setInterval(() => {
      limit -= 1;
      setTime(limit);
    }, 1000);

    handleSendProp();
  }, [setTime, timer, handleSendProp]);

  useEffect(() => {
    if (timer.current && (time === 0 || error || isConfirmed)) {
      clearInterval(timer.current);
      timer.current = null;
      setTime(null);
    }
  }, [timer, time, error, isConfirmed]);

  const timeString = useMemo<string | undefined>(() => {
    if (time) {
      return getTimeString(time);
    }
    return undefined;
  }, [time]);

  return (
    <div style={{ gridArea: area }} className={s.root}>
      {isConfirmed ? (
        <div className={[s.send, s.disabled].join(' ')}>
          <Typography>Номер подтвержден</Typography>
        </div>
      ) : (
        <>
          {!isSent ? (
            <div
              className={[s.send, disabled ? s.disabled : s.active].join(' ')}
              onClick={() => !disabled && handleSend()}
            >
              <Typography>Получить смс-код</Typography>
            </div>
          ) : (
            <Grid
              container
              alignItems="center"
              spacing={1}
              onClick={() => !timer && handleSend()}
              className={[s.resend, timer ? s.disabled : ''].join(' ')}
            >
              <Grid item>
                <IconRefresh className={s.reloadIcon} />
              </Grid>
              <Grid item xs>
                <Typography>Отправить повторно</Typography>
              </Grid>
              <Grid item className={[s.timer].join(' ')}>
                {error ? (
                  <Tooltip title={error} enterTouchDelay={0} placement="top-end">
                    <div>
                      <IconError />
                    </div>
                  </Tooltip>
                ) : (
                  timeString || <IconArrowRight />
                )}
              </Grid>
            </Grid>
          )}
        </>
      )}
    </div>
  );
};

export default PhoneConfirmationSend;
