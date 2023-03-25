import React from 'react'
import styled from 'styled-components'
import { DesktopMedium } from 'components/MediaQuery'
import { media } from 'components/Media'
import mainImage1024 from 'assets/images/main_image_1024.jpg'
import mainImage1280 from 'assets/images/main_image_1280.jpg'
import mainImage1440 from 'assets/images/main_image_1440.jpg'
import mainImage1920 from 'assets/images/main_image_1920.jpg'
import Main from './Main'

const AnonymousLayout = ({ children }) => (
  <Wrapper>
    <DesktopMedium>
      <Wallpaper />
    </DesktopMedium>
    <Main>
      { children }
    </Main>
  </Wrapper>
)

const Wrapper = styled.div`
  margin: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${media.phoneSmall`width: 320px; height: auto;`}
`

const Wallpaper = styled.div`
  width: 1200px;
  background-color: #000;
  height: 100vh;
  background: url('${mainImage1920}') no-repeat center/cover;

  ${media.desktopMedium`
    width: 1000px;
    background: url('${mainImage1440}') no-repeat center/cover;
  `}
  ${media.desktopSmall`
    width: 840px;
    background: url('${mainImage1280}') no-repeat center/cover;
  `}
  ${media.tablet`
    width: 644px;
    background: url('${mainImage1024}') no-repeat center/cover;
  `}
`

export default AnonymousLayout
