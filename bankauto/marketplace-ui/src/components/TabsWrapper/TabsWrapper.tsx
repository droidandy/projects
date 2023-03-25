import React, { FC, memo } from 'react';
import { Tabs } from '@marketplace/ui-kit';
import { TabsProps } from '@material-ui/core';

export type ColorScheme = 'allWhite' | 'whiteRed' | 'blackRed';

export interface Props extends TabsProps {
  colorScheme: ColorScheme;
  tabs: (string | FC)[];
  isNegativeBottom?: boolean;
  addPb?: string | number;
  addPt?: string | number;
  value: number | string;
  handleChange?: (event: React.ChangeEvent<any>, tabindex: any) => void;
}

const TabsWrapperRoot: FC<Props> = ({
  colorScheme,
  tabs,
  addPb,
  addPt,
  isNegativeBottom,
  value,
  handleChange,
  ...rest
}) => {
  const visualProps = (variant: ColorScheme) => {
    switch (variant) {
      case 'allWhite': {
        return {
          colorTabs: 'text.secondary',
          colorTabsActive: 'text.secondary',
          colorTabsIndicator: 'background.paper',
          colorTabsDisabled: 'grey.500',
        };
      }
      case 'whiteRed': {
        return {
          colorTabs: 'grey.100',
          colorTabsActive: 'common.white',
          colorTabsIndicator: 'primary.main',
          colorTabsDisabled: 'grey.500',
        };
      }
      case 'blackRed': {
        return {
          colorTabs: 'text.primary',
          colorTabsActive: 'primary.main',
          colorTabsIndicator: 'primary.main',
          colorTabsDisabled: 'grey.500',
        };
      }
      default:
        return {
          colorTabs: 'text.secondary',
          colorTabsActive: 'text.secondary',
          colorTabsIndicator: 'primary.main',
          colorTabsDisabled: 'grey.500',
        };
    }
  };
  return (
    <Tabs
      tabs={tabs}
      value={value}
      isNegativeBottom={isNegativeBottom}
      addPt={addPt}
      addPb={addPb}
      handleChange={handleChange}
      {...visualProps(colorScheme)}
      {...rest}
    />
  );
};

const TabsWrapper = memo(TabsWrapperRoot);
export { TabsWrapper };
