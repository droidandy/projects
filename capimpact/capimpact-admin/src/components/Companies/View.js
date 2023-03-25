import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import { Form } from 'lib/form';

import { getCompanyAction } from 'api/actions';

import Spinner from 'components/Spinner';
import CompanyTitle from './CompanyTitle';
import BuViewTable from './BuViewTable';
import Filters from './Filters';

import classes from './styles.module.scss';

export default () => {
  const match = useRouteMatch();
  const { loading, payload: company = {} } = useQuery(getCompanyAction(match.params));

  return loading ? (
    <Spinner />
  ) : (
    <div className={classes.companyView}>
      <Form
        initialValues={{
          industryId: company.industry_id,
          companyId: company.id,
          lense: 'all',
        }}
      >
        {({ values }) => {
          return (
            <div className="row no-gutters">
              <div className="col-9">
                <div className={classes.buContent}>
                  <CompanyTitle company={company} />
                  <BuViewTable company={company} allFilters={values} />
                </div>
              </div>
              <div className="col-3">
                <div className={classes.buFilter}>
                  <Filters company={company} values={values} />
                </div>
              </div>
            </div>
          );
        }}
      </Form>
    </div>
  );
};
