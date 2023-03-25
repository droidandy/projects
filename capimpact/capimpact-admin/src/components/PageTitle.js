import React from 'react';

const PageTitle = ({ title, subtitle }) => (
  <div className="page-title h3 text-left mt-3">
    <span className="text">{title}</span>
    {subtitle && <React.Fragment>{subtitle}</React.Fragment>}
  </div>
);

export default PageTitle;
