import { useCallback, useContext } from 'react';

import { StepContainerContext } from '~/components/StepContainer/types';

export const useBackgroundJob = (): (jobName: string, jobArgs: any) => void => {
  const { scState } = useContext(StepContainerContext);
  const { backgroundJobs } = scState;

  const runJob = useCallback((
    jobName: string,
    jobArgs: any,
  ) => {
    if (backgroundJobs) {
      const fn = backgroundJobs[jobName];
      fn?.(jobArgs);
    }
  }, [backgroundJobs]);

  return runJob;
};
