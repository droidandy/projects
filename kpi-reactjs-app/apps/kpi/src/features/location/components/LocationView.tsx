import React from 'react';
import { getLocationState, LocationActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { LocationFormProvider, LocationFormActions } from '../location-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';
import { FormSelect } from 'src/components/FormSelect';
import { isHeadquarterOptions } from 'src/features/locations/utils';

export const LocationView = () => {
  const {
    isLoading,
    location,
    isSaving,
    isDeleting,
  } = getLocationState.useState();
  const { submit } = useActions(LocationFormActions);
  const { remove, initMap } = useActions(LocationActions);

  React.useEffect(() => {
    if (!isLoading) {
      initMap();
    }
  }, [isLoading]);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <LocationFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/locations" />
          <RequiredNote />
          <FormItem label="Name - En" required>
            <FormInput name="name_en" />
          </FormItem>
          <FormItem label="Name - Ar" required>
            <FormInput name="name_ar" />
          </FormItem>
          <FormItem label="Address - En" required>
            <FormInput name="address_en" />
          </FormItem>
          <FormItem label="Address - Ar" required>
            <FormInput name="address_ar" />
          </FormItem>
          <FormItem label="P.O Box" required>
            <FormInput name="poBox" />
          </FormItem>
          <FormItem label="City" required>
            <FormInput name="city" />
          </FormItem>
          <FormItem label="Country" required>
            <FormInput name="country" />
          </FormItem>
          <FormItem label="Is Headquarter" required>
            <FormSelect name="isHeadquarter" options={isHeadquarterOptions} />
          </FormItem>
          <FormItem label="Longitude" required>
            <FormInput name="long" />
          </FormItem>
          <FormItem label="Latitude" required>
            <FormInput name="lat" />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
          <div
            id="map"
            style={{
              width: '100%',
              height: 400,
              marginTop: 15,
            }}
          ></div>
        </form>
        <SaveButtons
          showDelete={!!location}
          onCancel="/settings/locations"
          onSave={submit}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onDelete={remove}
          deletePermission="location:delete"
          savePermission={location ? 'location:update' : 'location:add'}
        />
      </LocationFormProvider>
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
