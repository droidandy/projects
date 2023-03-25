import React, { FC } from 'react';
import NumberFormat from 'react-number-format';
import { Box, Typography } from '@marketplace/ui-kit';

interface Props {
  name: string;
  phone: number;
}

const ContactPerson: FC<Props> = ({ name, phone }) => {
  return (
    <>
      <Box mb="0.625rem">
        <Typography variant="h5" align="center" component="span">
          {name}
        </Typography>
      </Box>
      <Box>
        <a href={`tel:+7${phone}`}>
          <Typography variant="h5" color="textPrimary">
            <NumberFormat value={phone} displayType="text" format="+7 (###) ###-##-##" />
          </Typography>
        </a>
      </Box>
    </>
  );
};

export { ContactPerson };
