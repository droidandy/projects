import React from 'react';

export type Organization = {
  name: string;
  legalName: string;
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  telephone: string;
  email: string;
  url: string;
  promo: string;
};

export interface OrganizationMicrodataProps {
  data: Organization;
}

const ContainerOrganizationMicrodata = ({ data }: OrganizationMicrodataProps) => {
  const { name, streetAddress, postalCode, addressLocality, telephone, email, url, promo } = data;

  return (
    <div itemScope itemType="https://schema.org/Organization">
      <meta itemProp="name" content={name} />
      <span itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
        <meta itemProp="streetAddress" content={streetAddress} />
        <meta itemProp="postalCode" content={postalCode} />
        <meta itemProp="addressLocality" content={addressLocality} />
      </span>
      <meta itemProp="telephone" content={telephone} />
      <meta itemProp="email" content={email} />
      <link itemProp="sameAs" href={url} />
      <link itemProp="sameAs" href={promo} />
    </div>
  );
};

export default ContainerOrganizationMicrodata;
