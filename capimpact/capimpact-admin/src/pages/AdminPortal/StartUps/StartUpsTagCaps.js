import React, { useState } from 'react';
import { useParams, useRouteMatch, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-fetching-library';
import _ from 'lodash';

import { getStartUpAction, saveStartupAction } from 'api/actions';

import TreeCapabilities from './TreeCapabilities';
import { Button } from 'reactstrap';

const StartUpsTagCapsContainer = () => {
  const { startupId, industryId } = useParams();
  const { loading, payload: startup } = useQuery(getStartUpAction({ startupId }));

  return (
    !loading && (
      <StartUpsTagCaps
        industryId={industryId}
        startup={{
          ...startup,
          id: startup.cid,
          capabilities: _.isEmpty(startup.capabilities) ? [] : startup.capabilities,
        }}
      />
    )
  );
};

const StartUpsTagCaps = ({ startup, industryId }) => {
  const match = useRouteMatch();
  const { mutate: saveStartup, loading: saving } = useMutation(saveStartupAction);
  const [capabilities, setCapabilities] = useState(startup.capabilities || []);

  return (
    <div
      className="startups-caps mb-2 d-flex flex-column justify-content-stretch"
      style={{ minHeight: 'calc(100vh - 280px)' }}
    >
      <div className="row flex-grow-1 align-items-stretch">
        <div className="col-7">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-4 text-right">
                  <strong>ID:</strong>
                </div>
                <div className="col-8">{startup.cid}</div>
                <div className="col-4 text-right">
                  <strong>Name:</strong>
                </div>
                <div className="col-8">{startup.name}</div>
                <div className="col-4 text-right">
                  <strong>Description:</strong>
                </div>
                <div className="col-8">{startup.description}</div>
                <div className="col-4 text-right">
                  <strong>Capabilities:</strong>
                </div>
                <div className="col-8">
                  {Array.from(capabilities || []).map(c => (
                    <span key={c.name} className="badge badge-primary mr-2">
                      {c.name}
                    </span>
                  ))}
                </div>
                <div className="offset-4 col-8">
                  <div className="my-3">
                    <Button
                      type="button"
                      color="primary"
                      onClick={() =>
                        saveStartup({
                          startupId: startup.id,
                          data: { cid: startup.id, capabilities },
                        })
                      }
                      disabled={saving}
                    >
                      {saving ? <i className="fas fa-spinner fa-spin" /> : <span>Save</span>}
                    </Button>
                    <Button
                      tag={Link}
                      color="link"
                      to={`${match.url
                        .split('/')
                        .slice(0, 3)
                        .join('/')}`}
                      disabled={saving}
                    >
                      Return to List
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-5 h-100">
          <div className="tree-capabilities">
            <TreeCapabilities
              startup={startup}
              industryId={industryId}
              selectedNodes={capabilities}
              setSelectedNodes={setCapabilities}
              style={{ height: '100%', maxHeight: '100%' }}
              isVirtualized={true}
              rowHeight={40}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartUpsTagCapsContainer;
