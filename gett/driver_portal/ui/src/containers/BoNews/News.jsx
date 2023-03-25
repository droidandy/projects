import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { debounce, isEmpty, isEqual, map, pick } from 'lodash'
import { DateTime } from 'components/DateTime'
import { media } from 'components/Media'
import { BackOfficeLayout } from 'containers/Layouts/BackOfficeLayout'
import { Empty } from 'components/Empty'
import { Button } from 'components/Button'
import { Bottom } from './components/Bottom'
import Permissions from 'components/hocs/permissions'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'
import {
  Grid,
  GridHeader,
  GridHeaders,
  ScrollableBody,
  GridRow,
  GridColumn,
  Dots,
  GridColumnEllipsis
} from 'components/Grid'
import { Active, Inactive } from 'components/Status'
import { Actions } from './components/Actions'

const PER_PAGE = 20
const PAGE = 1

class News extends Component {
  state = {
    page: PAGE,
    perPage: PER_PAGE
  }

  componentWillMount() {
    this.props.initialize()
  }

  componentDidMount() {
    this.loadNews()
  }

  componentDidUpdate(prevProps, prevState) {
    const importantFields = [ 'page', 'perPage' ]

    const dirty = !isEqual(
      pick(prevState, importantFields),
      pick(this.state, importantFields)
    )

    if (dirty) {
      this.loadNews()
    }
  }

  render() {
    const { page, perPage } = this.state
    const { currentUser, logout, loading, total, history: { location }, news } = this.props
    const CreateButton = Permissions('news_edit', <Button onClick={ this.create }>+ Create new</Button>)

    return (
      <BackOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
      >
        <Container>
          <PageHeader>
            <PageName>News and Information</PageName>
            <CreateButton />
          </PageHeader>
          <GridWrapper>
            {
              isEmpty(news) ? (
                <Empty loading={ loading } />
              ) : (
                <Grid>
                  <GridHeaders>
                    <GridHeader flex={ 4 } margin="0 30px 0 0">Name</GridHeader>
                    <GridHeader>Publish Date</GridHeader>
                    <GridHeader flex={ 2 }>Authors</GridHeader>
                    <GridHeader>Views</GridHeader>
                    <GridHeader>Comments</GridHeader>
                    <GridHeader>Status</GridHeader>
                    <GridHeader flex={ 0.5 } />
                  </GridHeaders>
                  <ScrollableBody>
                    {
                      map(news, item => (
                        <GridRow key={ item.id }>
                          <GridColumnEllipsis flex={ 4 } margin="0 30px 0 0">
                            <span>{ item.title }</span>
                          </GridColumnEllipsis>
                          <GridColumn>{ item.publishedAt && <DateTime value={ item.publishedAt } /> }</GridColumn>
                          <GridColumn flex={ 2 }>{ item.author.name }</GridColumn>
                          <GridColumn>{ item.viewsCount }</GridColumn>
                          <GridColumn>{ item.commentsCount }</GridColumn>
                          <GridColumn>
                            <StatusLabelsHolder>
                              { item.published ? (
                                <Active>published</Active>
                              ) : (
                                <Inactive>unpublished</Inactive>
                              )}
                            </StatusLabelsHolder>
                          </GridColumn>
                          <GridColumn flex={ 0.5 }>
                            <Actions
                              trigger={ <Dots /> }
                              item={ item }
                              onRemove={ this.remove }
                              onLoginAsUser={ this.loginAs }
                              onEdit={ this.edit }
                              onPreview={ this.preview }
                            />
                          </GridColumn>
                        </GridRow>
                      ))
                    }
                  </ScrollableBody>
                </Grid>
              )
            }
          </GridWrapper>
          <Bottom
            page={ page }
            perPage={ perPage }
            total={ total }
            onChange={ this.paginate }
          />
        </Container>
      </BackOfficeLayout>
    )
  }

  loadNews = debounce(() => {
    const { page, perPage } = this.state
    this.props.loadNews({ page, perPage })
  }, 300)

  paginate = ({ page, perPage }) => {
    this.setState({ page: page || 1, perPage: perPage || this.state.perPage })
  }

  edit = (item) => {
    if (item && item.id) {
      this.props.history.push(`bonews/edit/${item.id}`)
    }
  }

  create = () => {
    this.props.history.push('bonews/create')
  }

  preview = (item) => {
    if (item && item.id) {
      this.props.history.push(`bonews/preview/${item.id}`)
    }
  }

  remove = (item) => {
    if (item && item.id) {
      this.props.removeArticle({ item })
    }
  }
}

const Container = styled.div`
  position: relative;
  width: 100%;
  background-color: #f4f7fa;
  padding-bottom: 70px;
  min-height: 100%;
  height: 100%;
`

const GridWrapper = styled.div`
  padding: 30px 30px 30px;
  margin-top: 10px;
  width: 100%;
  height: 100%;
  background-color: #f4f7fa;
`

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
  margin-right: 30px;
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin: auto;
  margin-left: 30px;

  ${media.phoneLarge`
    font-size: 22px;
    margin-left: 15px;
  `}
`

const StatusLabelsHolder = styled.div`
  display: flex;

  & > div {
    width: 100px;
  }
`

export default connect(mapStateToProps, mapDispatchToProps)(News)
