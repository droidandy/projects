/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { API } from 'aws-amplify';
import { useState, useEffect, useCallback } from 'react';

import { APItypes } from '~/amplify/types';

export interface BaseResponse {}

export const useFetch = (
  url: string,
  apiName: APItypes = APItypes.main,
): [
    {
      response: Array<BaseResponse | string>;
      error: string | null;
      isLoading: boolean;
    },
    (options?: Record<string, unknown>) => void,
  ] => {
  const [response, setResponse] = useState<Array<BaseResponse>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({});

  const doFetch = useCallback((fetchOptions = {}) => {
    setOptions(fetchOptions);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const fetchData = async () => {
      try {
        const res = await API.get(apiName, url, options);
        setResponse(res);
      } catch (err) {
        const data = err.response ? err.response.data : 'Server error';
        setError(data);
      }
      setIsLoading(false);
    };

    fetchData().then(
      () => {},
      () => {},
    );
  }, [isLoading, options, url]);

  return [{ response, error, isLoading }, doFetch];
};

export const usePost = (
  url: string,
): [
    { response: string | undefined; error: string | null; isLoading: boolean },
    (options?: Record<string, unknown>) => void,
  ] => {
  const [response, setResponse] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({});

  const doFetch = useCallback((fetchOptions = {}) => {
    setOptions(fetchOptions);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const fetchData = async () => {
      try {
        const res = await API.post(APItypes.main, url, options);
        setResponse(res);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const data = err.response?.data || 'Server error';
        setError(data);
      }
      setIsLoading(false);
    };

    fetchData().then(
      () => {},
      () => {},
    );
  }, [isLoading, options, url]);

  return [{ response, error, isLoading }, doFetch];
};
