import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/user';
import { useComparisonIds } from 'store/comparisonIds';
import { getCookieImpersonalization } from 'helpers/authCookies';

export const ComparisonLoader: FC = () => {
  const { initial, fetchComparisonIds, setData } = useComparisonIds();
  const user = useSelector(selectUser);
  const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());

  useEffect(() => {
    if (!initial && isAuthorized) {
      fetchComparisonIds();
    }
  }, [initial, isAuthorized, setData, fetchComparisonIds]);

  return null;
};
