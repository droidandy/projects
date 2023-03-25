import React, { useMemo } from 'react';
import cx from 'classnames';
import { Img, useBreakpoints, ContainerWrapper } from '@marketplace/ui-kit';
import { Box, Button, Typography } from '@material-ui/core';
import { useStyles } from './Hero.styles';

type Props = {
  title: string;
  subTitle?: string;
  bgImage?: string;
  buttonText?: string;
  buttonColor?: string;
  className?: string;
  innerContentClassName?: string;
  contentClassName?: string;
  isShowButton?: boolean;
  link?: string;
  buttonClickHandler?: () => void;
};

type ButtonProps = Pick<Props, 'buttonClickHandler' | 'link' | 'buttonText' | 'buttonColor'>;

const HeroChild = ({ buttonClickHandler, link, buttonText, buttonColor }: ButtonProps) => {
  const styles = useStyles();
  const isPrimaryBtn = buttonColor === 'primary';
  return (
    <Button
      href={link}
      onClick={buttonClickHandler}
      variant="contained"
      className={styles.button}
      style={{
        backgroundColor: isPrimaryBtn ? '#FFFFFF' : '#990031',
        color: isPrimaryBtn ? 'rgba(0, 0, 0, 0.87)' : '#FFFFFF',
      }}
    >
      {buttonText}
    </Button>
  );
};

const Hero = ({
  className,
  contentClassName,
  title,
  subTitle,
  link,
  buttonText,
  buttonColor,
  buttonClickHandler,
  bgImage,
  innerContentClassName,
  isShowButton = true,
}: Props) => {
  const styles = useStyles();
  const { isMobile } = useBreakpoints();
  const getBgImage = useMemo(
    () =>
      bgImage ??
      (isMobile ? '/images/mobile/heroImageFinanceCreditMobile.jpg' : '/images/desktop/heroImageFinance.jpg'),
    [isMobile, bgImage],
  );

  return (
    <Box className={cx(styles.hero, className)}>
      <Img src={getBgImage} className={styles.bgImage} aspect={isMobile ? '1/1' : '3/1'} stretch />
      <span className={styles.darkOverlay} />
      <Box className={cx(styles.contentTopLayer, contentClassName)}>
        <ContainerWrapper className={cx(styles.innerContent, innerContentClassName)}>
          <Typography variant="h1" className={styles.title}>
            {title}
          </Typography>
          {subTitle && (
            <Typography variant="h4" className={styles.subTitle}>
              {subTitle}
            </Typography>
          )}
        </ContainerWrapper>
        {isShowButton && (
          <ContainerWrapper>
            <HeroChild {...{ buttonClickHandler, link, buttonText, buttonColor }} />
          </ContainerWrapper>
        )}
      </Box>
    </Box>
  );
};

export { Hero };
