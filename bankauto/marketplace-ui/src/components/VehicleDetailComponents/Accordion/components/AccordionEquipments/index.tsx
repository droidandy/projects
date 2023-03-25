import React, { FC, useState } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';

import { Options } from 'types/Vehicle';
import { pluralize } from 'helpers';
import { AccordionItem } from '../AccordionItem';
import { useStyles } from './AccordionEquipments.styles';

type Props = {
  options?: Array<[string, Options]> | null;
};

const WORDS = ['опция', 'опции', 'опций'];

export const AccordionEquipments: FC<Props> = ({ options }) => {
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const { isMobile } = useBreakpoints();
  const { listItem, listContainer } = useStyles();

  const getOptionDescriprion = (list: Options) => (
    <ul className={listContainer}>
      {list.map((item) => (
        <li key={item} className={listItem}>
          <Typography variant="body1">{item}</Typography>
        </li>
      ))}
    </ul>
  );

  const getAddition = (count: number) => (isMobile ? count : `${count} ${pluralize(count, WORDS)}`);

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
              addition={getAddition(option[1].length)}
              isExpanded={expanded === option[0]}
              handleChange={handleChange(option[0])}
            >
              {getOptionDescriprion(option[1])}
            </AccordionItem>
          ))}
        </Box>
      ) : null}
    </>
  );
};
