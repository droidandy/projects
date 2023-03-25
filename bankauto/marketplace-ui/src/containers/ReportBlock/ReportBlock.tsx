import React, { FC, useState, useEffect } from 'react';
import { AutotekaTeaserData, Box, Button, CircularProgress, Divider, Paper, Typography } from '@marketplace/ui-kit';
import { Teaser } from '../Vehicles/components/Card/components/AutotekaBlock/components/Teaser/Teaser';
import { ReactComponent as AutotekaLogo } from 'icons/autoteka.svg';
import { getAutotekaReportLink } from 'api/catalog';
import { getAutotekaTeaserData, TeaserData } from 'helpers/getAutotekaTeaserData';
import { useStyles } from './ReportBlock.styles';

interface Props {
  id: number;
  autotekaReportTeaser?: AutotekaTeaserData | null;
}

export const ReportBlock: FC<Props> = ({ id, autotekaReportTeaser }) => {
  const [isAutotekaLinkLoading, setIsAutotekaLinkLoading] = useState(false);
  const [autotekaData, setAutotekaData] = React.useState<TeaserData[] | null>(null);
  const s = useStyles();

  useEffect(() => {
    if (autotekaReportTeaser) {
      setAutotekaData(getAutotekaTeaserData(autotekaReportTeaser));
    }
  }, [autotekaReportTeaser]);
  const fetchAutotekaLink = async () => {
    setIsAutotekaLinkLoading(true);
    try {
      const { data } = await getAutotekaReportLink(id);
      window.open(data.url, '_ blank');
    } catch (e) {
      console.log(e);
    } finally {
      setIsAutotekaLinkLoading(false);
    }
  };
  return (
    <Paper elevation={0} className={s.bordered}>
      <AutotekaLogo />
      <Typography className={s.title}>
        {autotekaReportTeaser ? 'Отчет Автотеки по автомобилю' : 'Получите подробную историю автомобиля'}
      </Typography>
      {autotekaReportTeaser !== null ? (
        <>
          <Divider />
          <div className={s.teaserRoot}>
            <Teaser data={autotekaData!} className={s.teaserItem} />
          </div>
        </>
      ) : null}
      <Button
        fullWidth
        className={s.bookButton}
        variant="contained"
        color="primary"
        disabled={isAutotekaLinkLoading}
        onClick={fetchAutotekaLink}
      >
        {isAutotekaLinkLoading && (
          <Box position="absolute" left="calc(50% - 1rem)" top="calc(50% - 1rem)">
            <CircularProgress size="2rem" />
          </Box>
        )}
        {autotekaReportTeaser ? 'Посмотреть полный отчет' : 'Купить отчет об авто'}
      </Button>
    </Paper>
  );
};
