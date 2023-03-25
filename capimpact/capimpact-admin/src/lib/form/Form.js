import React, { useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useQuery, useMutation } from 'react-fetching-library';
import { Formik, Form as FormikForm } from 'formik';
import Spinner from 'components/Spinner';

const onSubmitSuccessCommon = (result, props) => {
  console.log('Result submit is', result);
  return result;
};

const onSubmitFailCommon = (error, props) => {
  console.error(error);
  //throw error;
  return error;
};

const queryEmpty = {
  method: 'GET',
  endpoint: '/',
};

const useForm = ({
  query = [],
  action = [],
  onSubmit,
  onSubmitFail,
  onSubmitSuccess,
  beforeSubmit,
  ...props
}) => {
  const match = useRouteMatch();
  const [fetchData, params = {}] = query;
  const [mutation, variables = {}] = action;
  const queryResponse = useQuery(
    fetchData ? fetchData({ ...match.params, ...params }) : queryEmpty,
    fetchData ? true : false
  );
  const mutationResponse = useMutation(mutation); // abort, loading, mutate, reset

  const handleSubmit = useCallback(
    async (data, formikBag) => {
      if (beforeSubmit) {
        data = beforeSubmit(data);
      }
      if (onSubmit) {
        return onSubmit({ ...props, ...match.params, ...variables, mutationResponse, data });
      }
      return mutationResponse
        .mutate({ ...match.params, ...variables, data })
        .then(({ status, error, errorObject, payload, headers }) => {
          const passedProps = { ...props, ...formikBag, status, headers };
          if (error) {
            return onSubmitFail
              ? onSubmitFail(errorObject || payload, passedProps)
              : onSubmitFailCommon(errorObject || payload, passedProps);
          }
          return onSubmitSuccess
            ? onSubmitSuccess(payload, passedProps)
            : onSubmitSuccessCommon(payload, passedProps);
        });
    },
    [
      beforeSubmit,
      match,
      mutationResponse,
      onSubmit,
      onSubmitFail,
      onSubmitSuccess,
      props,
      variables,
    ]
  );

  const initialValues = {
    ...((queryResponse && queryResponse.payload) || {}),
    ...(props.initialValues || {}),
  };

  return { queryResponse, mutationResponse, initialValues, handleSubmit };
};

const Form = ({ children, ...props }) => {
  const { queryResponse, mutationResponse, initialValues, handleSubmit } = useForm(props);

  return queryResponse.loading ? (
    <Spinner />
  ) : (
    <Formik {...props} initialValues={initialValues} onSubmit={handleSubmit}>
      {formikProps => (
        <FormikForm>
          <fieldset disabled={formikProps.isSubmitting}>
            {children({ ...props, ...formikProps, mutationResponse, queryResponse })}
          </fieldset>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
