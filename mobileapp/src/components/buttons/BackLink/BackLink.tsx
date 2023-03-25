import * as React from 'react';
import { Link, LinkProps } from '../Link/Link';

export const BackLink = (props: Omit<LinkProps, 'link'>) => {
  return <Link {...props} link="back" />;
};
