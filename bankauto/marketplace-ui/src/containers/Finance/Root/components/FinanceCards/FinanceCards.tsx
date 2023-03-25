import React from 'react';
import { ContainerWrapper } from '@marketplace/ui-kit';
import { FinanceCardList } from 'components';
import { MainPageSection } from 'containers/Finance/Root/types/MainPageSection';
import { useStyles } from './FinanceCards.styles';

const FinanceCards = ({ items }: { items: MainPageSection[] }) => {
  const cards = items.map((card) => ({
    title: card.mainText,
    subTitle: card.additionalText,
    link: card.link,
    icon: (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          // eslint-disable-next-line @typescript-eslint/naming-convention
          __html: card.svgIcon,
        }}
      />
    ),
  }));

  const styles = useStyles();
  return (
    <ContainerWrapper className={styles.cards}>
      <FinanceCardList list={cards} />
    </ContainerWrapper>
  );
};

export { FinanceCards };
