// @flow
import styled from 'styled-components';

import type { PublicOrPrivateT, RealOrEstimateT } from 'components/new-rfq/types/types';

const TogglePanel = styled.div`
  background-color: white;
  color: black;
  font-weight: bold;
  padding: 0.5rem 0.5rem;
  border: 1px solid black;
`;

const NotChosen = styled.span`
  background-color: #dedede;
  padding: 0.5rem 1rem;
  color: #989898;
  margin-right: 0.5rem;
  border-radius: 2px;
  // box-shadow: -2px 2px 5px 2px rgba(0,0,0,0.75);
  width: 9rem;
  text-align: center;
  user-select: none;
`;

const Chosen = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
  padding: 5px 10px;
  width: 9rem;
  text-align: center;
  user-select: none;
`;

type Tuple2 = [PublicOrPrivateT, PublicOrPrivateT] | [RealOrEstimateT, RealOrEstimateT];
// type Value = PublicOrPrivateT | RealOrEstimateT;

type ToggleProps = {
  // TODO: have eslint errors, very strange

  /*
  input: {
    value: Value
  },
  */
  options: Tuple2
};

const Toggle = ({ input: { value, onChange }, options }: ToggleProps) => {
  const [first, second] = options;
  let chosenOption;
  if (!value) chosenOption = first;
  else chosenOption = value;
  const notChosenOption = first === chosenOption ? second : first;
  return (
    <div>
      <TogglePanel className="d-flex align-items-center">
        <Chosen role="button">{chosenOption}</Chosen>
        <NotChosen role="button" onClick={() => onChange(notChosenOption)}>{notChosenOption}</NotChosen>
      </TogglePanel>
    </div>
  );
};

export default Toggle;
