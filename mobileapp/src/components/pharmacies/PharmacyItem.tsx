import React from 'react';
import { ListPharmacyFragment } from '../../apollo/requests';
import { PharmacyLike } from '../buttons/PharmacyLike/PharmacyLike';
import { PharmacyRender } from './PharmacyRender';

interface Props {
  pharmacy: ListPharmacyFragment;
}

const PharmacyItemBase = ({ pharmacy }: Props) => (
  <PharmacyRender pharmacy={pharmacy}>
    <PharmacyLike pharmacy={pharmacy} />
  </PharmacyRender>
);

export const PharmacyItem = React.memo<Props>(PharmacyItemBase);
