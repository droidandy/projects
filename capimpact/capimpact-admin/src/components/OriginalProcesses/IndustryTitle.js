import React from 'react';

const IndustryTitle = ({ industry = {} }) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <span className="h2 text-center my-3 mr-3">{industry.name}</span>
    </div>
  );
};

export default IndustryTitle;
