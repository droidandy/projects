import React, { Component } from 'react'
import styled from 'styled-components'
import { map, isEqual, isEmpty, sortBy, reverse } from 'lodash'

import { Loader } from 'components/Loader'
import { IconTime } from 'components/Icons'

import HistoryElement from './HistoryElement'
import HistoryHeader from './HistoryHeader'

class History extends Component {
  renderHistory() {
    const { data } = this.props
    if (isEmpty(data)) {
      return (
        <Empty>
          <IconTime height={ 40 } width={ 40 } color="#d2dadc" />
          <Text>
            No History
          </Text>
        </Empty>
      )
    }

    let block = []
    let title = ''
    const rhistory = reverse(sortBy(data, 'attemptNumber'))
    map(rhistory, (element, elIndex) => {
      if (!isEmpty(element.reviewUpdates)) {
        const newTitle = `Onboarding Attempt #${element.attemptNumber}`
        if (!isEqual(newTitle, title)) {
          title = newTitle
          block.push(<HistoryHeader key={ `historyTitle_${element.attemptNumber}` } title={ title } />)
        }
        map(element.reviewUpdates, (review, index) => {
          block.push(<HistoryElement
            driver={ element.driver }
            reviewer={ review.reviewer }
            key={ `historyEl_${elIndex}_${index}` }
            { ...review }
          />)
        })
      }
    })
    return block
  }

  render() {
    const { loading } = this.props
    return (
      <Wrapper>
        <Title>
          History
        </Title>
        { loading && <Loader color="#FDB924" /> }
        { this.renderHistory() }
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  flex: 1;
  background-color: #ffffff;
  margin: 20px 0 0 20px;
  padding: 30px;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 5px;
`

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
  height: 100%;
`

const Text = styled.span`
  font-size: 18px;
  color: #8794a0;
  margin-top: 15px;
`

export default History
