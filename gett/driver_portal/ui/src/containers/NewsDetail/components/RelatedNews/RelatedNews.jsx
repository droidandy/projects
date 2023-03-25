import React, { Component } from 'react'
import styled from 'styled-components'
import { DesktopSmall, PhoneLarge, MediaQuery, PhoneSmall, DesktopMediumLarge } from 'components/MediaQuery'
import { sizes } from 'components/Media'
import { isEmpty, dropRight } from 'lodash'
import { Article } from 'components/Articles/Article'
import { Featured } from 'components/Articles/Featured'
import { Numbers } from 'components/Articles/Numbers'
import { Simple } from 'components/Articles/Simple'

const maxItemsDesktopMedium = 4
const maxItemsDesktopSmall = 3
const maxItemsPhone = 2

class RelatedNews extends Component {
  newsDetail = (id) => (e) => {
    if (id) {
      this.props.history.push(`/news/detail/${id}`)
    }
  }

  renderArticle = (article) => {
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

  filterData(media) {
    const { news } = this.props.relatedNews
    switch (media) {
      case 'desktopMedium':
        return news.length > maxItemsDesktopMedium ? news.length - maxItemsDesktopMedium : 0
      case 'desktopSmall':
        return news.length > maxItemsDesktopSmall ? news.length - maxItemsDesktopSmall : 0
      case 'phone':
        return news.length > maxItemsPhone ? news.length - maxItemsPhone : 0
      default:
        return 0
    }
  }

  renderNews = (media) => {
    const { news } = this.props.relatedNews
    let cutNews = dropRight(news, this.filterData(media))
    return (
      <ArticlesContainer>
        { cutNews.map(this.renderArticle) }
      </ArticlesContainer>
    )
  }

  render() {
    return (
      <Wrapper>
        <Title>
          Most read news
        </Title>
        <DesktopMediumLarge>{ this.renderNews() }</DesktopMediumLarge>
        <MediaQuery minWidth={ sizes.desktopSmall } maxWidth={ sizes.desktopMediumLarge }>{ this.renderNews('desktopMedium') }</MediaQuery>
        <DesktopSmall>{ this.renderNews('desktopSmall') } </DesktopSmall>
        <PhoneLarge>{ this.renderNews('phone') } </PhoneLarge>
        <PhoneSmall>{ this.renderNews('phone') } </PhoneSmall>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
`

const Title = styled.div`
  text-align: center;
  font-size: 24px;
  color: #303030;
  margin: 40px 0;
`

const ArticlesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default RelatedNews
