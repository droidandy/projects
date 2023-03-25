import React from 'react';
import { FormModal } from 'lib/form';

import { deleteIndustryAction } from 'api/actions';

const IndustryDelete = ({ industry = {}, ...props }) => {
  return (
    <FormModal
      title="Delete Industry"
      action={[deleteIndustryAction]}
      btnSubmitLabel="Delete"
      {...props}
    >
      {() => (
        <React.Fragment>
          <p>Are you sure you want to delete "{industry.name}"</p>
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default IndustryDelete;
