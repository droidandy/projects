import React, { FC } from 'react';
import { TypographyProps } from '@material-ui/core/Typography';
import { Typography, InfoTooltip } from '@marketplace/ui-kit';
import { useStyles } from '../Contract.styles';

export type TitleProps = { title: string; tooltipText?: string; isSubTitle?: boolean } & TypographyProps;

export const Title: FC<TitleProps> = ({ title, tooltipText, isSubTitle, ...rest }) => {
  const { titleWrapper, tooltipTextColor } = useStyles();
  return (
    <div className={titleWrapper}>
      <Typography variant={isSubTitle ? 'h5' : 'h4'} {...rest}>
        {title}
      </Typography>
      {tooltipText ? (
        <InfoTooltip
          title={
            <Typography variant="body2" className={tooltipTextColor}>
              {tooltipText}
            </Typography>
          }
        />
      ) : null}
    </div>
  );
};
