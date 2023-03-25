import React, { useState, useEffect } from 'react';
import { Progress } from 'reactstrap';

const ProgressFake = ({ step = 1, interval = 1000, isCompleted = false }) => {
  const [value, setValue] = useState(1);

  useEffect(() => {
    let counter = null;
    if (isCompleted) {
      setValue(100);
      if (counter) clearInterval(counter);
    } else {
      counter = setInterval(() => setValue(value + step), interval);
    }
    return () => {
      clearInterval(counter);
    };
  }, [value, isCompleted, interval, step]);

  return (
    <Progress animated={!isCompleted} value={value} color={isCompleted ? 'success' : 'primary'}>
      {isCompleted ? 'success' : ''}
    </Progress>
  );
};

export default ProgressFake;
