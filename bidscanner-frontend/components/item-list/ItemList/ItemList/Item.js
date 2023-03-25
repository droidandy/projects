// @flow
import React from 'react';
import { Row, Col, Media } from 'reactstrap';
import KeywordList, { type KeywordListProps } from 'components/general/KeywordList';
import Price, { type PriceProps } from 'components/item-list/ItemList/ItemList/Price';
import MetaInfo, { type MetaInfoProps } from 'components/item-list/ItemList/ItemList/MetaInfo';

export type ItemProps = PriceProps &
  MetaInfoProps &
  KeywordListProps & {
    name: string,
    description: string,
    keywords: string[],
    imgSrc: string
  };

export default ({
  name,
  description,
  seenTimes,
  likedTimes,
  imgSrc,
  keywords,
  currency,
  price,
}: ItemProps) => (
  <Row>
    <Media className="mt-4">
      <Media left href="#" className="mr-3">
        <Media object src={imgSrc} alt={name} />
        <MetaInfo seenTimes={seenTimes} likedTimes={likedTimes} />
      </Media>
      <Media body>
        <Media heading>
          {name}
        </Media>
        <div className="d-flex justify-content-start">
          <Price price={price} currency={currency} />
        </div>
        {description}
      </Media>
    </Media>
    <Col className="mt-2 d-flex justify-content-end">
      <KeywordList keywords={keywords} />
    </Col>
  </Row>
);
