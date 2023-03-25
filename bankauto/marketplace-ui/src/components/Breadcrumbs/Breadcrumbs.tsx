import React, { FC, memo } from 'react';
import MuiBreadcrumbs, { BreadcrumbsProps as MuiBreadcrumbsProps } from '@material-ui/core/Breadcrumbs';
import { Typography, Box } from '@marketplace/ui-kit';
import { Link } from 'components/Link';
import { ReactComponent as ArrowBread } from 'icons/arrowBread';
import { MicrodataProps, SchemaName } from 'constants/structuredData';
import { generateJsonLD } from 'helpers/generateJsonLD';
import { HeadScript } from 'components/HeadScript';
import { MicrodataContainer } from 'containers/MicrodataContainer';

export interface BreadCrumbsItem {
  to?: string;
  label: string;
}

export type Props = MuiBreadcrumbsProps & {
  breadcrumbs: BreadCrumbsItem[];
};

const BreadcrumbsRoot: FC<Props> = ({ breadcrumbs, separator = <ArrowBread />, ...rest }) => {
  const microdataProps: MicrodataProps<BreadCrumbsItem[], SchemaName> = {
    data: breadcrumbs,
    type: SchemaName.BREADCRUMBS,
  };
  const jsonLD = generateJsonLD(microdataProps);
  return (
    <Box py={0.875}>
      <MicrodataContainer {...microdataProps} />
      <HeadScript type="application/ld+json" script={jsonLD} />
      <MuiBreadcrumbs separator={separator} {...rest} aria-label="breadcrumb">
        {breadcrumbs.map(({ to, label }, index) =>
          index !== breadcrumbs.length - 1 ? (
            <Link key={to} href={to} variant="subtitle2" color="primary">
              {label}
            </Link>
          ) : (
            <Typography variant="subtitle2" component="span" color="secondary">
              {label}
            </Typography>
          ),
        )}
      </MuiBreadcrumbs>
    </Box>
  );
};

const Breadcrumbs: FC<Props> = memo(BreadcrumbsRoot);

export default Breadcrumbs;
