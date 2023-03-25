import React from 'react';

export default function WherePacketsMailedTitle(props) {
  const client = props.client; // eslint-disable-line react/prop-types
  return (
    <div>
      Should enrollment packets be mailed to Address:
      <div style={{ fontWeight: 400, marginTop: 5 }}>
        {client.address}{client.address ? ',' : ''} {client.city}{client.city ? ',' : ''} {client.state}{client.state ? ',' : ''} {client.zip}?
      </div>
    </div>
  );
}
