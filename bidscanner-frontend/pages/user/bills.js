// @flow
import React from 'react';

import compose from 'recompose/compose';
import withPagination from 'utils/hoc/withPagination';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import MyLayout from 'components/MyLayout';
import MyBills from 'components/bills/Bills/index';

type Props = {
  onPageChange: number => void,
  currentPage: number,
};

const MyBillsPage = ({ onPageChange, currentPage }: Props) =>
  <MyLayout title="My Bills" active="bills">
    <MyBills onPageChange={onPageChange} currentPage={currentPage} />
  </MyLayout>;

export default compose(withPagination(), withData, redirectIfNotLogged)(MyBillsPage);
