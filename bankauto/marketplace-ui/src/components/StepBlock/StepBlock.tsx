import React, { FC } from 'react';
import { Icon, Typography, useBreakpoints } from '@marketplace/ui-kit';
import cx from 'classnames';
import { Variant } from '@material-ui/core/styles/createTypography';

interface StepIcon {
  component: React.FC<React.SVGProps<SVGSVGElement>>;
  viewBox: string;
}
interface StepBlockClasses {
  root?: string;
  icon?: string;
  content?: string;
  text?: string;
}
interface StepBlockProps {
  icon: StepIcon;
  className?: string;
  classes?: StepBlockClasses;
  text: string;
  textVariant?: Variant | 'inherit';
}

export const StepBlock: FC<StepBlockProps> = ({ icon, className, classes, text, textVariant }) => {
  const { isMobile } = useBreakpoints();
  return (
    <div className={cx(className, classes?.root)}>
      <Icon component={icon.component} viewBox={icon.viewBox} className={classes?.icon} />
      <div className={classes?.content}>
        <Typography variant={isMobile ? 'h5' : textVariant || 'h4'} className={classes?.text}>
          {text}
        </Typography>
      </div>
    </div>
  );
};
