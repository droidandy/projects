import React, { FC, useMemo, ComponentType, SVGProps } from 'react';
import * as icons from 'icons/bodyTypes';
import { Box, Typography } from '@marketplace/ui-kit';

type Props = {
  id: number;
  name: string;
  iconProps?: SVGProps<SVGSVGElement>;
  [key: string]: any;
};

export const BodyItem: FC<Props> = ({ id, name, iconProps, ...rest }) => {
  const Icon = useMemo((): ComponentType<SVGProps<SVGSVGElement>> => {
    switch (id) {
      case 1: {
        return icons.SedanIcon;
      }
      case 2: {
        return icons.Hatchback5DrIcon;
      }
      case 3: {
        return icons.Hatchback3DrIcon;
      }
      case 4: {
        return icons.StationWagonIcon;
      }
      case 5: {
        return icons.CabrioletIcon;
      }
      case 6: {
        return icons.LiftbackIcon;
      }
      case 7: {
        return icons.CoupeIcon;
      }
      case 8: {
        return icons.RoadsterIcon;
      }
      case 9: {
        return icons.SuvIcon;
      }
      case 10: {
        return icons.PickupIcon;
      }
      case 11: {
        return icons.CuvIcon;
      }
      case 12: {
        return icons.LimousineIcon;
      }
      case 13: {
        return icons.MinivanIcon;
      }
      case 14: {
        return icons.VanIcon;
      }
      case 15: {
        return icons.TargaIcon;
      }
      case 16: {
        return icons.Suv3DrIcon;
      }
      case 17: {
        return icons.HardtopIcon;
      }
      case 18: {
        return icons.FastbackIcon;
      }
      default:
        return icons.SedanIcon;
    }
  }, [id]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" height="100%" justifyContent="flex-end" {...rest}>
      <Box mb={1} mt={3.75}>
        <Icon {...iconProps} />
      </Box>
      <Typography variant="body1">{name}</Typography>
    </Box>
  );
};
