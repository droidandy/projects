import React from 'react';
import ShowMoreText from 'react-show-more-text';

import { CheckboxTable } from 'components/Table';

/*
Industry ID
parseCsv.js:8 Company.ID
parseCsv.js:8 Company.Name
parseCsv.js:8 Year.Founded
parseCsv.js:8 First.Financing.Date
parseCsv.js:8 First.Financing.Size
parseCsv.js:8 Last.Financing.Date
parseCsv.js:8 Last.Financing.Size
parseCsv.js:8 Primary.Industry.Group
parseCsv.js:8 Primary.Industry.Code
parseCsv.js:8 Verticals
parseCsv.js:8 Description
parseCsv.js:8 Revenue
parseCsv.js:8 capabilities
*/

const UpdateDataTable = ({ data }) => {
  return (
    <CheckboxTable
      remote={false}
      data={data}
      columns={[
        {
          Header: 'ID',
          id: 'Company.ID',
          accessor: row => row['Company.ID'],
        },
        {
          Header: 'Name',
          id: 'Company.Name',
          accessor: row => row['Company.Name'],
        },
        {
          Header: 'Description',
          accessor: 'Description',
          width: 300,
          Cell: ({ value: description }) => (
            <ShowMoreText lines={2}>{description || ''}</ShowMoreText>
          ),
        },
        {
          Header: 'Capabilities',
          accessor: 'capabilities',
        },
      ]}
    />
  );
};

export default UpdateDataTable;
