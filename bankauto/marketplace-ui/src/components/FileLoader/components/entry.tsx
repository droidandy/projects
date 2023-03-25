import React, { FC, useMemo } from 'react';
import cx from 'classnames';
import Block, { BlockProps } from './Block';
import { useStyles } from './entry.styles';

type EntryClasses = ReturnType<typeof useStyles>;

export interface EntryProps extends BlockProps {
  isActive?: boolean;
  isAccept?: boolean;
  isReject?: boolean;
  classes?: Partial<EntryClasses>;
}

export const Entry: FC<EntryProps> = ({
  isActive,
  isAccept,
  isReject,
  message: messageProp,
  classes: classesProp,
  ...rest
}) => {
  const classes = useStyles({ classes: classesProp });
  const message = useMemo(
    () =>
      messageProp || (
        <>
          Перетащите сюда или загрузите изображения <span className={classes.fontPrimary}>вручную</span>
        </>
      ),
    [messageProp],
  );
  return (
    <Block
      className={cx(classes.root, {
        [classes.active]: isActive,
        [classes.accept]: isAccept,
        [classes.reject]: isReject,
      })}
      message={message}
      {...rest}
    />
  );
};
