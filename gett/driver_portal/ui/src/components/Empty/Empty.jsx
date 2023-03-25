import React from 'react'
import styled from 'styled-components'
import { breakpoints } from 'components/Media'
import { Loader } from 'components/Loader'
import Picture from './Picture'

const Empty = ({ loading, children }) => (
  <Wrapper>
    {
      loading ? (
        <Loader />
      ) : (
        <div>
          <Picture />
          <Text>
            { children || defaultMessageText }
          </Text>
        </div>
      )
    }
  </Wrapper>
)

const defaultMessageText = `
  No data was found by this query
`

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 80px;

  ${breakpoints.phoneLarge`
    margin-top: 160px;
  `}
`

const Text = styled.div`
  font-size: 14px;
  text-align: center;
  color: #000000;
  margin-top: 30px;
`

export default Empty
