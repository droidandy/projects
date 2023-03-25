import React, { FC } from 'react';
import { Box, Button, Divider, Grid, Paper, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './Certificate.styles';

type Props = {
  handleClick: () => void;
  loading?: boolean;
  qrCode: string;
};

const Certificate: FC<Props> = ({ handleClick, loading, qrCode }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <>
      {isMobile && <Divider />}
      <Paper elevation={0} className={s.root}>
        <Box p={isMobile ? 0 : 5} mb={isMobile ? 2.5 : 0}>
          <Grid container spacing={0} direction={isMobile ? 'column-reverse' : 'row'}>
            <Grid item sm={6} xs={12}>
              <Box pt={2.5} pl={isMobile ? 0 : 5}>
                <Typography variant={isMobile ? 'h5' : 'h4'} align={isMobile ? 'center' : 'left'}>
                  Для вас сформирован персональный сертификат на покупку автомобиля
                </Typography>
                <Box width="22.75rem" maxWidth="100%" mt={isMobile ? 2.5 : 5}>
                  <Button
                    onClick={handleClick}
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                  >
                    <Typography variant="h5" component="span">
                      Скачать сертификат
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Grid>
            {qrCode && (
              <Grid item sm={6} xs={12}>
                <Box pt={isMobile ? 2.5 : 0} display="flex" justifyContent={isMobile ? 'center' : 'flex-end'}>
                  <img src={qrCode} alt="qr-code" className={s.code} />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export { Certificate };
