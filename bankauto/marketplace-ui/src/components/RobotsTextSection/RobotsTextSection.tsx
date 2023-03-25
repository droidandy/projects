import React, { memo } from 'react';
import { ContainerWrapper, useToggle } from '@marketplace/ui-kit';
import { Collapse } from '@material-ui/core';
import { useStyles } from './RobotsTextSection.styles';

interface Props {
  text: string;
}

const RobotsTextSectionRoot = ({ text }: Props) => {
  const [checked, checkedActions] = useToggle();

  const { root, textContent, textBodyWrapper, gradient, showMoreBtn } = useStyles();
  return (
    <ContainerWrapper className={root}>
      <div className={textBodyWrapper}>
        <Collapse in={checked} className={textContent} collapsedHeight={70}>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </Collapse>
        <span className={gradient} />
      </div>
      <span onClick={checkedActions.handleToggle} role="button" className={showMoreBtn}>
        {checked ? 'Скрыть' : 'Показать весь'}
      </span>
    </ContainerWrapper>
  );
};

const RobotsTextSection = memo(RobotsTextSectionRoot);

export { RobotsTextSection };
