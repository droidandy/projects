import React from 'react';
import IconBase from 'react-icon-base';

export default function UserIcon(props) {
  return (
    <IconBase viewBox="0 0 30 30" { ...props }>
      <defs>
        <path id="UsersIcon" d="M19 14c1.66 0 2.99-1.34 2.99-3S20.66 8 19 8c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S12.66 8 11 8c-1.66 0-3 1.34-3 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V22h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V22h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </defs>
      <use fill="currentColor" fillRule="nonzero" xlinkHref="#UsersIcon" />
    </IconBase>
  );
}
