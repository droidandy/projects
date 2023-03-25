import React, { FC, memo, useState } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Divider } from '@material-ui/core';
import { VehicleNew, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { VehicleInstalmentItem } from 'types/Vehicle';
import { AccordionEquipments, Reviews, AccordionTab } from './components';
import { useStyles } from './VehicleAccordion.styles';

type TabsState = {
  equipments: boolean;
  comments: boolean;
};

const clearActiveTabs: TabsState = {
  equipments: false,
  comments: false,
};

type Props = { vehicle: VehicleNew | VehicleInstalmentItem | null };

export type ActionType = 'equipments' | 'comments';

export const VehicleAccordion: FC<Props> = memo(({ vehicle }) => {
  const { tabsContainer } = useStyles();
  const { isMobile } = useBreakpoints();
  const options = vehicle ? Object.entries(vehicle.options) : null;
  const optionsLength = options?.length || 0;
  const [tabsStatus, setTabsStatus] = useState<TabsState>({
    equipments: Boolean(optionsLength),
    comments: !Boolean(optionsLength),
  });

  const chooseTab = (tabName: ActionType) => () => {
    if (!tabsStatus[tabName]) {
      setTabsStatus({ ...clearActiveTabs, [tabName]: true });
    }
  };

  return (
    <Box>
      <Box className={tabsContainer}>
        <Box display="flex" alignItems="center" flexWrap="nowrap">
          {optionsLength ? (
            <AccordionTab
              title={vehicle!.type === VEHICLE_TYPE.NEW ? 'Комплектация' : 'Опции'}
              handleClick={chooseTab('equipments')}
              isActive={tabsStatus.equipments}
              disabled={!optionsLength}
            />
          ) : null}

          <AccordionTab title="Отзывы" handleClick={chooseTab('comments')} isActive={tabsStatus.comments} />
        </Box>
        {tabsStatus.equipments && vehicle!.type === VEHICLE_TYPE.NEW && (
          <>
            <Divider />
            <Box pt={5} pb={2}>
              <Typography variant={isMobile ? 'h4' : 'h3'} component="span">
                {vehicle!.equipment}
              </Typography>
            </Box>
          </>
        )}
      </Box>

      <Box>
        {tabsStatus.equipments && <AccordionEquipments options={options} />}
        {tabsStatus.comments && <Reviews />}
      </Box>
    </Box>
  );
});
