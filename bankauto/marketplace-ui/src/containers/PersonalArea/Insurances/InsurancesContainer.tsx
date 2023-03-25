import React, { useEffect, useState } from 'react';
import { Insurance } from '@marketplace/ui-kit/types';
import { Typography } from '@marketplace/ui-kit';
import { getInsurances } from 'api/insurance';
import Wrapper from 'components/Wrapper';
import { EmptyState, Link } from 'components';
import { Hero, PolicyItem } from './components';
import { useStyles } from './InsurancesContainer.styles';

export const InsurancesContainer = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [insurances, setInsurances] = useState<Insurance[]>([]);

  const s = useStyles();

  useEffect(() => {
    const fetchInsuranceList = async () => {
      setIsLoading(true);
      try {
        const { data } = await getInsurances();
        setInsurances(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchInsuranceList();
  }, []);

  return (
    <Wrapper loading={isLoading}>
      <Hero />
      {insurances.length ? (
        <div className={s.contentContainer}>
          {insurances.map((insurance) => (
            <PolicyItem key={insurance.id} item={insurance} />
          ))}
        </div>
      ) : (
        !isLoading && (
          <EmptyState
            classNames={{ container: s.container }}
            description="Нет страховых полисов."
            primaryAction={
              <Link href="/osago" variant="subtitle1" align="center" target="_blank">
                Оформить страховой полис
              </Link>
            }
          />
        )
      )}
    </Wrapper>
  );
};
