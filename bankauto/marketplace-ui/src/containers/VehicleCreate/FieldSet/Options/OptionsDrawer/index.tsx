import React, { FC, useState } from 'react';
import {
  MobileModalDrawer,
  MobileModalHeader,
  MobileModalContent,
  MobileModalContainer,
  MobileModalFooter,
} from 'components/MobileModalLayout';
import { Button, Typography } from '@marketplace/ui-kit';
import { VehicleFormOptions } from 'types/VehicleFormType';
import { OptionsGroup } from '../OptionsGroup';
import { OptionsDrawerButton } from './OptionsDrawerButton';
import { useStyles, useGroupOptionClasses } from './OptionsDrawer.styles';

interface Props {
  options: VehicleFormOptions;
}

export const OptionsDrawer: FC<Props> = ({ options }) => {
  const s = useStyles();
  const optionGroupClasses = useGroupOptionClasses();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleReset = () => {};

  return (
    <>
      <OptionsDrawerButton onClick={handleOpen} />
      <MobileModalDrawer open={open} onClose={handleClose}>
        <MobileModalHeader
          showActionButton
          actionButtonLabel="Сбросить"
          onClose={handleClose}
          onClickActionButton={handleReset}
        >
          Опции
        </MobileModalHeader>
        <MobileModalContent>
          <MobileModalContainer className={s.contentContainer}>
            {options.map((group) => (
              <OptionsGroup
                classNames={optionGroupClasses}
                key={group.id}
                direction="column"
                gridItemSize={12}
                spacing={0}
                {...group}
              />
            ))}
          </MobileModalContainer>
        </MobileModalContent>
        <MobileModalFooter>
          <Button variant="contained" size="large" color="primary" onClick={handleClose} fullWidth>
            <Typography variant="h5" component="span">
              Применить
            </Typography>
          </Button>
        </MobileModalFooter>
      </MobileModalDrawer>
    </>
  );
};
