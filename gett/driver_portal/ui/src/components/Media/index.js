import { css } from 'styled-components'

export const sizes = {
  desktopLarge: 1920,
  desktopMediumLarge: 1650,
  desktopMedium: 1440,
  desktopSmall: 1280,
  tablet: 1024,
  phoneLarge: 768,
  phoneMedium: 414,
  phoneSmall: 320
}

export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `
  return acc
}, {})

export const breakpoints = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `
  return acc
}, {})
