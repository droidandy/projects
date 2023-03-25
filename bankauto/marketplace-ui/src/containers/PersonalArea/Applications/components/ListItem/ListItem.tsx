import React, { FC } from 'react';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import {
  C2cApplicationShort,
  InstalmentApplicationShort,
  VehicleApplicationShort,
  SimpleCreditApplicationShort,
  APPLICATION_TYPE,
} from '@marketplace/ui-kit/types';
import { InstalmentContent, VehicleContent, C2cContent, CreditContent } from './components';
import { useStyles } from './ListItem.styles';

type ApplicationShort =
  | VehicleApplicationShort
  | InstalmentApplicationShort
  | C2cApplicationShort
  | SimpleCreditApplicationShort;

interface Props {
  application: ApplicationShort;
}

const listItemMap = {
  [APPLICATION_TYPE.VEHICLE]: (application: ApplicationShort) => (
    <VehicleContent application={application as VehicleApplicationShort} />
  ),
  [APPLICATION_TYPE.INSTALMENT]: (application: ApplicationShort) => (
    <InstalmentContent application={application as InstalmentApplicationShort} />
  ),
  [APPLICATION_TYPE.CREDIT]: (application: ApplicationShort) => (
    <CreditContent application={application as SimpleCreditApplicationShort} />
  ),
  [APPLICATION_TYPE.C2C]: (application: ApplicationShort) => (
    <C2cContent application={application as C2cApplicationShort} />
  ),
};

function getApplicationType(application: ApplicationShort) {
  if (application.vehicle) {
    return APPLICATION_TYPE.VEHICLE;
  }

  if (application.instalment && application.credit) {
    return APPLICATION_TYPE.INSTALMENT;
  }

  if (application.simpleCredit) {
    return APPLICATION_TYPE.CREDIT;
  }

  if (application.c2c && application.credit) {
    return APPLICATION_TYPE.C2C;
  }

  return null;
}

const ListItem: FC<Props> = ({ application }) => {
  const { root } = useStyles();
  const { isMobile } = useBreakpoints();
  const applicationType = getApplicationType(application);

  return applicationType ? (
    <>
      {!isMobile ? (
        <Box borderRadius="1rem" className={root}>
          <Box display="flex" justifyContent="space-between" flexWrap="nowrap">
            {listItemMap[applicationType!](application)}
          </Box>
        </Box>
      ) : (
        <Box borderRadius="0.5rem" className={root}>
          <Box display="flex" flexDirection="column" p={2.5}>
            {listItemMap[applicationType!](application)}
          </Box>
        </Box>
      )}
    </>
  ) : null;
};

export { ListItem };
