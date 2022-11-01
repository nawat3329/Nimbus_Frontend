import axios from 'axios';
import authHeader from './auth-header';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_ROOT_URL + process.env.REACT_APP_CONTENT_API_URL;

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }

    async getHomeContent() {
        return axios.get(API_URL + "home");
    }

    async publishPost(text,visibility) {
        console.log(text)
        console.log(visibility)
        const response =  (axios.post(API_URL + "post", { text, visibility, }, {headers: authHeader()}));
        toast.promise(
            response,
            {
              pending: 'Publishing your post',
              success: 'Your post successfully publish 👌',
              error: 'Something went wrong 🤯'
            }
        )
        return response
    }
}

export default new UserService();