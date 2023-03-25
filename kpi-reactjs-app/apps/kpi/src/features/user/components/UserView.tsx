import React from 'react';
import { getUserState, UserActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { UserFormProvider, UserFormActions } from '../user-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';
import { Row, Col } from 'src/components/Grid';

export const UserView = () => {
  const { isLoading, user, isSaving, isDeleting } = getUserState.useState();
  const { submit } = useActions(UserFormActions);
  const { remove } = useActions(UserActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <UserFormProvider>
        <BackButton href="/settings/users" />
        <RequiredNote />
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <Row>
            <Col>
              <FormItem label="Name" required>
                <FormInput name="name" langSuffix />
              </FormItem>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="Username" required>
                <FormInput name="username" />
              </FormItem>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="Email" required>
                <FormInput name="email" />
              </FormItem>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              {user ? (
                <FormItem label="New Password">
                  <FormInput name="newPassword" />
                </FormItem>
              ) : (
                <FormItem label="Password" required>
                  <FormInput name="password" />
                </FormItem>
              )}
            </Col>
            <Col></Col>
          </Row>
          <button type="submit" style={{ display: 'none' }} />
        </form>

        <SaveButtons
          showDelete={!!user}
          onCancel="/settings/users"
          onSave={submit}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onDelete={remove}
        />
      </UserFormProvider>
    );
  };

  return (
    <>
      <Page>
        <Portlet padding>{renderDetails()}</Portlet>
      </Page>
    </>
  );
};
