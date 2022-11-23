import axios from "axios";

const API_URL = process.env.REACT_APP_ROOT_URL + process.env.REACT_APP_AUTH_API_URL;

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                const {images, ...user} = response.data;
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("profilepicture", images || "https://ssl.gstatic.com/accounts/ui/avatar_2x.png");
                }
                
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("profilepicture");
    }

    register(username, email, password) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    setProfilePicture(image) {
        localStorage.setItem("profilepicture", image)
    }
    getProfilePicture() {
        return localStorage.getItem("profilepicture")
    }
}

export default new AuthService();