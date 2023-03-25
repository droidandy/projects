import React, { FC, FormEvent, ReactNode } from 'react';
import cx from 'classnames';
import { useStyles } from './SwitchPanel.styles';

interface Props {
  items: ReactNode[];
  activeItem: number;
  light?: boolean;
  onChange: (event: FormEvent<HTMLFieldSetElement>) => void;
  className?: string;
}

const SwitchPanel: FC<Props> = ({ items, activeItem, light = false, onChange, className }) => {
  const s = useStyles();

  return (
    <fieldset id="switchItem" onChange={onChange} className={cx(s.root, { [s.light]: light }, className)}>
      {items.map((item, index) => (
        <label
          htmlFor={`switchItem_${index}`}
          className={cx(s.label, { [s.active]: activeItem === index })}
          key={`switchItem_${index}`}
        >
          {item}
          <input id={`switchItem_${index}`} type="radio" value={index} name="switchItem" className={s.input} />
        </label>
      ))}
    </fieldset>
  );
};

export { SwitchPanel };
