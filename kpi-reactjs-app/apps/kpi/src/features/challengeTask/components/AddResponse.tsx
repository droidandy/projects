import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormContext } from 'typeless-form';
import { FormInput } from 'src/components/ReduxInput';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { useActions } from 'typeless';
import { ChallengeTaskActions } from '../interface';

interface AddResponseProps {
  challengeActionId: number;
}

const Bottom = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  margin-top: 10px;
`;

export function AddResponse(props: AddResponseProps) {
  const { t } = useTranslation();
  const { challengeActionId } = props;
  const [errors, setErrors] = React.useState(
    {} as {
      [x: string]: string;
    }
  );
  const [touched, setTouched] = React.useState(
    {} as {
      [x: string]: boolean;
    }
  );
  const [values, setValues] = React.useState(
    {} as {
      [x: string]: any;
    }
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const { addComment } = useActions(ChallengeTaskActions);

  return (
    <Wrapper>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (isLoading) {
            return;
          }
          if (!values.text) {
            setTouched({
              text: true,
            });
            setErrors({
              text: 'This field is required!',
            });
          }
          addComment(challengeActionId, values.text, action => {
            if (action === 'startLoading') {
              setIsLoading(true);
            } else if (action === 'stopLoading') {
              setIsLoading(false);
            } else if (action === 'clear') {
              setValues({});
              setTouched({});
              setErrors({});
            }
          });

          return;
        }}
      >
        <FormContext.Provider
          value={{
            errors,
            touched,
            values,
            actions: {
              blur: field => setTouched({ ...touched, [field]: true }),
              change: (field, value) => {
                setValues({ ...values, [field]: value });
                setErrors({
                  ...errors,
                  [field]: !value ? 'This field is required!' : '',
                });
              },
            },
          }}
        >
          {t('Response')}:<br />
          <FormInput name="text" multiline />
          <Bottom>
            <div />
            <div>
              <Button small loading={isLoading}>
                {t('add')}
              </Button>
            </div>
          </Bottom>
        </FormContext.Provider>
      </form>
    </Wrapper>
  );
}
