import React from 'react';
import { ContainerButton, ContainerSwithButton, TabButton } from './styles';

export const CategotiesButtons = ({ categoties = [], active, setActive }) =>
  <ContainerSwithButton>
    <ContainerButton>
      <TabButton active={active === "All"} onClick={() => setActive("All")}>All</TabButton>
      {
        categoties.map(
          ({ id, title }) =>
            <TabButton key={id} active={active === id} onClick={() => setActive(id)}>{title}</TabButton>
        )
      }
    </ContainerButton>
  </ContainerSwithButton>;
