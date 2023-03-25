import React, { FC } from 'react';
import { Box } from '@material-ui/core';
import { useBreakpoints, Typography } from '@marketplace/ui-kit';
import { Tariff } from 'store/types';

interface Props {
  items: Tariff[];
}

const Tariffs: FC<Props> = React.memo(({ items }) => {
  const { isMobile } = useBreakpoints();
  return (
    <Box>
      <Box
        width={isMobile ? '100%' : '81.875rem'}
        border={isMobile ? 'none' : '1px solid #E8E9EB'}
        borderRadius={isMobile ? 0 : '0.5rem'}
        p={isMobile ? '0' : '2.5rem 2.5rem 1.25rem'}
        m="auto"
      >
        {items.map((item, itemIndex) => (
          <Box
            display="flex"
            key={item.title}
            borderBottom={itemIndex + 1 !== items.length && '1px solid #E8E9EB'}
            pb="1.25rem"
            mb="1rem"
          >
            <Box width="50%" flexShrink={0} pr="1.25rem">
              <Typography variant={isMobile ? 'h6' : 'h5'}>{item.title}</Typography>
            </Box>
            <Box>
              {item.content.map((content, contentIndex) => (
                <Box mb={content.conditions && contentIndex + 1 === item.content.length && '-1.5rem'}>
                  <Typography variant={isMobile ? 'h6' : 'h5'}>{content.contentTitle}</Typography>
                  {content.conditions?.map((condition, conditionIndex) => (
                    <Box mb={conditionIndex + 1 === (content.conditions?.length || 0) && '1.5rem'}>
                      <Typography variant={isMobile ? 'body2' : 'body2'}>{condition}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
});

export { Tariffs };
