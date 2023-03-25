import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { IconApproved, IconRejected } from 'components/Icons'

const RHISTORY_TYPES = {
  language: 'Language',
  training: 'Training',
  attitude_competence: 'Attitude Competence',
  vehicle: 'Vehicle',
  phone_contract: 'Phone Contract '
}

const HistoryElement = ({ completed, requirement, comment, createdAt, driver, reviewer }) => (
  <Wrapper>
    <Status>
      {completed && <IconApproved width={ 30 } height={ 30 } />}
      {!completed && <IconRejected width={ 30 } height={ 30 } />}
    </Status>
    <Content>
      <Text>
        <span>
          <b>{ reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : 'Artem' }</b>
          {completed ? ' passed' : ' failed'}
          {driver ? ` ${driver.firstName} ${driver.lastName}` : ''}
        </span>
      </Text>
      <Text>
        { `${RHISTORY_TYPES[requirement] || requirement} ${completed ? 'Completed' : 'Failed'} ${comment ? ` with comment:` : ``}` }
      </Text>
      {comment && <Text>
        <b>"{ comment }"</b>
      </Text>}
      <Date>
        { moment.utc(createdAt).format('MMMM D, YYYY') }
      </Date>
    </Content>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  margin-top: 20px;
`

const Status = styled.div`
  min-width: 30px;
`

const Text = styled.div`
  font-size: 14px;
  font-weight: normal;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`

const Date = styled.div`
  font-size: 14px;
  font-weight: normal;
  color: #8794a0;
  margin-top: 4px;
`

export default HistoryElement
