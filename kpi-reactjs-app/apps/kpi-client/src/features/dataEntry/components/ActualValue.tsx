import * as React from 'react';
import styled from 'styled-components';

interface ActualValueProps {
  className?: string;
  value: number;
  onChange: (value: number | null) => any;
}

const _ActualValue = (props: ActualValueProps) => {
  const { className, onChange } = props;
  const ref = React.useRef(null! as HTMLInputElement);
  React.useEffect(() => {
    ref.current.value = String(props.value || '');
  }, []);
  const timeoutRef = React.useRef(0 as any);
  const onChangeTimeout = (n: number | null) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(n), 500);
  };
  return (
    <div className={className}>
      <input
        ref={ref}
        onChange={e => {
          const str = e.target.value;
          if (str == '') {
            onChangeTimeout(null);
          } else {
            const n = Number(str);
            if (!isNaN(n)) {
              onChangeTimeout(n);
            }
          }
        }}
      />
    </div>
  );
};

export const ActualValue = styled(_ActualValue)`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #dee1e9;
  border-radius: 3px;
  color: #10a6e9;
  padding: 6px 10px;
  input {
    border: none;
    padding: 0;
    font-family: inherit;
    font-size: 14px;
    color: inherit;
    width: 100%;
    padding: 0;
    outline: none;
  }
`;
