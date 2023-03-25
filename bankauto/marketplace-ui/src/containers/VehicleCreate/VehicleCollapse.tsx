import React, { FC, useMemo, useState } from 'react';
import Button from '@marketplace/ui-kit/components/Button';
import Typography from '@marketplace/ui-kit/components/Typography';
import { FormControlBlock } from 'components/FormControlBlock';
import { EquipmentSchema, IdentitySchema } from './FieldSet';
import { CollapseWrapper } from './CollapseWrapper';
import { VehicleInfo } from './VehicleInfo';
import { FormSpyValidation } from './FormSpyValidation';

const collapseValidationSchema = IdentitySchema.concat(EquipmentSchema);

export interface VehicleCollapseProps {
  collapsed?: boolean;
}

export const VehicleCollapse: FC<VehicleCollapseProps> = ({ children, collapsed }) => {
  const [expanded, setExpanded] = useState(!collapsed);
  const [openedManually, setOpenedManually] = useState<boolean>(false);

  const [ExpandIcon, expandIconProps] = useMemo(
    () =>
      [
        <Button variant="text" color="primary">
          <Typography variant="h5" color="primary">
            Редактировать
          </Typography>
        </Button>,
        {
          onClick: () => {
            setExpanded(true);
            setOpenedManually(true);
          },
        },
      ] as const,
    [],
  );

  return (
    <>
      {!openedManually ? (
        <FormSpyValidation schema={collapseValidationSchema} onValid={() => setExpanded(() => false)} />
      ) : null}
      <CollapseWrapper
        header={
          <FormControlBlock show={!expanded} scrollDirection="top" useScroll={!collapsed}>
            <VehicleInfo />
          </FormControlBlock>
        }
        expandIcon={ExpandIcon}
        IconButtonProps={expandIconProps}
        expanded={expanded}
      >
        {children}
      </CollapseWrapper>
    </>
  );
};
