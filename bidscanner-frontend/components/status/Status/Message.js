// @flow
import React from 'react';
import { Link } from 'next-url-prettifier';
import StyledLink from 'components/styled/StyledLink';

import Heading from 'components/styled/Heading';

type MessageProps = {
  title: string,
  subtitle: string,
  linkTo: string,
  linkTitle: string,
};

export default ({ title, subtitle, linkTo, linkTitle }: MessageProps) =>
  <div className="mt-4">
    <div>
      <Heading bold>
        {title}
      </Heading>
    </div>
    <div className="mt-2 d-flex justify-content-center">
      {subtitle}
      <StyledLink bold ml="0.5em">
        <Link href={`/${linkTo}`}>
          <a>
            {linkTitle}
          </a>
        </Link>
      </StyledLink>
    </div>
  </div>;
