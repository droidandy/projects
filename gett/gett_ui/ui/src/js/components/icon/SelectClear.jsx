import React from 'react';
import IconBase from 'react-icon-base';

export default function SelectClear(props) {
  return (
    <IconBase viewBox="0 0 20 20" { ...props }>
      <g fill="none" fillRule="nonzero" transform="translate(1 1)">
        <circle cx="9" cy="9" r="9" fill="#E2E2E2" />
        <path fill="gray" d="M9.596 9l3.28-3.28a.422.422 0 0 0-.596-.596L9 8.404l-3.28-3.28a.422.422 0 1 0-.596.596L8.404 9l-3.28 3.281a.422.422 0 0 0 .596.597L9 9.598l3.28 3.28a.422.422 0 1 0 .596-.597l-3.28-3.28z" />
      </g>
    </IconBase>
  );
}
