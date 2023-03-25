import React, { FC, useState } from 'react';
import { Box } from '@marketplace/ui-kit';
import { AccordionItem } from '../AccordionItem';

type Questions = {
  question: string;
  answer: string | React.ReactNode;
};
type Props = {
  questions: Questions[];
};

export const Accordion: FC<Props> = ({ questions }) => {
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const handleChange = (name: string) => (e: React.ChangeEvent<{}>, isExpanded: boolean) =>
    setExpanded(isExpanded ? name : false);

  return (
    <>
      {questions && questions.length > 0 ? (
        <Box>
          {questions.map((item) => (
            <AccordionItem
              key={item.question}
              name={item.question}
              isExpanded={expanded === item.question}
              handleChange={handleChange(item.question)}
            >
              {item.answer}
            </AccordionItem>
          ))}
        </Box>
      ) : null}
    </>
  );
};
