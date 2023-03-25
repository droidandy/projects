import { render, fireEvent, cleanup } from '@testing-library/react-native';
import React from 'react';
import 'jest-styled-components'

import { TargetPriceModal } from '../TargetPrice';

afterEach(cleanup);

const targetPrice = [
  { value: '100', result: "0.0%" },
  { value: '102', result: "2.0%" },
  { value: '50', result: "-50.0%" },
  { value: '108', result: "8.0%" },
]

const targetPercent = [
  { value: '0', result: "$100" },
  { value: '2', result: "$102" },
  { value: '-50', result: "$50" },
  { value: '10', result: "$110" },
]

test('examples of some things', () => {
  const {
    getByTestId, getByText,
  } = render(
    <TargetPriceModal />,
  );

  const setPriceButton = getByText(/Set Price/i);
  expect(setPriceButton).toBeDefined();

  const input = getByTestId('input')

  expect(input.props.value).toBe(
    '100',
  )

  targetPrice.forEach((value) => {
    fireEvent.changeText(input, value.value)

    expect(input.props.value).toBe(
      value.value,
    )

    expect(getByTestId('leftText').props.children).toBe(
      value.result,
    )
  });

  const switchButton = getByTestId('switchButton')
  fireEvent.press(switchButton)

  expect(input.props.value).toBe(
    '8',
  )

  targetPercent.forEach((value) => {
    fireEvent.changeText(input, value.value)

    expect(input.props.value).toBe(
      value.value,
    )

    expect(getByTestId('leftText').props.children).toBe(
      value.result,
    )
  });
});
