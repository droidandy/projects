import React from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FormModal } from 'lib/form';
import { CheckboxesField } from 'lib/form/fields';
import { Badge } from 'reactstrap';

import { getValueDriverAction, getKpilibsAction, saveValueDriverAction } from 'api/actions';
import { updateValueDriverSchema } from 'schemas';
import { useQuery } from 'react-fetching-library';

const ValueDriverKpis = props => {
  const match = useRouteMatch();
  const history = useHistory();
  const { industryId } = match.params;
  const { loading: l1, payload: kpilibs = [] } = useQuery(getKpilibsAction(match.params));
  const loading = l1;

  const goBack = () => history.push(`/valuedrivers/${industryId}`);

  return (
    !loading && (
      <FormModal
        title="Update ValueDriver"
        query={[getValueDriverAction]}
        action={[saveValueDriverAction]}
        validationSchema={updateValueDriverSchema}
        btnSubmitLabel="Save"
        size="xl"
        redirect={false}
        onComplete={goBack}
        onCancel={goBack}
        {...props}
      >
        {({ values: capability }) => {
          const kpis = Array.from((capability && capability.kpis) || []).map(id =>
            parseInt(id, 10)
          );

          return (
            <div className="row">
              <div className="col-6">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-4 text-right">
                        <strong>ID:</strong>
                      </div>
                      <div className="col-8">{capability.id}</div>
                      <div className="col-4 text-right">
                        <strong>Name:</strong>
                      </div>
                      <div className="col-8">{capability.name}</div>
                      <div className="col-4 text-right">
                        <strong>KPIs:</strong>
                      </div>
                      <div className="col-12">
                        {kpilibs
                          .filter(k => kpis.includes(k.id))
                          .map(it => (
                            <div key={it.id}>
                              <Badge
                                color="primary"
                                className="mr-2"
                                style={{ whiteSpace: 'pre-wrap' }}
                              >
                                {it.label}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <CheckboxesField
                  name="kpis"
                  label="KPIs"
                  options={kpilibs.map(it => ({ label: it.label, value: String(it.id) }))}
                />
              </div>
            </div>
          );
        }}
      </FormModal>
    )
  );
};

export default ValueDriverKpis;
