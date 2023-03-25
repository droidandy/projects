import React from 'react'
import styled, { css } from 'styled-components'
import { Button } from 'components/Button'
import { IconSync } from 'components/Icons'
import { DateTime } from 'components/DateTime'

const Synchronize = ({ loading, date, onSync }) => (
  <Wrapper>
    <SyncDate active={ date }>
      <Icon
        loading={ loading }
        color={ date ? '#74818f' : '#ababb8' }
        width={ 18 }
        height={ 18 }
      />
      <Text>
        { date ? <DateTime value={ date } /> : 'No Sync' }
      </Text>
    </SyncDate>
    <SyncButton disabled={ loading } onClick={ onSync }>Synchronize</SyncButton>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const SyncDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  border-radius: 4px 0px 0px 4px;
  background: #fff;
  min-width: 170px;
  font-size: 14px;
  padding: 0px 15px;

  ${props => props.active ? css`
    color: #74818f;
  ` : css`
    color: #ababb8;
  `};
`

const Icon = styled(IconSync)`
  ${props => props.loading && css`
    animation: spin 1s linear infinite;

    @keyframes spin {
     from {transform:rotate(0deg);}
     to {transform:rotate(360deg);}
    }
  `}
`

const Text = styled.div`
  margin: 0px 10px;
`

const SyncButton = styled(Button)`
  border-radius: 0 4px 4px 0;
  font-size: 14px;
  width: 120px;
`

export default Synchronize
