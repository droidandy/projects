import React, { FC, useMemo } from 'react';
import { Box, Typography } from '@material-ui/core';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { Condition, ConditionData, ConditionTree as IConditionTree, ConditionBranchName } from '../../types/Condition';
import { ConditionButton } from './ConditionButton';
import { useStyles } from './ConditionTree.styles';

interface Props {
  title: string;
  branchName: ConditionBranchName;
  changeConditionTree: (condition: Condition, branchName: ConditionBranchName) => void;
  conditionTree: IConditionTree;
  conditions: ConditionData[];
}

const ConditionBranch: FC<Props> = ({ title, branchName, changeConditionTree, conditionTree, conditions }) => {
  const styles = useStyles();
  const { isMobile } = useBreakpoints();
  const buttons = useMemo(
    () =>
      conditions.map((condition) => {
        const isSelected = conditionTree[branchName] === condition.type;
        const handlerClick = (selectedCondition: Condition) => changeConditionTree(selectedCondition, branchName);
        return (
          <ConditionButton key={condition.type} condition={condition} active={isSelected} handlerClick={handlerClick} />
        );
      }),
    [branchName, changeConditionTree, conditionTree, conditions],
  );

  return (
    <ContainerWrapper className={styles.branch} pb={isMobile ? 2.5 : 8} pr={2.5} pl={2.5}>
      <Typography align="center" variant={isMobile ? 'h4' : 'h2'} className={styles.title}>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection={isMobile ? 'column' : 'row'}>
        {buttons}
      </Box>
    </ContainerWrapper>
  );
};

export { ConditionBranch };
