import React, { memo, useMemo, FC, useCallback } from 'react';
import { useFormState } from 'react-final-form';
import NumberFormat from 'react-number-format';
import { StickerData } from '@marketplace/ui-kit/types';
import { Typography, Img, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { useVehicleCreateDataProperties } from 'store/catalog/create/data';
import { useVehicleCreateStickers } from 'store/catalog/create/stickers';
import * as icons from 'icons/bodyTypes';
import { StickersChips } from 'components/StickersChips';
import { BodyIconRecord } from '../constants';
import { getDataItem, getDataOption } from '../utils';
import { useStyles } from './Preview.styles';

interface PreviewFallbackProps {
  bodyId?: number | null;
  className?: string;
}
interface PreviewComponentProps {
  title: string;
  year?: number | string | null;
  imgSrc?: string;
  mileage?: number | string | null;
  vin?: string | null;
  equipment?: string | null;
  color?: string | null;
  price?: string | number | null;
  bodyId?: number | null;
  stickers?: StickerData[] | null;
}
export const PreviewFallback: FC<PreviewFallbackProps> = ({ bodyId, className }) => {
  const Icon =
    (bodyId && Object.keys(BodyIconRecord).includes(bodyId.toString()) && BodyIconRecord[bodyId]) || icons.SedanIcon;

  return (
    <div className={className}>
      <Icon />
    </div>
  );
};
const PreviewComponent = ({
  title,
  year,
  imgSrc,
  mileage,
  vin,
  equipment,
  color,
  price,
  bodyId,
  stickers,
}: PreviewComponentProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const getStickersShips = useCallback(
    (isVisible: boolean) =>
      isVisible && !!stickers?.length ? (
        <div className={s.stickersContainer}>
          <StickersChips items={stickers} />
        </div>
      ) : null,
    [stickers],
  );

  return (
    <>
      <div className={s.previewWrapper}>
        {imgSrc ? (
          <Img src={imgSrc} contain className={s.previewImage} />
        ) : (
          <PreviewFallback bodyId={bodyId} className={s.previewFallback} />
        )}
        {getStickersShips(!isMobile)}
      </div>
      <div className={s.contentBlock}>
        <Typography variant="h5">{title}</Typography>
      </div>
      {getStickersShips(isMobile)}
      <div className={s.infoBlock}>
        <Typography variant="body2" color="textSecondary">
          {year ? `${year} год` : null}
          {mileage ? (
            <NumberFormat
              value={mileage}
              thousandSeparator={' '}
              displayType="text"
              prefix={year ? ', ' : undefined}
              suffix=" км"
            />
          ) : null}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {vin ? `VIN: ${vin}` : null}
        </Typography>
      </div>
      <div className={s.contentBlock}>
        {equipment ? <Typography variant="body2">{equipment}</Typography> : null}
        {color ? <Typography variant="body2">Цвет: {color}</Typography> : null}
      </div>
      <div className={s.contentBlock}>
        {price ? (
          <Typography variant="h3" component="p">
            <PriceFormat value={price} />
          </Typography>
        ) : null}
      </div>
    </>
  );
};

export const PreviewCreate = memo(() => {
  const { brand, model, transmission, engine, drive, modification, color } = useVehicleCreateDataProperties();
  const {
    state: { stickers },
  } = useVehicleCreateStickers();
  const { values } = useFormState<VehicleFormSellValues>();
  const vehicleTitle = useMemo<string>(() => {
    const brandItem = getDataOption(brand, values.brand);
    const modelItem = getDataOption(model, values.model);
    const vehicleDataArray = [brandItem?.label, modelItem?.label].filter((i) => !!i);

    return vehicleDataArray.join(' ');
  }, [brand, model, values]);

  const vehicleData = useMemo<string | null>(() => {
    const engineItem = getDataItem(engine, values.engine);
    const transmissionItem = getDataItem(transmission, values.transmission);
    const driveItem = getDataItem(drive, values.drive);
    const modificationItem = getDataItem(modification, values.modification);

    const vehicleDataArray = [
      transmissionItem?.name,
      driveItem?.name,
      engineItem?.name,
      modificationItem && `${modificationItem.volume} л.`,
      modificationItem && `${modificationItem.power} л.с.`,
    ].filter((i) => !!i);

    return vehicleDataArray.length ? vehicleDataArray.join(' • ') : null;
  }, [transmission, engine, drive, modification, values]);

  const imgSrc = values.imagesExterior?.split(',')[0] || '';
  const colorData = getDataItem(color, values.color);
  const selectedStickers = stickers.filter(({ id }) => values.stickers?.includes(id));

  return (
    <PreviewComponent
      title={vehicleTitle}
      imgSrc={imgSrc}
      equipment={vehicleData}
      color={colorData?.name}
      year={values.year}
      mileage={values.mileage}
      vin={values.vin}
      price={values.price}
      bodyId={values.body}
      stickers={selectedStickers}
    />
  );
});
