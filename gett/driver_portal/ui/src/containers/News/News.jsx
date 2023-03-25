import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { media } from 'components/Media'
import { Loader } from 'components/Loader'
import { Empty } from 'components/Empty'
import { FrontOfficeLayout } from 'containers/Layouts/FrontOfficeLayout'
import { Article } from 'components/Articles/Article'
import { Featured } from 'components/Articles/Featured'
import { Numbers } from 'components/Articles/Numbers'
import { Simple } from 'components/Articles/Simple'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

const PAGE = 1
const PER_PAGE = 20

class News extends Component {
  state = {
    page: PAGE,
    perPage: PER_PAGE
  }

  componentWillMount() {
    this.props.initialize()
  }

  componentDidMount() {
    const { page, perPage } = this.state
    this.loadNews(page, perPage)
  }

  componentWillUpdate(nextProps, nextState) {
    const reset = nextState.page === 1
    if (reset) this.container.scrollTop = 0
    if (this.state.page !== nextState.page) {
      this.loadNews(nextState.page, nextState.perPage, reset)
    }
  }

  renderNews = (article) => {
    const { id } = article
    if (isEmpty(article.imageUrl) && article.itemType !== 'numbers') {
      return <Simple onClick={ this.newsDetail(id) } key={ id } article={ article } />
    } else {
      switch (article.itemType) {
        case 'featured':
          return <Featured onClick={ this.newsDetail(id) } key={ id } article={ article } />
        case 'numbers':
          return <Numbers key={ id } article={ article } />
        default:
          return <Article onClick={ this.newsDetail(id) } key={ id } article={ article } />
      }
    }
  }

  handleScroll = (e) => {
    const { page } = this.props
    if ((e.target.scrollTop + e.target.clientHeight + 100 > e.target.scrollHeight) &&
      page > this.state.page) {
      this.setState({ page })
    }
  }

  render() {
    const { currentUser, logout, loading, history: { location }, news, last, setVehicle } = this.props
    return (
      <FrontOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
        onScroll={ this.handleScroll }
        setVehicle={ setVehicle }
      >
        <Container innerRef={ (node) => this.container = node }>
          <PageHeader>
            <PageName>News and Information</PageName>
          </PageHeader>
          <ArticlesContainer>
            { isEmpty(news)
              ? <Empty loading={ loading }>No data</Empty>
              : news.map(this.renderNews)
            }
          </ArticlesContainer>
          { !isEmpty(news) && (loading ? <LoaderStyled color="#FDB924" /> : !last && <LoaderText>Scroll down to see more</LoaderText>) }
        </Container>
      </FrontOfficeLayout>
    )
  }

  loadNews = (page, perPage, reset) => {
    this.props.loadNews({
      page,
      perPage,
      reset
    })
  }

  newsDetail = (id) => (e) => {
    if (id) {
      this.props.history.push(`/news/detail/${id}`)
    }
  }
}

const Container = styled.div`
  position: relative;
  width: 100%;
  background: #f4f7fa;
  padding:0 30px;
`

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  margin: 20px 0 40px 0;
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  
  ${media.phoneLarge`
    font-size: 22px;
  `}
`

const LoaderStyled = styled(Loader)`
  margin-bottom: 15px;
`

const LoaderText = styled.div`
  font-size: 14px;
  text-align: center;
  color: #000000;
  margin: 15px 0 15px 0;
`

const ArticlesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default connect(mapStateToProps, mapDispatchToProps)(News)
