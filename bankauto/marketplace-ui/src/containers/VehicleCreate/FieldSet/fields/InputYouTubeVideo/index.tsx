import React, { FC, useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { Img, Icon, Grid, Typography, InputBase } from '@marketplace/ui-kit';
import { ReactComponent as IconDeleteRed } from '@marketplace/ui-kit/icons/icon-delete-red.svg';
import { getYouTubeVideoId } from 'helpers';
import { useStyles } from './InputYouTubeVideo.styles';

type RenderProps = FieldRenderProps<string, HTMLElement>;
type Props = FieldProps<string, RenderProps, HTMLElement>;

const InputYouTubeVideoRender: FC<FieldRenderProps<string, HTMLElement>> = ({ input, meta }) => {
  const classes = useStyles();
  const { value, onChange } = input;
  const [preview, setPreview] = useState('');

  const inputProps = useMemo(() => {
    return {
      endAdornment: value ? (
        <Icon viewBox="0 0 20 20" onClick={() => onChange('')} component={IconDeleteRed} cursor="pointer" />
      ) : (
        <Typography variant="caption" color="textSecondary" className={classes.caption}>
          Необязательно
        </Typography>
      ),
    };
  }, [classes, onChange, value]);
  useEffect(() => {
    if (value) {
      const videoId = getYouTubeVideoId(`${value}`);
      setPreview(videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : '');
    } else {
      setPreview('');
    }
  }, [value]);

  return (
    <Grid container alignItems="center" spacing={5} className={classes.root}>
      <Grid item xs={12} sm={9}>
        <InputBase
          label=" "
          className={classes.input}
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          name={input.name}
          value={input.value}
          onBlur={input.onBlur}
          onChange={input.onChange}
          InputProps={inputProps}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        {preview ? (
          <div className={classes.preview}>
            <Img src={preview} alt="youtube video preview" />
          </div>
        ) : null}
      </Grid>
    </Grid>
  );
};

export const InputYouTubeVideo: FC<Props> = ({ name, ...rest }) => {
  return <Field name={name} {...rest} component={InputYouTubeVideoRender} />;
};
