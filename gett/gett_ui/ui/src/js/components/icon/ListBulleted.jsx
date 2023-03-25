import React from 'react';
import IconBase from 'react-icon-base';

export default function ListBulleted(props) {
  return (
    <IconBase viewBox="0 0 30 30" { ...props }>
      <defs>
        <path id="listBulletedIcon" d="M7.5 14c-.83 0-1.5.67-1.5 1.5S6.67 17 7.5 17 9 16.33 9 15.5 8.33 14 7.5 14zm0-6C6.67 8 6 8.67 6 9.5S6.67 11 7.5 11 9 10.33 9 9.5 8.33 8 7.5 8zm0 12.17a1.33 1.33 0 1 0-.001 2.659A1.33 1.33 0 0 0 7.5 20.17zm3 2.33h14v-2h-14v2zm0-6h14v-2h-14v2zm0-8v2h14v-2h-14z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="listBulletedIconMask" fill="#fff">
          <use xlinkHref="#listBulletedIcon" />
        </mask>
        <g fill="currentColor" mask="url(#listBulletedIconMask)">
          <path d="M2 2h26v26H2z" />
        </g>
      </g>
    </IconBase>
  );
}
