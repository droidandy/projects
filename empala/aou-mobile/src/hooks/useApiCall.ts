import { useState, useEffect, useCallback } from 'react';

export const useApiCall = <ArgsT, ResponseT>(apiCall: (data: ArgsT) => Promise<ResponseT>): [
  {
    response: ResponseT | undefined;
    error: string | null;
    isLoading: boolean;
  },
  (data: ArgsT) => void,
] => {
  const [response, setResponse] = useState<ResponseT>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<ArgsT>();

  const processCall = useCallback((args) => {
    setError(null);
    setData(args);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (!isLoading || !data) {
      return;
    }

    const makeCall = async () => {
      try {
        const resp = await apiCall(data);
        setResponse(resp);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    makeCall().then(
      () => {},
      () => {},
    );
  }, [isLoading]);

  return [{ response, error, isLoading }, processCall];
};
