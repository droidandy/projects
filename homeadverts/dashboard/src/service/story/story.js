import storyCollectionLoad from 'action/story';
import { updateRoomDetails } from 'action/room';
import { messenger } from 'api';
import { showNotificationLikeAdded, showNotificationLikeRemoved } from '../notification';

export const readStoryFromStorage = room => (dispatch, getState) => {
  const stories = getState().story.collection;
  let story = room.article;

  if (room.property) {
    story = room.property;
  }

  if (stories.length) {
    return stories.find(item => Number(item.id) === Number(story.id));
  }

  return story;
};

const updateStoryInStorage = () => (dispatch, getState) => {
  const details = getState().room.details;
  const stories = getState().story.collection;
  const isLiked = details?.article?.isLiked || false;
  const updated = [];

  if (isLiked) {
    dispatch(showNotificationLikeRemoved(details?.article));
  } else {
    dispatch(showNotificationLikeAdded(details?.article));
  }

  stories.forEach((s) => {
    if (s?.id === details?.article?.id) {
      s.isLiked = !s.isLiked;

      if (isLiked) {
        s.likesCount++;
      } else {
        s.likesCount--;
      }
    }

    updated.push(s);
  });
  const likesCount = (details?.article?.likesCount || 0) + (isLiked ? -1 : 1);
  const updatedDetails = {
    article: {
      ...(details?.article || {}),
      isLiked: !isLiked,
      likesCount,
    },
  };
  dispatch(updateRoomDetails(updatedDetails));
  dispatch(storyCollectionLoad(updated));
};

export const likeStory = story => (dispatch) => {
  messenger.likeStory(story?.url?.like, story.isLiked)
    .then(() => dispatch(updateStoryInStorage()));
};
