import React, { FC, memo, useRef, useEffect, useMemo, useState } from 'react';
import { useLayoutEffect } from 'hooks/useLayoutEffectPoly';

export interface FormControlBlockProps {
  show?: boolean;
  scrollDirection?: 'top' | 'bottom';
  useScroll?: boolean;
  showOnce?: boolean;
  register?: boolean;
  className?: string;
}

const HeaderHeight = 55;

export const FormControlBlock: FC<FormControlBlockProps> = memo(
  ({ show = true, scrollDirection = 'bottom', useScroll = true, showOnce, register, children, className }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const [showState, setShowState] = useState<boolean>(show);
    const windowElement = useMemo<Window | undefined>(() => (typeof window !== 'undefined' ? window : undefined), []);
    useLayoutEffect(() => {
      if (showOnce && show && !showState) {
        setShowState(true);
      } else if (!showOnce && show !== showState) {
        setShowState(show);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, showState]);

    useEffect(() => {
      if (useScroll && showState && rootRef.current && windowElement) {
        const { offsetHeight } = rootRef.current;
        const { top } = rootRef.current.getBoundingClientRect();
        const { innerHeight } = windowElement;
        const scrollDistance = offsetHeight <= innerHeight ? top + offsetHeight - innerHeight : top - HeaderHeight;
        if ((scrollDirection === 'bottom' && scrollDistance > 0) || (scrollDirection === 'top' && scrollDistance < 0)) {
          windowElement.scrollBy({ top: scrollDistance, behavior: 'smooth' });
        }
      }
    }, [rootRef, windowElement, useScroll, showState, scrollDirection]);

    return showState || register ? (
      <div ref={rootRef} className={className} style={{ display: showState ? 'block' : 'none' }}>
        {children}
      </div>
    ) : null;
  },
);
