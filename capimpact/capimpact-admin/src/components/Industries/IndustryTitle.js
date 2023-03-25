import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Button } from 'reactstrap';

const IndustryTitle = ({ industry = {} }) => {
  const { url } = useRouteMatch();

  return (
    <div className="d-flex justify-content-center align-items-baseline">
      <span className="h2 text-center my-3 mr-3 d-flex flex-column justify-content-center align-items-center">
        <span>{industry.name}</span>
        {industry.id && <span style={{ fontSize: 14 }}>Cap CDS ID: {industry.id}</span>}
      </span>
      <Button tag={Link} color="link" title="Clone Industry" to={`${url}/clone-industry`}>
        <i className="fa fa-copy" />
      </Button>
      <Button tag={Link} color="link" title="Rename" to={`${url}/update-industry`}>
        <i className="fa fa-edit" />
      </Button>
      <Button
        tag={Link}
        className="text-danger"
        color="link"
        title="Delete Industry"
        to={`${url}/delete-industry`}
      >
        <i className="fa fa-trash" />
      </Button>
    </div>
  );
};

export default IndustryTitle;
