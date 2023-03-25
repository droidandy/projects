import React from 'react';

import * as Styled from './wireTransferStyles';

export const bankRequisites = `
Receiving Bank
BMO/HarrisBank

ABA/Routing Number
ABA: 071000288

Recipient Account #
Acct: 3713286

FBO
FBO: Apex Clearing Corporation
For final credit to: [Your name] and All of Us Account# [account number]

Address
Apex Clearing 350 N. St. Paul Street #1300 Dallas, TX 75201`;

export const WireTransfer = (): JSX.Element => (
  <Styled.Container>
    <Styled.Text>Here are the wire instructions to provide to your financial institution.</Styled.Text>

    <Styled.Text>
      Note: We can only accept wires from a bank account with a common owner on your All of Us account.
    </Styled.Text>

    <Styled.SubText>Receiving Bank</Styled.SubText>

    <Styled.Text>BMO/HarrisBank</Styled.Text>

    <Styled.SubText>ABA/Routing Number</Styled.SubText>

    <Styled.Text>ABA: 071000288</Styled.Text>

    <Styled.SubText>Recipient Account #</Styled.SubText>

    <Styled.Text>Acct: 3713286</Styled.Text>

    <Styled.SubText>FBO</Styled.SubText>

    <Styled.Text>
      FBO: Apex Clearing Corporation For final credit to: [Your name] and All of Us Account# [account number]
    </Styled.Text>

    <Styled.SubText>Address</Styled.SubText>

    <Styled.Text>Apex Clearing 350 N. St. Paul Street #1300 Dallas, TX 75201</Styled.Text>
  </Styled.Container>
);
