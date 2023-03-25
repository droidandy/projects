import React, { Component } from 'react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'

import { media } from 'components/Media'
import { NewsPreview } from 'components/NewsPreview'
import { Loader } from 'components/Loader'
import { FrontOfficeLayout } from 'containers/Layouts/FrontOfficeLayout'

// import { Comments } from './components/Comments'
import { RelatedNews } from './components/RelatedNews'
import { mapStateToProps } from './reducers'
import * as mapDispatchToProps from './actions'

const PAGE = 1
const PER_PAGE = 5
const SORT_DIRECTION = 'desc'
const SORT_COLUMN = 'trending_index'

class NewsDetail extends Component {
  componentDidMount() {
    const { match } = this.props
    if (match && match.params && match.params.id) {
      this.load(match.params.id)
    }
  }

  componentWillUpdate(nextProps) {
    const { match: { params: { id } } } = nextProps

    if (id !== this.props.match.params.id) {
      this.load(id)
    }
  }

  render() {
    // const { currentUser, logout, history, news, comments, addcomment, resetComment, relatedNews } = this.props
    const { currentUser, logout, history, news, relatedNews } = this.props
    return (
      <FrontOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ history.location }
      >
        <PageHeader>
          <PageName>
            News
          </PageName>
        </PageHeader>
        <Container>
          { news.loading ? <Loader color="#FDB924" />
            : !isEmpty(news) && <NewsPreview news={ news } />
          }
          {/* { comments.loading ? <Loader color="#FDB924" /> */}
          {/*: !isEmpty(comments) && <Comments */}
          {/* comments={ comments } */}
          {/* addcomment={ addcomment } */}
          {/* user={ currentUser } */}
          {/* news={ news } */}
          {/* onAdd={ this.onAdd } */}
          {/* onLike={ this.onLike } */}
          {/* onDislike={ this.onDislike } */}
          {/* resetComment={ resetComment } */}
          {/* /> */}
          {/* } */}
          { relatedNews.loading ? <Loader color="#FDB924" /> : <RelatedNews history={ history } relatedNews={ relatedNews } /> }
        </Container>
      </FrontOfficeLayout>
    )
  }

  load = (id) => {
    const { loadNews, loadComments, loadRelatedNews } = this.props
    loadNews({ id })
    loadComments({ id })
    loadRelatedNews({ page: PAGE, perPage: PER_PAGE, sortDirection: SORT_DIRECTION, sortColumn: SORT_COLUMN })
  }

  onAdd = (content, nestedId) => {
    const { news, addComment } = this.props
    addComment({ id: news.id, content, nestedId })
  }

  onLike = (commentId, currentUserValue) => {
    const { news } = this.props
    if (currentUserValue === 1) this.props.deleteComment({ id: news.id, commentId })
    else this.props.likeComment({ id: news.id, commentId })
  }

  onDislike = (commentId, currentUserValue) => {
    const { news } = this.props
    if (currentUserValue === -1) this.props.deleteComment({ id: news.id, commentId })
    else this.props.dislikeComment({ id: news.id, commentId })
  }
}

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  margin: 20px 30px 0 0;
  
  ${media.phoneLarge`
    margin-right: 15px;
  `}
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin-left: 30px;
  
  ${media.phoneLarge`
    font-size: 22px;
    margin-left: 15px;
  `}
`

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background: #f4f7fa;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  
  ${media.phoneLarge`
    padding: 0px;
  `}
`

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetail)
