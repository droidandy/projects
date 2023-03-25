import React, { FC, useState, useRef } from 'react';
import cx from 'classnames';
import { Typography, Grid, Box, PriceFormat, Switch } from '@marketplace/ui-kit';
import { useStyles } from './SwitchBlock.styles';

export interface Props {
  title: string;
  summary?: number;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  sign?: string;
}

const SwitchBlock: FC<Props> = ({ title, summary, checked = false, onChange, sign }) => {
  const s = useStyles();
  const ref = useRef<HTMLButtonElement>(null);
  const [isChecked, setChecked] = useState<boolean>(checked);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked);
    if (onChange) {
      onChange(event, checked);
    }
  };

  return (
    <Grid container spacing={0}>
      <Grid item>
        {/* temporary hoc */}
        <Box>
          <Switch color="primary" checked={isChecked} onChange={handleChange} inputRef={ref} />
        </Box>
      </Grid>
      <Grid item xs>
        <Typography variant="subtitle1">
          <div onClick={() => ref && ref.current?.click()} className={s.title}>
            {title}
          </div>
        </Typography>
      </Grid>
      <Grid item>
        <Grid container alignItems="flex-end">
          <Grid item>
            <Typography
              variant="subtitle1"
              color={isChecked ? 'primary' : 'secondary'}
              className={cx(!isChecked && s.disabledPrice)}
            >
              {summary && (
                <>
                  {sign} <PriceFormat value={summary} />
                </>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SwitchBlock;
