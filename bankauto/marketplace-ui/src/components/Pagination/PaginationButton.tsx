import React, { FC, memo } from 'react';
import { PaginationRenderItemParams } from '@material-ui/lab/Pagination';
import { useBreakpoints, Button } from '@marketplace/ui-kit';
import { ReactComponent as IconArrow } from 'icons/arrowNav.svg';
import { useStyles } from './PaginationButton.styles';

type ItemExtendProps = {
  text: string | null;
  ellipsis?: boolean;
  contained?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
};

const getItemExtendsProps = <T extends PaginationRenderItemParams>(
  item: T,
  options?: { isMobile?: boolean },
): T & ItemExtendProps => {
  const isMobile = options?.isMobile;
  const presets: Record<string, ItemExtendProps> = {
    previous: {
      text: isMobile ? null : 'Назад',
      contained: true,
      style: isMobile ? undefined : { marginRight: '1.25rem' },
      startIcon: <IconArrow height="1em" />,
    },
    next: {
      text: isMobile ? null : 'Вперед',
      contained: true,
      style: isMobile ? undefined : { marginLeft: '1.25rem' },
      endIcon: <IconArrow height="1em" transform="rotate(180)" />,
    },
    'start-ellipsis': { text: '...', ellipsis: true, disabled: true, style: { padding: '.5rem 0' } },
    'end-ellipsis': { text: '...', ellipsis: true, disabled: true, style: { padding: '.5rem 0' } },
  };
  const extendProps = presets[item.type] || {
    text: item.page,
    contained: item.selected,
  };
  return {
    ...item,
    ...extendProps,
  };
};

export const PaginationButton: FC<PaginationRenderItemParams> = memo((item) => {
  const { isMobile } = useBreakpoints();
  const { text, contained, startIcon, endIcon, disabled, onClick, style } = getItemExtendsProps(item, {
    isMobile,
  });
  const classes = useStyles({ withText: !!text });
  return (
    <Button
      classes={classes}
      style={style}
      startIcon={startIcon}
      endIcon={endIcon}
      variant={contained ? 'contained' : 'text'}
      color={contained ? 'primary' : 'default'}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Button>
  );
});
