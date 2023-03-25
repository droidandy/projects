import React from 'react';
import { RouteCard } from '../../../components/RouteCard';
import { RouteCardWrapper } from '../../../components/RouteCardWrapper';
import { useLanguage } from 'src/hooks/useLanguage';
import { OnPermission } from 'src/components/OnPermission';

export const SettingsView = () => {
  useLanguage();
  return (
    <div>
      <RouteCardWrapper>
        <RouteCard text="Organizations" url="/settings/organizations" />
        <OnPermission permission="locations:view">
          <RouteCard text="Locations" url="/settings/locations" />
        </OnPermission>
        <OnPermission permission="organization-structure:view">
          <RouteCard
            text="Organization Structure"
            url="/settings/organization-structure"
          />
        </OnPermission>
        <OnPermission permission="strategic-plans:view">
          <RouteCard text="Strategic Plans" url="/settings/strategic-plans" />
        </OnPermission>
        <RouteCard text="Strategy Items" url="/settings/strategy-items" />
        <RouteCard text="Users" url="/settings/users" />
        <RouteCard text="Org Users" url="/settings/org-users" />
        <OnPermission permission="roles:view">
          <RouteCard text="Roles" url="/settings/roles" />
        </OnPermission>
        <OnPermission permission="metrics:view">
          <RouteCard text="Metrics" url="/settings/metrics" />
        </OnPermission>
        <RouteCard text="Custom Fields" url="/settings/custom-fields" />
        <RouteCard text="Scorecards" url="/settings/scorecards" />
        <RouteCard text="Color Themes" url="/settings/color-themes" />
        <RouteCard text="Excellence Themes" url="/settings/excellence-themes" />
        <RouteCard
          text="Excellence Criteria"
          url="/settings/excellence-criterias"
        />
        <RouteCard text="Site Settings" url="/settings/site-settings" />
        <RouteCard text="Lookup Management" url="/settings/lookup-management" />
      </RouteCardWrapper>
    </div>
  );
};
