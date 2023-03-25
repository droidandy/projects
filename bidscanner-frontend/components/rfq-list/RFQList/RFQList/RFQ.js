// @flow
import React from 'react';
import styled from 'styled-components';
import { Row, Col, Media } from 'reactstrap';
import distanceInWords from 'date-fns/distance_in_words';

import KeywordList, { type KeywordListProps } from 'components/general/KeywordList';
import MetaInfo, { type MetaInfoProps } from 'components/item-list/ItemList/ItemList/MetaInfo';

const Icon = styled.div`
  & > i {
    margin-right: 5px;
  }

  margin-right: 10px;
  font-size: 0.8em;
  color: black;
  text-decoration: none;
`;

export type RFQProps = MetaInfoProps &
  KeywordListProps & {
    name: string,
    description: string,
    keywords: string[],
    imgSrc: string,
    expireTime: string
  };

export default ({ name, description, seenTimes, likedTimes, imgSrc, keywords, expireTime }: ItemProps) => (
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
        <div className="d-flec justify-content-start">
          <Icon>
            <i className="fa fa-hourglass-end" aria-hidden="true" />
            {distanceInWords(new Date(), expireTime, { addSuffix: true })}
          </Icon>
        </div>
        {description}
      </Media>
    </Media>
    <Col className="mt-2 d-flex justify-content-end">
      <KeywordList keywords={keywords} />
    </Col>
  </Row>
);
