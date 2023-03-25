import { userCollectionLoad } from 'action/user';

const buildUsers = (rooms) => {
  const items = [];

  rooms.forEach((room) => {
    room.users.forEach((user) => {
      if (!items.find(item => Number(item.id) === Number(user.id))) {
        items.push(user);
      }
    });
  });

  return items;
};

const loadUsers = rooms => (dispatch) => {
  const items = buildUsers(rooms);
  dispatch(userCollectionLoad(items));
};

export default loadUsers;
