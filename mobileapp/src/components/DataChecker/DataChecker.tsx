import React, { PropsWithChildren } from 'react';
import { Text } from 'react-native';
import { ApolloError } from 'apollo-client';
import { getErrorFromGQLError } from '../../helpers/error';
import { DataContainer } from '../../containers/layouts/DataContainer/DataContainer';
import { Loader } from '../Loader/Loader';
import { Error } from '../text/Error/Error';
import { styles } from './DataChecker.styles';
import { RefetchButton } from './refetch-button';

interface Props extends PropsWithChildren<{}> {
  loading?: boolean;
  data?: any;
  loadingLabel: string;
  noDataLabel: string;
  refetchLabel?: string;
  error?: string | Error | ApolloError;
  useSimpleContainer?: boolean;
  footerTopAdornment?: React.ReactNode;
  hideRefetchWhenNoData?: boolean;

  refetch?(...args: any[]): Promise<any>;
}

function getErrorMessage(error: string | Error | ApolloError): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof ApolloError) {
    if (error.graphQLErrors[0]) {
      return getErrorFromGQLError(error.graphQLErrors[0]);
    }

    if (error.networkError !== null) {
      return 'Не удалось соединиться с сервером, проверьте соединение и повторите попытку';
    }
  }

  return 'Произошла непредвиденная ошибка';
}

const DataCheckerBase = ({
  loading,
  data,
  loadingLabel,
  noDataLabel,
  refetchLabel,
  error,
  useSimpleContainer,
  footerTopAdornment,
  hideRefetchWhenNoData,
  refetch,
  children,
}: Props) => {
  const noData = Array.isArray(data) ? data.length === 0 : !data;

  let content: React.ReactElement | null = null;

  if (loading) {
    content = <Loader key="loader" size="large" label={loadingLabel} />;
  } else if (error) {
    content = <Error key="error" text={getErrorMessage(error)} style={styles.error} />;
  } else if (noData) {
    content = (
      <Text key="no-data" style={styles.noData}>
        {noDataLabel}
      </Text>
    );
  } else if (children) {
    return <>{children}</>;
  }

  content = (
    <>
      {content}
      {!loading && !!refetch && (!!error || (noData && !hideRefetchWhenNoData)) ? (
        <RefetchButton label={refetchLabel} refetch={refetch} />
      ) : null}
    </>
  );

  if (useSimpleContainer) {
    return content;
  }

  return (
    <DataContainer
      key="container"
      contentStyle={styles.content}
      scrollContentStyle={styles.scrollContentStyle}
      footerTopAdornment={footerTopAdornment}
    >
      {content}
    </DataContainer>
  );
};

export const DataChecker = React.memo<Props>(DataCheckerBase);

interface ErrorProps {
  text?: string;
  refetchLabel?: string;

  refetch?(...args: any[]): Promise<any>;
}

export const ErrorLoading = ({
  text = 'Ошибка при загрузке данных',
  refetch,
  refetchLabel = 'Попробовать ещё раз',
}: ErrorProps) => (
  <DataContainer
    key="container"
    contentStyle={styles.content}
    scrollContentStyle={styles.scrollContentStyle}
  >
    <Error key="error" text={text} style={styles.error} />
    {!!refetch && <RefetchButton label={refetchLabel} refetch={refetch} />}
  </DataContainer>
);

export const LoadingData = ({ label = 'Загрузка' }: { label: string }) => (
  <DataContainer
    key="container"
    contentStyle={styles.content}
    scrollContentStyle={styles.scrollContentStyle}
  >
    <Loader key="loader" size="large" label={label} />
  </DataContainer>
);

export const NoData = ({ label }: { label: string }) => (
  <DataContainer
    key="container"
    contentStyle={styles.content}
    scrollContentStyle={styles.scrollContentStyle}
  >
    <Text key="no-data" style={styles.noData}>
      {label || 'Нет данных'}
    </Text>
  </DataContainer>
);
