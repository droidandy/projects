import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import PostComment from './PostComment';

import NotLiked from '../../../../svg/not-liked.svg';
import Liked from '../../../../svg/liked.svg';
import Comments from '../../../../svg/comments.svg';

const Post = styled(Box)`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
`;

// header

const Header = styled(Flex)``;

const Posted = styled.div`
  color: grey;
  font-size: 12px;
  line-height: 99%;
`;

const AboutUser = styled(Box)`
  line-height: 99%;
`;

const Username = styled.span`font-size: 14px;`;

const CompanyName = styled.span`
  font-size: 12px;
  margin-left: 5px;
`;

const Country = styled.span`
  font-size: 12px;
  margin-left: 5px;
`;

// description

const Description = styled(Box)`
`;

const About = styled(Box)`
  font-size: 14px;
`;

// likes and comments

const LikesAndComments = styled(Box)``;

const CommentsWrapper = styled.div`
  margin-bottom: -5px;
  margin-left: 5px;
  cursor: pointer;
`;

const LikeWrapper = styled.div`cursor: pointer;`;

const Stats = styled(Flex)`
  font-size: 12px;
  color: #AEB0B3;
`;

const Comment = styled(Box)`
  font-size: 14px;
`;

const Message = styled.span`margin-left: 5px;`;

const Img = styled.img`max-width: 100%;`;

const SeeMore = styled.button`
  border: none;
  color: #74bbe7;
  background-color: white;
  padding: 0px;
  margin: 0px;
  font-size: 14px;

  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const Hr = styled.div`border-bottom: 1px solid #e1e1e1;`;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentsSectionOpen: false,
    };
  }

  onClickComments = () => {
    this.setState(state => ({
      commentsSectionOpen: !state.commentsSectionOpen,
    }));
  };

  render() {
    const {
      firstName,
      lastName,
      posted,
      companyName,
      country,
      imgSrc,
      avatarSrc,
      descriptionText,
      likeCount,
      commentCount,
      comments,
      liked,
    } = this.props;

    return (
      <Post w={[1, 1, 520]} pt={2} mt={2} pb={1}>
        <Header mx={2}>
          <img src={avatarSrc} alt={`rfq by ${firstName} ${lastName}`} />
          <Box ml={1} h={26}>
            <AboutUser>
              <Username>
                {firstName} {lastName},
              </Username>
              <CompanyName>
                @{companyName},
              </CompanyName>
              <Country>
                {country}
              </Country>
            </AboutUser>
            <Posted>
              Posted {distanceInWordsToNow(posted)} Ago
            </Posted>
          </Box>
        </Header>
        <Description mt={1} mx={2}>
          <About mt={1}>
            {descriptionText}
          </About>
        </Description>
        <Flex mt={1} justify="center">
          <Img src={imgSrc} alt="post" />
        </Flex>
        <LikesAndComments mx={2} mt={1}>
          <Stats align="center" justify="space-between">
            <Flex>
              <Box>
                {likeCount} {likeCount === 1 ? 'like' : 'likes'},
              </Box>
              <Box ml={5}>
                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
              </Box>
            </Flex>
            <Flex align="center">
              <LikeWrapper>
                {liked ? <Liked /> : <NotLiked />}
              </LikeWrapper>
              <CommentsWrapper onClick={this.onClickComments}>
                <Comments />
              </CommentsWrapper>
            </Flex>
          </Stats>
        </LikesAndComments>
        {this.state.commentsSectionOpen &&
          <Box mx={2} mt={1}>
            <Hr />
            {comments.map(comment =>
              <Comment mt={1}>
                <b>{comment.author}</b>:<Message>{comment.message}</Message>
              </Comment>
            )}
            <SeeMore>see more...</SeeMore>
            <PostComment avatarSrc={avatarSrc} />
          </Box>}
      </Post>
    );
  }
}
