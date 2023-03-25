import { startCase } from 'lodash';

export function roleNameToLabel(roleName) {
  const roleLabels = {
    'admin': 'Admin',
    'booker': 'Booker',
    'companyadmin': 'Admin',
    'customer_care': 'Customer Care',
    'finance': 'Finance',
    'passenger': 'Passenger',
    'sales': 'Sales',
    'superadmin': 'Super Admin',
    'travelmanager': 'Travel Manager'
  };

  return roleLabels[roleName] || startCase(roleName);
}
