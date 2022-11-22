import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from 'react-toastify';
import { withRouter } from '../common/with-router';
import Content from "../common/content";
import UserService from "../services/user.service";
import Button from 'react-bootstrap/Button';
import { Image } from "react-bootstrap";
class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "" },
            userProfile: {},
            userProfilePicture: AuthService.getProfilePicture(),
            redirectProfile: false
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) this.setState({ redirect: "/home" });
        this.setState({ currentUser: currentUser, userReady: true }, () => {this.getUserDetail()});
    }

    getUserDetail = () => {
        UserService.getSelfProfileContent().then(
            (response) => {
                
                this.setState({
                    userProfile: response.data
                })
                
            },
            (error) => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString(),
                });
            }
        );
    }
    selfProfile = () => {
        const { currentUser } = this.state;
        return (
            <div>
                <header className="jumbotron" style={{display:"flex", flexDirection:"column"}}>
                    <Image src={this.state.userProfilePicture || "https://ssl.gstatic.com/accounts/ui/avatar_2x.png"} className="profile-img"/>
                    <h1 style={{textAlign:"center"}}>
                        <strong>{currentUser.username}</strong> Profile
                    </h1>
                    <Button onClick={() => this.setState({redirectProfile: true})}> Setting </Button>
                </header>
                


            </div>)
    }

    render() {
        if (this.state.redirect) {
            toast.error("You need to login to view that page")
            return <Navigate to={this.state.redirect} />
        }
        if (this.state.redirectProfile) {
            this.setState({redirectProfile: false})
            return <Navigate to="/settings" />
        }

        return (
            <div className="container">
                {(this.state.userReady) ?
                    <div>
                        {this.selfProfile()}
                        <Content pageType="profile" />
                    </div>
                    : null}
            </div>
        );
    }
}
export default withRouter(Profile);
