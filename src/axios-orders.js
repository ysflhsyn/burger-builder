import axios from 'axios';

export default axios.create({
  baseURL: 'https://react-my-burger-1e265.firebaseio.com/'
});