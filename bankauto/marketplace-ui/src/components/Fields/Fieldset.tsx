import React, { FC, useContext } from 'react';

const FieldsetContext = React.createContext(false);

type FieldsetProps = {
  disabled: boolean;
  children?: ((props: FieldsetRenderProps) => React.ReactNode) | React.ReactNode;
};

type FieldsetRenderProps = {
  disabled: boolean;
};

const Fieldset: FC<FieldsetProps> = ({ disabled, children }: FieldsetProps) => {
  const isClosestFieldsetDisabled = useContext(FieldsetContext);

  return (
    <FieldsetContext.Provider value={disabled || isClosestFieldsetDisabled}>
      {typeof children === 'function' ? children({ disabled }) : children}
    </FieldsetContext.Provider>
  );
};

export default Fieldset;

export { FieldsetContext };
