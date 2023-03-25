import React, { FC, memo } from 'react';
import { Grid, Typography, useBreakpoints, OmniLink } from '@marketplace/ui-kit';
import { MicrodataContainer } from 'containers/MicrodataContainer';
import { Organization } from 'containers/MicrodataContainer/components/OrganizationMicrodata';
import Logo from 'components/Logo/Logo';
import { MicrodataProps, SchemaName, STRUCTURED_DATA_MAP } from 'constants/structuredData';
import { useRouter } from 'next/router';
import { MenuVariants, useMenuLinks } from 'hooks/useMenuLinks';
import { Link } from 'components/Link';
import { ServiceCarRoutes } from 'constants/cars';
// import { LINK_ACTION_MAP } from 'constants/menuItems';
import { Copyright, Social } from './components';
import { CONNECTION, SOCIAL_ICONS } from './constants';
import { useStyles } from './Footer.styles';
import { FEATURE_INSTALLMENT_ON } from 'constants/featureFlags';

const navLinksKeys1 = [
  'VehiclesBuy',
  ...(FEATURE_INSTALLMENT_ON ? ['Instalment'] : []),
  'Sell',
  'Service',
  'Insurance',
] as MenuVariants[];
const navLinksKeysFinance = ['FinanceDeposit', 'FinanceDebitCard', 'FinanceSavingsAccount'] as MenuVariants[];
const navLinksKeys3 = ['About', 'Blog', 'UserAgreement', 'Contract', 'Integration'] as MenuVariants[];

const FooterMicrodata = () => {
  const router = useRouter();
  const isService = ServiceCarRoutes.includes(router.asPath);
  const microdataProps: MicrodataProps<Organization, SchemaName> = {
    data: STRUCTURED_DATA_MAP[SchemaName.ORGANIZATION]?.data,
    type: SchemaName.ORGANIZATION,
  };

  return !isService ? <MicrodataContainer {...microdataProps} /> : null;
};

interface FooterNavBlockProps {
  title: string;
  keys: MenuVariants[];
}

const FooterNavBlock: FC<FooterNavBlockProps> = ({ title, keys }) => {
  const { isMobile } = useBreakpoints();
  const navItems = useMenuLinks({});
  return (
    <>
      <Typography
        variant="h6"
        component="p"
        style={{
          textTransform: 'uppercase',
          paddingTop: isMobile ? 5.5 : undefined,
          paddingBottom: isMobile ? '0.5rem' : '1.25rem',
        }}
      >
        {title}
      </Typography>
      {keys.map((key) => {
        const { href, text, id } = navItems[key];
        const currentText = text === 'Главная' ? 'Купить' : text;
        return (
          <Typography key={href} variant="body1" component="p">
            {text === 'Пользовательское соглашение' ? (
              <OmniLink
                href={href}
                target="_blank"
                color="inherit"
                style={{ textDecoration: 'none', lineHeight: '2.5rem' }}
                rel="noopener noreferrer"
              >
                {currentText}
              </OmniLink>
            ) : (
              <Link
                href={href}
                color="inherit"
                style={{ textDecoration: 'none', lineHeight: '2.5rem' }}
                // onClick={LINK_ACTION_MAP[id as string]}
              >
                {currentText}
              </Link>
            )}
          </Typography>
        );
      })}
    </>
  );
};

interface ContactsLinkProps {
  href: string;
  title: string;
  value: string;
}

const ContactsLink = ({ href, title, value }: ContactsLinkProps) => {
  const { isMobile } = useBreakpoints();
  return (
    <>
      <Typography variant={isMobile ? 'body2' : 'body1'} style={isMobile ? { fontSize: '0.75rem' } : {}}>
        {title}
      </Typography>
      <Typography component="span" variant={isMobile ? 'h4' : 'h3'}>
        <a href={href} style={{ color: '#fff' }}>
          {value}
        </a>
      </Typography>
    </>
  );
};

const FooterSocialBlock = () => {
  return (
    <Grid container direction="column" spacing={5}>
      <Grid item>
        <Social icons={SOCIAL_ICONS} />
      </Grid>
      <Grid item>
        <Copyright />
      </Grid>
    </Grid>
  );
};

const FooterNavDesktop = () => (
  <Grid container spacing={10}>
    <Grid item xs={12} container spacing={1}>
      <Grid item sm={3}>
        <Link href="/">
          <Logo size="large" color="white" />
        </Link>
      </Grid>
      <Grid item xs={12} sm={3}>
        <ContactsLink {...CONNECTION[0]} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <ContactsLink {...CONNECTION[1]} />
      </Grid>
      <Grid item xs={12} sm={3} />
    </Grid>
    <Grid item xs={12} container alignContent="stretch" spacing={1}>
      <Grid item xs={12} sm={3}>
        <FooterSocialBlock />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FooterNavBlock title="Автомаркет" keys={navLinksKeys1} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FooterNavBlock title="Банк для автомобилистов" keys={navLinksKeysFinance} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FooterNavBlock title="Информация" keys={navLinksKeys3} />
      </Grid>
    </Grid>
  </Grid>
);

const FooterNavMobile = () => (
  <Grid container spacing={6}>
    <Grid item container spacing={2}>
      <Grid item xs={12} sm={3}>
        <ContactsLink {...CONNECTION[0]} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <ContactsLink {...CONNECTION[1]} />
      </Grid>
    </Grid>
    <Grid item container alignContent="stretch" spacing={2}>
      <Grid item xs={12} sm={3}>
        <FooterNavBlock title="Автомаркет" keys={navLinksKeys1} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FooterNavBlock title="Банк для автомобилистов" keys={navLinksKeysFinance} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FooterNavBlock title="Информация" keys={navLinksKeys3} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FooterSocialBlock />
      </Grid>
    </Grid>
  </Grid>
);

const FooterNav = () => {
  const { isMobile } = useBreakpoints();
  const { root, containerInner } = useStyles();
  return (
    <div className={root}>
      <div className={containerInner}>
        <div style={{ padding: isMobile ? '2.5rem 0' : '5rem 0' }}>
          {isMobile ? <FooterNavMobile /> : <FooterNavDesktop />}
        </div>
      </div>
    </div>
  );
};

const FooterContainerRoot: FC<{ isVisible?: boolean }> = ({ isVisible = true }) => {
  return (
    <footer
      style={{
        display: isVisible ? 'block' : 'none',
        background: '#222222',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FooterMicrodata />
      <FooterNav />

      {/* Скрыто на неопределенный срок */}
      {/* {false && (
          <>
            <Divider />
            <ContainerWrapper py={isMobile ? 2.5 : 5} bgcolor="common.black">
              <Grid container spacing={isMobile ? 2 : 4} alignItems="center" wrap="wrap">
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" flexShrink={1}>
                    <Box flexShrink={1} width="5rem" display="flex">
                      <LittleLogoIcon />
                    </Box>
                    <Box pl={isMobile ? 2.5 : 3.75}>
                      <Typography variant={isMobile ? 'h4' : 'h3'} component="p">
                        Мобильный банк
                      </Typography>
                      <Typography variant={isMobile ? 'body2' : 'body1'} component="p">
                        Управляйте своими финансами {isMobile && <br />}безопасно, быстро и просто
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item sm={3}>
                  <Link
                    href="https://apps.apple.com/ru/app/ргс-банк/id1212266550"
                    target="blank"
                    style={{ width: '12.5rem', display: 'flex' }}
                  >
                    <AppStoreIcon />
                  </Link>
                </Grid>
                <Grid item sm={3}>
                  <Link
                    href="https://play.google.com/store/apps/details?id=ru.rgsbank.mobile&hl=ru&gl=US"
                    target="blank"
                    style={{ width: '12.5rem', display: 'flex' }}
                  >
                    <GooglePlayIcon />
                  </Link>
                </Grid>
              </Grid>
            </ContainerWrapper>
            <ContainerWrapper py={2.5} bgcolor="primary.main">
              <Typography variant="body2">
                Раскрытие информации в соответствии с Указанием ЦБ РФ от 28.12.2015 N 3921-У | Перечень инсайдерской
                информации | Схема взаимосвязей ПАО «РГС Банк» и лиц, под контролем либо значительным влиянием которых
                находится банк | Информация о максимальных процентных ставках по вкладам физических лиц (№3194-У){' '}
                <Box pt={2.5}>
                  Используя данный сайт, я выражаю свое согласие ПАО «РГС Банк» на обработку моих персональных данных с
                  использованием интернет-сервисов. С Политикой в отношении обработки персональных данных ознакомлен.
                </Box>
              </Typography>
            </ContainerWrapper>
          </>
        )} */}
    </footer>
  );
};

export const FooterContainer = memo(FooterContainerRoot);
