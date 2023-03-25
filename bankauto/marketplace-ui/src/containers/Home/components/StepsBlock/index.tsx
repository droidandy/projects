import React, { FC, memo } from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Link } from 'components';
import { BtnArrowRightBlack } from 'icons';
import { useStyles } from './StepsBlock.styles';

export type StepsBlockItemProps = {
  icon: JSX.Element;
  text: string | JSX.Element;
  subText?: string | JSX.Element;
  link?: { href: string; title: string };
  textVariant?: Variant | 'inherit';
};

type Props = {
  steps: StepsBlockItemProps[];
  textVariant?: Variant | 'inherit';
  title?: string;
  styles?: React.CSSProperties;
};

const StepsBlockItem: FC<StepsBlockItemProps> = ({ icon, text, subText, textVariant, link }) => {
  const { stepsItemWrapper, stepsItemTextWrapper, stepsItemText, stepsItemSubText } = useStyles();
  const { isMobile } = useBreakpoints();
  return (
    <div className={stepsItemWrapper}>
      <div>{icon}</div>

      <div className={stepsItemTextWrapper}>
        <Typography variant={isMobile ? 'h5' : textVariant || 'h4'} className={stepsItemText}>
          {text}
        </Typography>
        {subText && (
          <Typography variant="h5" className={stepsItemSubText}>
            {subText}
          </Typography>
        )}
        {link && (
          <Link href={link.href} target="_blank">
            <Typography variant={isMobile ? 'h5' : textVariant || 'h4'} className={stepsItemText}>
              {link.title}
            </Typography>
          </Link>
        )}
      </div>
    </div>
  );
};

export const HomeStepsBlock: FC<Props> = memo(({ steps, title, styles, children, textVariant }) => {
  const { stepsBlockWrapper } = useStyles();
  const { isMobile } = useBreakpoints();

  const stepsBlockItems = steps.map((item, index) => (
    <>
      <StepsBlockItem textVariant={textVariant} {...item} />
      {!isMobile && steps.length - 1 > index ? (
        <div>
          <BtnArrowRightBlack />
        </div>
      ) : null}
    </>
  ));

  return (
    <>
      {title ? (
        <Typography variant={isMobile ? 'h4' : 'h2'} align="center">
          {title}
        </Typography>
      ) : null}
      <div className={stepsBlockWrapper} style={styles}>
        {stepsBlockItems}
      </div>
      {children}
    </>
  );
});
