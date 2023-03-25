import React, { FC } from 'react';
import cx from 'classnames';
import { useBreakpoints } from '@marketplace/ui-kit';

interface StepsWrapperClasses {
  root?: string;
  block?: string;
}
interface StepsWrapperProps {
  blocks: React.ReactNode[];
  className?: string;
  classes?: StepsWrapperClasses;
  divider?: React.ReactNode;
}
export const StepsWrapper: FC<StepsWrapperProps> = ({ blocks, className, classes, divider }) => {
  const { isMobile } = useBreakpoints();
  return (
    <div className={cx(className, classes?.root)}>
      {blocks.map((item, index) => {
        return (
          <>
            {divider && !isMobile && blocks.length - 1 > index ? <div>{divider}</div> : null}
            {item}
          </>
        );
      })}
    </div>
  );
};
