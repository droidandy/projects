import React, { FC } from 'react';
import { InputGroup } from '@marketplace/ui-kit';
import { Input } from 'components/Fields';

const EmailBlock: FC = () => {
  return (
    <InputGroup templateAreas={[['email']]}>
      <Input variant="outlined" key="email" area="email" placeholder="Электронная почта" name="email" />
    </InputGroup>
  );
};

export default EmailBlock;
