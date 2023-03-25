import storyCollectionLoad from 'action/story';

export const buildStories = (rooms) => {
  const items = [];

  rooms.forEach((room) => {
    let story = {};
    if (room.property) {
      story = room.property;
      story.type = 'property';
    }
    if (room.article) {
      story = room.article;
      story.article = 'article';
    }

    items.push(story);
  });

  return items;
};

export const loadStories = rooms => (dispatch) => {
  const items = buildStories(rooms);
  dispatch(storyCollectionLoad(items));
};
