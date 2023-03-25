import axios from 'axios';
import route from 'config/route';
import { httpOptions } from 'helper/http';

const sendMessage = (roomId, text) => axios.post(`${route.API_MESSAGE_SEND}/${roomId}`, { text }, httpOptions);

const readMessage = messageId => axios.post(`${route.API_MESSAGE_READ}/${messageId}/read`, {}, httpOptions);

const joinUserRoom = userId => axios.post(`${route.API_ROOM_USER_JOIN}/${userId}`, {}, httpOptions);

const loadRooms = () => axios.get(route.API_ROOM, httpOptions);

const loadRoomDetails = roomId => axios.get(`${route.API_ROOM}/${roomId}`, httpOptions);

const loadMessages = roomId => axios.get(`${route.API_ROOM}/${roomId}/messages`, httpOptions);

const searchUser = query => axios.get(`${route.API_SEARCH_USER}?term=${query}`, httpOptions);

const getCurrentUser = () => axios.get(route.API_USER_AUTHORIZE_SUCCESS, httpOptions);

const followUser = (url, isFollowing) => {
  httpOptions.url = url;
  httpOptions.method = isFollowing ? 'DELETE' : 'POST';
  return axios.request(httpOptions);
};

const likeStory = (url, isLiked) => {
  httpOptions.url = url;
  httpOptions.method = isLiked ? 'DELETE' : 'POST';
  return axios.request(httpOptions);
};

export default {
  sendMessage,
  readMessage,
  joinUserRoom,
  loadRooms,
  loadRoomDetails,
  loadMessages,
  searchUser,
  getCurrentUser,
  followUser,
  likeStory,
};
