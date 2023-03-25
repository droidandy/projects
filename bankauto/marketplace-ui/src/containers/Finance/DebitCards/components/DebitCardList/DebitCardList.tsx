import { useBreakpoints } from '@marketplace/ui-kit';
import { Box } from '@material-ui/core';
import React, { FC } from 'react';
import { DebitCardSmall } from 'store/types';
import { DebitCardItem } from './DebitCardItem';

interface Props {
  debitCardList: DebitCardSmall[];
}

const DebitCardList: FC<Props> = ({ debitCardList }) => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      {debitCardList.map((item) => (
        <Box mb={isMobile ? 1.25 : 7.5} key={item.id}>
          <DebitCardItem item={item} />
        </Box>
      ))}
    </>
  );
};

export { DebitCardList };
