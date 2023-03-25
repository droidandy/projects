/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'semantic-ui-react';

import messages from './messages';

export default function NotFound() {
  return (
    <article>
      <h1>
        <FormattedMessage {...messages.header} />
      </h1>
      <Button>
        Click Here
      </Button>
    </article>
  );
}
