import React, { FC, memo } from 'react';
import { Field } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { upload } from 'api/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FileLoader from 'components/FileLoader/mono';
import { InputYouTubeVideo } from './fields/InputYouTubeVideo';

const useStyles = makeStyles(
  ({ palette: { background }, breakpoints: { down } }) => ({
    block: {
      padding: '1.25rem 0',
    },
    titleBlock: {
      paddingBottom: '1.25rem',
    },
    imageVehicle: {
      '& button': {
        backgroundColor: background.paper,
      },
    },
    imagesPts: {
      '& button': {
        border: `1px solid ${background.paper}`,
        [down('xs')]: { background: background.paper },
      },
    },
  }),
  { name: 'VehicleMediaFieldSet' },
);

interface TitlePops {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

const Title = ({ title, subtitle }: TitlePops) => {
  const classes = useStyles();
  return (
    <div className={classes.titleBlock}>
      <Typography variant="h5" component="p">
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      ) : null}
    </div>
  );
};

type Props = {
  isEdition?: boolean;
};

export const VehicleMediaFieldSet: FC<Props> = memo(({ isEdition }) => {
  const classes = useStyles();
  const { isMobile } = useBreakpoints();
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.block} id="imagesExterior">
        <Title
          title={!isEdition ? 'Фотография экстерьера' : 'Фотографии автомобиля'}
          subtitle={!isEdition ? 'Не менее 1 и не более 10' : 'Не менее 1 и не более 20'}
        />
        <Field name="imagesExterior">
          {({ input, meta }) => (
            <FileLoader
              key="exterior"
              name={input.name}
              defaultValue={input.value}
              onChange={input.onChange}
              error={meta.touched && meta.error}
              upload={upload}
              maxFiles={isEdition ? 20 : 10}
              description="Основная фотография"
            />
          )}
        </Field>
      </div>
      {!isEdition ? (
        <div className={classes.block}>
          <Title title="Фотография салона" subtitle="Не менее 1 и не более 10" />
          <Field name="imagesInterior">
            {({ input, meta }) => (
              <FileLoader
                key="interior"
                name={input.name}
                defaultValue={input.value}
                onChange={input.onChange}
                error={meta.touched && meta.error}
                upload={upload}
                maxFiles={10}
              />
            )}
          </Field>
        </div>
      ) : null}
      <div className={classes.block}>
        <Title
          title={
            <>
              Видео
              {isMobile ? (
                <Typography variant="body2" component="span" color="textSecondary" style={{ paddingLeft: '.75rem' }}>
                  Необязательно
                </Typography>
              ) : null}
            </>
          }
        />
        <InputYouTubeVideo name="videoUrl" placeholder="Ссылка на видео с Youtube" />
      </div>
      {/* <div className={classes.block} style={{ paddingBottom: 0 }}>
        <Title title="Фотографии СТС" />
        <Grid container spacing={4}>
          <Grid item xs={6} sm={3}>
            <Field name="stsFront">
              {({ input }) => (
                <FileLoader
                  key="stsFront"
                  name={input.name}
                  defaultValue={input.value}
                  maxFiles={1}
                  upload={upload}
                  onChange={input.onChange}
                  orientation="book"
                  description="Первая сторона"
                  xs={12}
                  sm={12}
                />
              )}
            </Field>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Field name="stsBack">
              {({ input }) => (
                <FileLoader
                  key="stsBack"
                  name={input.name}
                  defaultValue={input.value}
                  maxFiles={1}
                  upload={upload}
                  onChange={input.onChange}
                  orientation="book"
                  description="Вторая сторона"
                  xs={12}
                  sm={12}
                />
              )}
            </Field>
          </Grid>
        </Grid>
      </div> */}
    </DndProvider>
  );
});
