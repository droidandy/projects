import React, { memo } from 'react';
import { ContainerWrapper, Grid, Typography, Icon, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconAddress } from '@marketplace/ui-kit/icons/icon-address--black.svg';
import { ReactComponent as IconEmail } from '@marketplace/ui-kit/icons/icon-mail.svg';
import { ReactComponent as IconPhone } from '@marketplace/ui-kit/icons/icon-phone.svg';
import { ReactComponent as IconPress } from '@marketplace/ui-kit/icons/icon-press.svg';

import { MicrodataContainer } from 'containers/MicrodataContainer';
import { STRUCTURED_DATA_MAP, SchemaName, MicrodataProps } from 'constants/structuredData';
import { Organization } from 'containers/MicrodataContainer/components/OrganizationMicrodata';

import { useRouter } from 'next/router';
import { ServiceCarRoutes } from 'constants/cars';
import { useStyles } from './AboutContactsSection.styles';

const AboutContactsSectionRoot = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const microdataProps: MicrodataProps<Organization, SchemaName> = {
    data: STRUCTURED_DATA_MAP[SchemaName.ORGANIZATION]?.data,
    type: SchemaName.ORGANIZATION,
  };
  const router = useRouter();
  const isService = ServiceCarRoutes.includes(router.asPath);
  return (
    <ContainerWrapper bgcolor="grey.100" className={s.root}>
      {!isService && <MicrodataContainer {...microdataProps} />}
      <Typography align="center" className={s.contactsTitle} variant="h3">
        Контакты
      </Typography>
      <Grid container spacing={isMobile ? 2 : 4}>
        <Grid item sm={6} xs={12}>
          <div className={s.contactsItem}>
            <Grid container spacing={2} alignItems="center" justify="center" direction={isMobile ? 'column' : 'row'}>
              <Grid item sm={2} xs={12}>
                <Icon component={IconAddress} viewBox="0 0 60 60" className={s.icon} />
              </Grid>
              <Grid item sm={10} xs={12}>
                <Grid container spacing={2} direction="column" alignItems={isMobile ? 'center' : 'flex-start'}>
                  <Grid item>
                    <Typography
                      align={isMobile ? 'center' : 'left'}
                      className={s.itemTitle}
                      variant="h5"
                      color="primary"
                    >
                      Головной офис
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography align={isMobile ? 'center' : 'left'} className={s.itemDescription} variant="body1">
                      121059, г. Москва, {isMobile ? '\n' : ''} ул. Киевская, 7
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item sm={6} xs={12}>
          <div className={s.contactsItem}>
            <Grid container spacing={2} alignItems="center" justify="center" direction={isMobile ? 'column' : 'row'}>
              <Grid item sm={2} xs={12}>
                <Icon component={IconEmail} viewBox="0 0 60 60" className={s.icon} />
              </Grid>
              <Grid item sm={10} xs={12}>
                <Grid container spacing={2} direction="column" alignItems={isMobile ? 'center' : 'flex-start'}>
                  <Grid item>
                    <Typography
                      align={isMobile ? 'center' : 'left'}
                      className={s.itemTitle}
                      variant="h5"
                      color="primary"
                    >
                      Email
                    </Typography>
                  </Grid>
                  <Grid item>
                    <a href="mailto:consult@rgsbank.ru">
                      <Typography
                        align={isMobile ? 'center' : 'left'}
                        className={s.itemDescription}
                        variant="body1"
                        color="textPrimary"
                      >
                        consult@rgsbank.ru
                      </Typography>
                    </a>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item sm={6} xs={12}>
          <div className={s.contactsItem}>
            <Grid
              container
              spacing={isMobile ? 1 : 2}
              alignItems="center"
              justify="center"
              direction={isMobile ? 'column' : 'row'}
            >
              <Grid item sm={2} xs={12}>
                <Icon component={IconPhone} viewBox="0 0 60 60" className={s.icon} />
              </Grid>
              <Grid item sm={10} xs={12}>
                <Grid container spacing={2} direction="column" alignItems={isMobile ? 'center' : 'flex-start'}>
                  <Grid item>
                    <Typography
                      align={isMobile ? 'center' : 'left'}
                      className={s.itemTitle}
                      variant="h5"
                      color="primary"
                    >
                      Телефон
                    </Typography>
                  </Grid>
                  <Grid item>
                    <a href="tel:+78007004040">
                      <Typography
                        align={isMobile ? 'center' : 'left'}
                        className={s.itemDescription}
                        variant="body1"
                        color="textPrimary"
                      >
                        8 800 700-40-40
                      </Typography>
                    </a>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item sm={6} xs={12}>
          <div className={s.contactsItem}>
            <Grid container spacing={2} alignItems="center" justify="center" direction={isMobile ? 'column' : 'row'}>
              <Grid item sm={2} xs={12}>
                <Icon component={IconPress} viewBox="0 0 60 60" className={s.icon} />
              </Grid>
              <Grid item sm={10} xs={12}>
                <Grid container spacing={2} direction="column" alignItems={isMobile ? 'center' : 'flex-start'}>
                  <Grid item>
                    <Typography
                      align={isMobile ? 'center' : 'left'}
                      className={s.itemTitle}
                      variant="h5"
                      color="primary"
                    >
                      Пресс-служба
                    </Typography>
                  </Grid>
                  <Grid item>
                    <a href="mailto:press@rgsbank.ru">
                      <Typography
                        align={isMobile ? 'center' : 'left'}
                        className={s.itemDescription}
                        variant="body1"
                        color="textPrimary"
                      >
                        press@rgsbank.ru {isMobile ? '\n' : ''}(только для СМИ)
                      </Typography>
                    </a>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
};

const AboutContactsSection = memo(AboutContactsSectionRoot);
export { AboutContactsSection };
