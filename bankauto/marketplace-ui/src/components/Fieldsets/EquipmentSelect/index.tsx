import React, { FC } from 'react';
import cx from 'classnames';
import { Field, FieldRenderProps } from 'react-final-form';
import Grid from '@marketplace/ui-kit/components/Grid';
import { FormControlBlock } from 'components/FormControlBlock';
import Typography from '@marketplace/ui-kit/components/Typography';
import { useStyles } from './EquipmentSelect.styles';
import { BodyItem } from './BodyItem';
import { GenerationItem } from './GenerationItem';

interface Option {
  label: JSX.Element | string;
  key: string;
  value: any;
}

interface SelectPropsBase {
  name: string;
  title?: string;
  className?: string;
  show?: boolean;
}

export const EquipmentSelectBase = ({
  title,
  input,
  meta,
  options,
  className,
  show,
}: FieldRenderProps<string, HTMLSelectElement>) => {
  const classes = useStyles();
  const variants: Option[] = options || meta.data?.options || [];
  return (
    <FormControlBlock show={show || !!variants.length} register className={cx(classes.root, className)}>
      <Typography variant="h5" component="p" className={classes.title}>
        {title}
      </Typography>
      <Grid container spacing={4}>
        {variants.map(({ label, value }) => (
          <Grid item xs={12} sm={3}>
            <div
              className={cx(classes.button, value === input.value ? classes.buttonActive : classes.buttonDefault)}
              onClick={() => {
                input.onChange(value);
              }}
            >
              {label}
            </div>
          </Grid>
        ))}
      </Grid>
    </FormControlBlock>
  );
};

type SelectBodyOption = { id: number; name: string };

interface SelectPropsBody extends SelectPropsBase {
  options?: SelectBodyOption[];
}

export const EquipmentSelectBody: FC<SelectPropsBody> = ({ name, options, ...rest }) => {
  const classes = useStyles();
  return (
    <Field name={name} type="select">
      {({ input, meta }) => {
        const variants: SelectBodyOption[] = options || meta.data?.options || [];
        return (
          <EquipmentSelectBase
            className={classes.withSvg}
            input={input}
            meta={meta}
            options={variants.map((option) => ({
              label: <BodyItem id={option.id} name={option.name} />,
              value: option.id,
            }))}
            {...rest}
          />
        );
      }}
    </Field>
  );
};

type SelectGenerationOption = {
  id: number;
  name: string;
  startYear: number;
  endYear: number;
};

interface SelectPropsGeneration extends SelectPropsBase {
  options?: SelectGenerationOption[];
}

export const EquipmentSelectGeneration: FC<SelectPropsGeneration> = ({ name, options, ...rest }) => {
  return (
    <Field name={name} type="select">
      {({ input, meta }) => {
        const variants: SelectGenerationOption[] = options || meta.data?.options || [];
        return (
          <EquipmentSelectBase
            input={input}
            meta={meta}
            options={variants.map(({ id, name, endYear, startYear }) => ({
              label: <GenerationItem name={name} endYear={endYear} startYear={startYear} />,
              value: id,
            }))}
            {...rest}
          />
        );
      }}
    </Field>
  );
};

type SelectNodeOption = {
  id: number;
  name: string;
};

interface SelectPropsNode extends SelectPropsBase {
  options?: SelectNodeOption[];
}

export const EquipmentSelectNode: FC<SelectPropsNode> = ({ name, options, ...rest }) => {
  return (
    <Field name={name} type="select">
      {({ input, meta }) => {
        const variants: SelectNodeOption[] = options || meta.data?.options || [];
        return (
          <EquipmentSelectBase
            input={input}
            meta={meta}
            options={variants.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
            {...rest}
          />
        );
      }}
    </Field>
  );
};
