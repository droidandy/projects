import axios from 'utils/axios';

const postEvent = (name = '', properties = {}) => {
  axios.post('/analytics/event', { event: { name, properties } })
    .catch((error) => {
      console.error(error);
    });
};

export default postEvent;
