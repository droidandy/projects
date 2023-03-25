import React from 'react';
import { useTranslation } from 'react-i18next';
import { last } from 'remeda';
import { ArrowIcon } from 'src/components/ArrowIcon';
import { getNewProjectState } from '../../interface';
import {
  ProjectDetailsIcon,
  UserManagementIcon,
  ProjectPhasesIcon,
  ProjectResourcesIcon,
  ProjectRisksIcon,
  ChangeManagementIcon,
  ReviewSubmitIcon
} from '../../../icons';
import { HeaderItem } from './HeaderItem';
import { headerItems, stepNum, Colors } from './Const';
import { Content, Arrow } from './style';

export const HeaderView = () => {
  const { t } = useTranslation();
  const { currentStep } = getNewProjectState.useState()

  const headerIconMap: any = {
    'project-details': ProjectDetailsIcon,
    'user-management': UserManagementIcon,
    'project-phases': ProjectPhasesIcon,
    'project-resources': ProjectResourcesIcon,
    'project-risks': ProjectRisksIcon,
    'change-management': ChangeManagementIcon,
    'review-submit': ReviewSubmitIcon,
  }

  return (
    <Content>
      {
        headerItems.map((item) => {
          const Icon = headerIconMap[item.type];
          const color = stepNum[item.type] <= stepNum[currentStep] ? Colors.blue : Colors.gray;
          return (
            <React.Fragment key={item.id}>
              <HeaderItem
                text={t(item.str)}
                color={color}
              >
                <Icon color={color} />
              </HeaderItem>
              {item !== last(headerItems) && (
                <Arrow>
                  <ArrowIcon direction="left" color={color} />
                </Arrow>
              )}
            </React.Fragment>
          )
        })
      }
    </Content>
  );
};
