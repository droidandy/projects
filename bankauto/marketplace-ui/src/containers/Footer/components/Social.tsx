import React, { FC, Fragment } from 'react';
import { Grid, Icon } from '@material-ui/core';

type SocialIcon = {
  icon: React.FunctionComponent<any>;
  href: string;
};
type Props = {
  icons: SocialIcon[];
  className?: string;
};

export const Social: FC<Props> = ({ icons, className }) => {
  return (
    <Grid container spacing={2} justify="flex-start" wrap="wrap" alignItems="center">
      {icons.map(({ href, icon }, index) => (
        <Fragment key={href}>
          {index === 5 ? <Grid item xs={12} style={{ padding: 0 }} /> : null}
          <Grid item className={className}>
            <a href={href} target="_blank" rel="noopener" style={{ lineHeight: '1rem' }}>
              <Icon component={icon} viewBox="0 0 32 32" style={{ fontSize: '2rem' }} />
            </a>
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
};
