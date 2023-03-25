import { useState, useEffect, useCallback } from 'react';

type ResendSmsOutput = [boolean, boolean, number, () => void];

const useResendSms = (seconds: number, sent?: boolean): ResendSmsOutput => {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [smsSent, setSmsSent] = useState(!!sent);

  const startInterval = useCallback(() => {
    let limit = seconds;
    setSecondsLeft(limit);
    const interval = setInterval(() => {
      limit -= 1;
      setSecondsLeft(limit);
    }, 1000);
    setTimer(interval);
  }, [seconds]);

  // permanent start
  useEffect(() => {
    if (sent) {
      startInterval();
    }
  }, [sent, startInterval]);

  // clear interval on timer ot component left
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  // clear on timeout
  useEffect(() => {
    if (timer && secondsLeft === 0) {
      setTimer(null);
    }
  }, [timer, secondsLeft]);

  const handleSend = useCallback(() => {
    setSmsSent(true);
    startInterval();
  }, [startInterval]);

  return [smsSent, !!timer, secondsLeft, handleSend];
};

export { useResendSms };
