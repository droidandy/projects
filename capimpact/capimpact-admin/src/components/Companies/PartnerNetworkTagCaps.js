import React, { useState } from 'react';
import { useParams, useRouteMatch, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-fetching-library';

import { saveCompanyCapabilitiesAction, getCompanyPartnerNetworkAction } from 'api/actions';

import TreeCapabilities from './TreeCapabilities';
import { Button } from 'reactstrap';

const PartnerNetworksTagCapsContainer = ({ company }) => {
  const { partnerNetworkId } = useParams();
  const queryResponse = useQuery(getCompanyPartnerNetworkAction({ cid: partnerNetworkId }));
  let { loading, payload: partnerNetwork = [] } = queryResponse;

  return !loading && partnerNetwork ? (
    <PartnerNetworksTagCaps
      company={company}
      partnerNetwork={{
        ...partnerNetwork,
        id: partnerNetwork.cid,
        capabilities: Array.from(partnerNetwork.capabilities || []).map(row => {
          const [id, name] = String(row).split(':', 2);
          return { id: +id, name };
        }),
      }}
    />
  ) : null;
};

const PartnerNetworksTagCaps = ({ partnerNetwork, company }) => {
  const match = useRouteMatch();
  const { mutate: saveCompanyCapabilities, loading: saving } = useMutation(
    saveCompanyCapabilitiesAction
  );
  const [capabilities, setCapabilities] = useState(partnerNetwork.capabilities);

  return (
    <div
      className="partner-networks-caps mb-2 d-flex flex-column justify-content-stretch"
      style={{ minHeight: 'calc(100vh - 190px)' }}
    >
      <div className="row flex-grow-1 align-items-stretch">
        <div className="col-7">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-4 text-right">
                  <strong>ID:</strong>
                </div>
                <div className="col-8">{partnerNetwork.cid}</div>
                <div className="col-4 text-right">
                  <strong>Name:</strong>
                </div>
                <div className="col-8">{partnerNetwork.name}</div>
                <div className="col-4 text-right">
                  <strong>Description:</strong>
                </div>
                <div className="col-8">{partnerNetwork.description}</div>
                <div className="col-4 text-right">
                  <strong>Capabilities:</strong>
                </div>
                <div className="col-8">
                  {capabilities && capabilities.length
                    ? Array.from(capabilities || []).map(c => (
                        <span key={c.name} className="badge badge-primary mr-2">
                          {c.name}
                        </span>
                      ))
                    : 'N/A'}
                </div>
                <div className="offset-4 col-8">
                  <div className="my-3">
                    <Button
                      type="button"
                      color="primary"
                      onClick={() => {
                        saveCompanyCapabilities({
                          cid: partnerNetwork.cid,
                          capabilities,
                        });
                      }}
                      disabled={saving}
                    >
                      {saving ? <i className="fas fa-spinner fa-spin" /> : <span>Save</span>}
                    </Button>
                    <Button
                      tag={Link}
                      color="link"
                      to={`${match.url
                        .split('/')
                        .slice(0, 4)
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
              partnerNetwork={partnerNetwork}
              company={company}
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

export default PartnerNetworksTagCapsContainer;
