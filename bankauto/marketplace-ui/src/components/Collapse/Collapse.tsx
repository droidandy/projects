import React, { useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress } from '@marketplace/ui-kit';

import { useStyles } from './Collapse.styles';

export interface Controls {
  setOpen: () => void;
  setClosed: () => void;
  toggleExpanded?: () => void;
  isExpanded: boolean;
}

interface Props {
  header: (controls: Controls) => JSX.Element | null;
  children: (controls: Controls) => JSX.Element | null;
  disabled?: boolean;
  isCollapsed?: boolean;
  expanded?: boolean;
  loading?: boolean;
  summaryClassName?: string;
  detailsClassName?: string;
  expandIconClassName?: string;
  onChange?: (expanded: boolean) => void;
}

export const Collapse = ({
  children,
  header,
  loading,
  disabled = false,
  summaryClassName = '',
  detailsClassName = '',
  expandIconClassName = '',
  expanded = false,
  onChange,
  isCollapsed,
}: Props) => {
  const s = useStyles({ disabled });
  const [isExpanded, setIsExpanded] = useState(expanded);

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded, setIsExpanded]);

  const toggleExpanded = useCallback(() => {
    if (!disabled) setIsExpanded((state) => !state);
  }, [isExpanded, disabled]);
  const setOpen = useCallback(() => setIsExpanded(true), []);
  const setClosed = useCallback(() => setIsExpanded(false), []);

  useEffect(() => {
    if (isCollapsed) {
      setIsExpanded(!isCollapsed);
    } else if (onChange) onChange(isExpanded);
  }, [isCollapsed, isExpanded, onChange]);

  return (
    <Accordion className={s.accordionRoot} expanded={isExpanded} onChange={toggleExpanded}>
      <AccordionSummary
        classes={{
          root: `${s.accordionSummaryRoot} ${summaryClassName}`,
          expandIcon: `${s.accordionSummaryExpandIcon} ${expandIconClassName}`,
        }}
      >
        {header({ setOpen, setClosed, toggleExpanded, isExpanded })}
      </AccordionSummary>

      <AccordionDetails className={`${s.accordionDetailsRoot} ${detailsClassName}`}>
        {loading ? (
          <Box display="flex" alignContent="center" justifyContent="center" width="100%" p={6}>
            <CircularProgress />
          </Box>
        ) : (
          children({ setOpen, setClosed, isExpanded })
        )}
      </AccordionDetails>
    </Accordion>
  );
};
