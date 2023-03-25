import React from 'react';
import { Box } from '@marketplace/ui-kit';
import { AccordionItem } from 'components/VehicleDetailComponents/Accordion/components/AccordionItem';
import { useStyles } from './AccordionFAQItem.styles';

type Props = {
  options?: any[][] | null;
};

export const AccordionFAQItem = React.memo(({ options }: Props) => {
  const { content } = useStyles();
  const [expanded, setExpanded] = React.useState<string | boolean>(false);

  const handleChange = (name: string) => (e: React.ChangeEvent<{}>, isExpanded: boolean) =>
    setExpanded(isExpanded ? name : false);

  return (
    <>
      {options && options.length > 0 ? (
        <Box>
          {options.map((option) => (
            <AccordionItem
              key={option[0]}
              name={option[0]}
              isExpanded={expanded === option[0]}
              handleChange={handleChange(option[0])}
            >
              <div className={content}>{option[1]}</div>
            </AccordionItem>
          ))}
        </Box>
      ) : null}
    </>
  );
});
