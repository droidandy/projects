import { get } from 'lodash';
import React from 'react';

import * as Styles from './bankAccountStyles';

import { fallbackLogo } from '~/assets/images';
import { AccountProps } from '~/types/account';

type Props = {
  account: AccountProps;
};

export const BankAccount = ({ account }: Props): JSX.Element => (
  <>
    <Styles.Container>
      <Styles.Logo source={{ uri: `data:image/jpeg;base64,${account.logo || fallbackLogo}` }} />
      <Styles.Title>
        {account.institutionName}
        {' - '}
        {account.accountNumber}
      </Styles.Title>
    </Styles.Container>

    <Styles.Amount>
      Available to withdraw {get(account, 'funds.available.formattedCurrency', 'Not Available')}
    </Styles.Amount>
  </>
);
