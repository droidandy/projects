import React, { FC, useEffect, useMemo, useRef } from 'react';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { Link } from 'components/Link';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { SECTIONS } from 'containers/Home/HeroNew/constants';
import { HomeTab } from 'types/Home';
import { analyticsTabsOnChange } from 'helpers/analytics/events/analyticsTabsOnChange';
import { useStyles } from './HeroWrapper.styles';

type Props = {
  title: JSX.Element;
  image: string;
  alt: string;
  filter?: JSX.Element | React.ReactNode;
  activeTab: number;
};

export const HeroWrapper: FC<Props> = ({ title, image, alt, filter, activeTab }) => {
  const s = useStyles();
  const linksWrapper = useRef(null);
  const { isMobile } = useBreakpoints();
  const directory = isMobile ? 'mobile' : 'desktop';

  useEffect(() => {
    if (isMobile && activeTab > 1 && linksWrapper && linksWrapper.current) {
      (linksWrapper?.current as any).scroll(1000, 0);
    }
  }, [linksWrapper]);

  const onTabClick = (id: HomeTab) => () => {
    analyticsTabsOnChange(id || 'buy');
  };

  const links = useMemo(
    () =>
      SECTIONS.map(({ id, link, name }, index) => {
        return index === activeTab ? (
          <span key={id} className={`${s.link} active`}>
            {name}
          </span>
        ) : (
          <Link key={id} href={link} className={s.link} onClick={onTabClick(id)}>
            {name}
          </Link>
        );
      }),
    [activeTab, SECTIONS],
  );

  return (
    <div>
      <div className={s.banner}>
        <ImageWebpGen src={`/images/${directory}/${image}`} alt={alt} />
        <ContainerWrapper className={s.titleWrapper}>{title}</ContainerWrapper>
        <ContainerWrapper>
          <div className={s.links} ref={linksWrapper}>
            {links}
          </div>
        </ContainerWrapper>
      </div>
      {filter && (
        <ContainerWrapper className={s.filterContainer}>
          <div className={s.filterWrapper}>{filter}</div>
        </ContainerWrapper>
      )}
    </div>
  );
};
