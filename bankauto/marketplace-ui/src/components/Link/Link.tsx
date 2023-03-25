import React, { FC } from 'react';
import cx from 'classnames';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link';
import { useStyles } from './Link.styles';

type BaseLinkProps = Omit<NextLinkProps, 'href' | 'replace' | 'ref'> & {
  href?: string;
  replaceHistory?: boolean;
};

export type LinkProps = MuiLinkProps<'a', BaseLinkProps> & {
  styleAsButton?: boolean;
  disabled?: boolean;
};

export const Link: FC<LinkProps> = ({
  children,
  href = '#',
  as,
  replaceHistory: replace,
  scroll,
  shallow,
  passHref = true,
  prefetch,
  locale,
  underline = 'none',
  className,
  styleAsButton,
  disabled = false,
  style,
  ...rest
}) => {
  const s = useStyles();
  if (disabled)
    return (
      <div style={style} className={className}>
        {children}
      </div>
    );
  return (
    <NextLink
      {...{
        href,
        as,
        replace,
        scroll,
        shallow,
        passHref,
        prefetch,
        locale,
      }}
    >
      <MuiLink underline={underline} className={cx(className, { [s.button]: styleAsButton })} style={style} {...rest}>
        {children}
      </MuiLink>
    </NextLink>
  );
};
