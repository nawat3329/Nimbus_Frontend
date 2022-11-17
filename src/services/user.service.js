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

    async getHomeContent(page, userId) {
        return await axios.get(API_URL + "home", { params: { page, userId } });
    }

    async getHomeFollowContent(page) {
        return await axios.get(API_URL + "homefollow", { params: { page }, headers: authHeader() });
    }

    async publishPost(text, visibility, image) {
        var response;
        console.log(text);
        console.log(visibility);
        console.log(image);
        if(image){
            const formData = new FormData();
            formData.append('image', image);
            formData.append('text', text);
            formData.append('visibility', visibility);
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ': ' + pair[1]); 
            }
            response =  axios.post(API_URL + "insertpostimage", formData, { headers: {...authHeader(), 'Content-Type': 'multipart/form-data'} });
        }
        else{
            response = (axios.post(API_URL + "insertpost", { text, visibility}, { headers: authHeader() }));
        }
        toast.promise(
            response,
            {
                pending: 'Publishing your post',
                success: 'Your post successfully publish 👌',
                error: "Something went wrong (Not image or too large)"
            }
        )
        return response
    }

    async getProfileContent(page, profile_userID){
        return await axios.get(API_URL + "getProfileContent", { params: { page, profile_userID } , headers: authHeader() });
    }

    async getProfileDetail(profile_userID){
        return await axios.get(API_URL + "getProfileDetail", { params: { profile_userID } , headers: authHeader() });
    }

    async getpostdetail(postId){
        return await axios.get(API_URL + "getpostdetail", { params: { postId } , headers: authHeader() });
    }

    async follow(profile_userID) {
        const response = (axios.post(API_URL + "follow", { profile_userID }, { headers: authHeader() }));
        toast.promise(
            response,
            {
                pending: 'Following',
                success: 'Follow successfully! 👌',
                error: 'Something went wrong 🤯'
            }
        )
        return response
    }

    async unfollow(profile_userID) {
        console.log(profile_userID)
        const response = (axios.post(API_URL + "unfollow", { profile_userID }, { headers: authHeader() }));
        toast.promise(
            response,
            {
                pending: 'Unfollowing',
                success: 'Unfollow successfully! 👌',
                error: 'Something went wrong 🤯'
            }
        )
        return response
    }

    async getSelfProfileContent(page){
        return await axios.get(API_URL + "getSelfProfileContent", { params: {page} , headers: authHeader() });
    }

    async like(postId){
        console.log(postId)
        const response = (axios.post(API_URL + "like", { postId }, { headers: authHeader() }));
        toast.promise(
            response,
            {
                pending: 'Liking',
                success: 'Liked Succesfully! 👌',
                error: 'Something went wrong 🤯'
            }
        )
        return response
    }

    async unlike(postId){
        console.log(postId)
        const response = (axios.post(API_URL + "unlike", { postId }, { headers: authHeader() }));
        toast.promise(
            response,
            {
                pending: 'Unliking',
                success: 'Unliked Succesfully! 👌',
                error: 'Something went wrong 🤯'
            }
        )
        return response
    }
}

export default new UserService();