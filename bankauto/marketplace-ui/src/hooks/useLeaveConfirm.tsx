import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

type RouterError = Error & {
  cancelled: boolean;
};

interface Props {
  allowedRoutes?: string[];
  isActive?: boolean;
  message?: string;
}

const defaultMessage = 'Возможно, внесенные изменения не сохранятся. Вы уверены, что хотите покинуть страницу?';

export const useLeaveConfirm = ({ allowedRoutes, message = defaultMessage, isActive = true }: Props) => {
  const router = useRouter();

  const handleRouteChange = useCallback(
    (url: string) => {
      if (!allowedRoutes || !allowedRoutes.find((route) => url.includes(route))) {
        if (window && !window.confirm(message)) {
          const newErr = new Error('Abort route') as RouterError;
          newErr.cancelled = true;
          throw newErr;
        }
      }
    },
    [allowedRoutes, message],
  );

  useEffect(() => {
    if (isActive) {
      if (window) {
        window.onbeforeunload = () => {
          return false;
        };
      }
      router.events.on('beforeHistoryChange', handleRouteChange);
    } else {
      if (window) window.onbeforeunload = null;
      router.events.off('beforeHistoryChange', handleRouteChange);
    }

    return () => {
      if (isActive) {
        if (window) window.onbeforeunload = null;
        router.events.off('beforeHistoryChange', handleRouteChange);
      }
    };
  }, [isActive, handleRouteChange]);
};
