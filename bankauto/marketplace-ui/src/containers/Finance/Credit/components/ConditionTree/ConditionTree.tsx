import React, { FC, Dispatch, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@material-ui/core';
import { Condition, ConditionTree as IConditionTree, ConditionBranchName, CreditRoutes } from '../../types/Condition';
import { conditionsData as data } from '../../constants/conditions';
import { useStyles } from './ConditionTree.styles';
import { ConditionBranch } from './ConditionBranch';

interface Props {
  conditionTree: IConditionTree;
  setConditionTree: Dispatch<React.SetStateAction<IConditionTree>>;
  lastCondition: Condition | null;
}

const creditRoutes: Record<CreditRoutes, Condition> = {
  [CreditRoutes.JUST_MONEY]: Condition.JUST_MONEY,
  [CreditRoutes.AUTHORIZED_DEALER]: Condition.AUTHORIZED_DEALER,
  [CreditRoutes.C2C]: Condition.C2C,
};

const resetPreviousBranches = (conditionTree: IConditionTree, selectedBranchName: ConditionBranchName) => {
  const newTree = { ...conditionTree };
  Object.keys(newTree).forEach((branchName) => {
    if (branchName > selectedBranchName) {
      newTree[branchName as ConditionBranchName] = null;
    }
  });
  return newTree;
};

const ConditionTree: FC<Props> = ({ conditionTree, setConditionTree, lastCondition }) => {
  const styles = useStyles();
  const { query, push, route } = useRouter();
  const mainPath = route.split('/').slice(0, -1).join('/');
  const changeConditionTree = useCallback(
    (condition: Condition, branchName: ConditionBranchName) => {
      const newRoute = Object.keys(creditRoutes).find(
        (creditRoute) => creditRoutes[creditRoute as CreditRoutes] === condition,
      );
      push(
        {
          pathname: `${mainPath}/${newRoute || ''}`,
        },
        undefined,
        { shallow: true, scroll: false },
      );
      setConditionTree({ ...resetPreviousBranches(conditionTree, branchName), [branchName]: condition });
    },
    [push, mainPath, setConditionTree, conditionTree],
  );

  useEffect(() => {
    const routeCondition = creditRoutes[query?.creditSubType?.[0] as CreditRoutes];
    if (routeCondition != null) {
      const newConditionTree: IConditionTree = {
        [ConditionBranchName.FIRST_BRANCH]: null,
        [ConditionBranchName.SECOND_BRANCH]: null,
      };
      if (routeCondition === Condition.JUST_MONEY) {
        newConditionTree[ConditionBranchName.FIRST_BRANCH] = Condition.JUST_MONEY;
      } else {
        newConditionTree[ConditionBranchName.FIRST_BRANCH] = Condition.BUYING_CAR;
        if (routeCondition === Condition.C2C || routeCondition === Condition.AUTHORIZED_DEALER) {
          newConditionTree[ConditionBranchName.SECOND_BRANCH] = routeCondition;
        }
      }
      setConditionTree(newConditionTree);
    }
  }, [query?.creditSubType, setConditionTree]);

  return (
    <Box className={styles.root}>
      <ConditionBranch
        title="Нужен кредит на покупку автомобиля?"
        branchName={ConditionBranchName.FIRST_BRANCH}
        changeConditionTree={changeConditionTree}
        conditionTree={conditionTree}
        conditions={[data[Condition.BUYING_CAR], data[Condition.JUST_MONEY]]}
      />
      {/*{!!lastCondition && lastCondition >= Condition.BUYING_CAR && (*/}
      {/*  <ConditionBranch*/}
      {/*    title="Где планируете покупать?"*/}
      {/*    branchName={ConditionBranchName.SECOND_BRANCH}*/}
      {/*    changeConditionTree={changeConditionTree}*/}
      {/*    conditionTree={conditionTree}*/}
      {/*    conditions={[data[Condition.AUTHORIZED_DEALER], data[Condition.C2C]]}*/}
      {/*  />*/}
      {/*)}*/}
    </Box>
  );
};

export { ConditionTree };
