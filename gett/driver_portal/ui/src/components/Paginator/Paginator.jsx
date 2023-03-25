import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { range, forEach, ceil, first, last } from 'lodash'
import { IconArrow } from 'components/Icons'

class Paginator extends Component {
  render() {
    const { page, onClick } = this.props

    return (
      <Wrapper>
        <Link
          disabled={ this.isFirst() }
          onClick={ () => !this.isFirst() && onClick(page - 1) }
        >
          <Icon><IconArrowLeft color="#f6b530" /></Icon>
          Back
        </Link>
        <Pages>{ this.pages() }</Pages>
        <Link
          disabled={ this.isLast() }
          onClick={ () => !this.isLast() && onClick(page + 1) }
        >
          Next
          <Icon><IconArrowRight color="#f6b530" /></Icon>
        </Link>
      </Wrapper>
    )
  }

  isLast() {
    const { page } = this.props
    return page === this.pagesCount()
  }

  isFirst() {
    const { page } = this.props
    return page === 1
  }

  pages() {
    const { page, onClick } = this.props
    const pageNums = this.pageNums()
    const pages = []

    forEach(pageNums, (pageNum, index) => {
      if (index > 0 && pageNums[index] - pageNums[index - 1] > 1) {
        pages.push(
          <Page key={ `dots-${index}` }>...</Page>
        )
      }

      pages.push(
        <Link key={ index } onClick={ () => onClick(pageNum) }>
          <Page active={ pageNum === page } >{ pageNum }</Page>
        </Link>
      )
    })

    return pages
  }

  pageNums() {
    const { page } = this.props

    let pageNums = range(Math.max(1, page - 1), Math.min(this.pagesCount(), page + 2))

    if (first(pageNums) !== 1) {
      pageNums = [ 1, ...pageNums ]
    }

    if (last(pageNums) !== this.pagesCount()) {
      pageNums = [ ...pageNums, this.pagesCount() ]
    }

    return pageNums
  }

  pagesCount() {
    const { total, perPage } = this.props
    return ceil(total / perPage)
  }
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin: 0px 10px;
`

const IconArrowLeft = styled(IconArrow)`
  color: #f6b530;
`

const IconArrowRight = styled(IconArrow)`
  color: #f6b530;
  transform: rotate(180deg);
`

const Link = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  text-align: left;
  color: #f6b530;
  cursor: pointer;

  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: default;
  `}
`

const Icon = styled.span`
  margin: 0px 10px;
`

const Pages = styled.div`
  margin: 0px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Page = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  ${props => props.active && css`
    border: solid 1px #f6b530;
  `}
`

export default Paginator
