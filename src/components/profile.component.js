import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from 'react-toastify';
import { withRouter } from '../common/with-router';
import Content from "../common/content";
import UserService from "../services/user.service";
import Button from 'react-bootstrap/Button';
class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "" },
            userProfile: {}
        };
    }

    componentDidMount() {

        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({ redirect: "/home" });
        this.setState({ currentUser: currentUser, userReady: true })

        if (this.props.router.params) {

        }
        console.log(this.props.router.params)
        this.getUserDetail();
    }

    getUserDetail = () => {
        UserService.getProfileDetail(this.props.router.params.userID).then(
            (response) => {
                console.log(response.data)
                this.setState({
                    userProfile: response.data
                })
                console.log(this.state.userProfile)
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
                <header className="jumbotron">
                    <h3>
                        <strong>{currentUser.username}</strong> Profile
                    </h3>
                </header>
                <p>
                    <strong>Token:</strong>{" "}
                    {currentUser.accessToken.substring(0, 20)} ...{" "}
                    {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                </p>
                <p>
                    <strong>Id:</strong>{" "}
                    {currentUser.id}
                </p>
                <p>
                    <strong>Email:</strong>{" "}
                    {currentUser.email}
                </p>
            </div>)
    }

    othersProfile = () => {

        return (<header className="jumbotron">
            <h3>
                <strong>{this.state.userProfile.username}</strong> Profile
            </h3>{(!this.state.userProfile.follow) ?
                <Button
                onClick={() => this.pressFollow()}
                >
                    Follow
                </Button>
                :
                <Button
                onClick={() => this.pressUnfollow()}
                >
                    Unfollow
                </Button>
            }

        </header>)
    }

    pressFollow = () => {
        UserService.follow(this.state.userProfile._id).then(
            (response) => {
                console.log(response.data)
                this.getUserDetail();
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

    pressUnfollow = () => {
        UserService.unfollow(this.state.userProfile._id).then(
            (response) => {
                console.log(response.data)
                this.getUserDetail();
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

    render() {
        if (this.state.redirect) {
            toast.error("You need to login to view that page")
            return <Navigate to={this.state.redirect} />
        }



        return (
            <div className="container">
                {(this.state.userReady) ?
                    <div>
                        {/* <this.selfProfile /> */}
                        <this.othersProfile />
                        <Content pageType="profile" profile_userID={this.props.router.params} />
                    </div>
                    : null}
            </div>
        );
    }
}
export default withRouter(Profile);
