import React, { FC } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';

interface Props {
  title?: string;
  percent?: number;
  step?: number;
}

const ProbabilityApproval: FC<Props> = ({ title = 'Вероятность одобрения кредита', percent = 0, step = 20 }) => {
  const { isMobile } = useBreakpoints();
  const probabilityText = percent < 99 ? `+${percent === 80 ? step - 1 : step}% за следующий шаг` : 'Отправьте заявку';
  const titleVariant = isMobile ? 'subtitle2' : 'subtitle1';

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexWrap="nowrap" justifyContent="space-between">
        <Typography variant={titleVariant} component="span">
          {title}
        </Typography>
        <Typography variant={titleVariant} component="span">
          {percent}%
        </Typography>
      </Box>
      <Box mt={1.25} mb={1.25} width="100%" bgcolor="background.paper" height="0.25rem" borderRadius="0.125rem">
        <Box width={`${percent}%`} height="100%" bgcolor="success.main" borderRadius="0.125rem" />
      </Box>
      <Typography variant="subtitle2" component="span" color="textSecondary">
        {probabilityText}
      </Typography>
    </Box>
  );
};

export { ProbabilityApproval };
