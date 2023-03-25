import React from 'react';
import { FormModal } from 'lib/form';

import { getKpilibAction, deleteKpilibAction } from 'api/actions';

const KpilibDelete = props => {
  return (
    <FormModal
      title="Delete Kpilib"
      query={[getKpilibAction]}
      action={[deleteKpilibAction]}
      btnSubmitLabel="Delete"
      {...props}
    >
      {({ values: doc }) => (
        <React.Fragment>
          <p>Are you sure you want to delete "{doc.label}"</p>
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default KpilibDelete;
