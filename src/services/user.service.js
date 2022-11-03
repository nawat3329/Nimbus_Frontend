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

    async getHomeContent(page) {
        return await axios.get(API_URL + "home", { params: { page } });
    }

    async publishPost(text, visibility) {
        console.log(text)
        console.log(visibility)
        const response = (axios.post(API_URL + "insertpost", { text, visibility, }, { headers: authHeader() }));
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



    async getProfileContent(page, profile_userID){
        return await axios.get(API_URL + "getProfileContent", { params: { page, profile_userID } , headers: authHeader() });
    }
}

export default new UserService();