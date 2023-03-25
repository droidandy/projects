import React from 'react';
import { useTranslation } from 'react-i18next';
import { getManualReportsState } from '../interface';
import { TableView } from 'src/components/TableView';
import styled from 'styled-components';

export const ManualReportsView = () => {
  const { t } = useTranslation();
  const { items, isLoading } = getManualReportsState.useState();

  return (
    <div>
      <TableView
        title={t('Manual Reports')}
        header={<></>}
        isLoading={isLoading}
      >
        <Table>
          <thead>
            <Tr>
              {items.length
                ? items[0].map((el: any, i: number) => {
                    return (
                      <Th key={i}>
                        <ContentWrapper>{t(`${el}`)}</ContentWrapper>
                      </Th>
                    );
                  })
                : null}
            </Tr>
          </thead>
          <tbody>
            {items.map((arr, i) => {
              if (i !== 0) {
                return (
                  <Tr key={i}>
                    {arr.map((el: any, idx: number) => {
                      return (
                        <Td key={idx}>
                          <ContentWrapper>{el ? el : '-'}</ContentWrapper>
                        </Td>
                      );
                    })}
                  </Tr>
                );
              } else return;
            })}
          </tbody>
        </Table>
      </TableView>
    </div>
  );
};

const Table = styled.table`
  display: block;
  height: calc(100vh - 500px);
  max-height: 500px;
  overflow: auto;
`;

const Th = styled.th`
  text-align: right;
  max-width: 300px;
  padding: 20px;
`;

const Td = styled.td`
  padding: 20px;
  max-width: fit-content;
  width: fit-content;
`;

const ContentWrapper = styled.span`
  display: inline-block;
  max-width: 260px;
  width: max-content;
  word-wrap: break-word;
`;

const Tr = styled.tr`
  padding: 20px 30px;
  font-size: 14px;
  background: white;
`;
