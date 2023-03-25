import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import CodeImage from './CodeImage';

const Error404 = () => {
  const { appId } = useParams();

  const redirectLink = appId ? `/apps/${appId}/dashboard` : '/';

  return (
    <div className="not-found">
      <div className="not-found_image">
        <CodeImage />
      </div>
      <h2 className="not-found_subtitle">Sorry, we can’t find that page</h2>
      <button className="button button_blue not-found_redirect-button">
        <NavLink
          to={redirectLink}
          className="not-found_redirect-button"
        >
          Back to Homepage
        </NavLink>
      </button>
    </div>
  );
};

export default Error404;
