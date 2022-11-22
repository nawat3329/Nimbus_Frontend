import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from 'react-toastify';
import { withRouter } from '../common/with-router';
import Content from "../common/content";
import UserService from "../services/user.service";
import Button from 'react-bootstrap/Button';
import { Image } from "react-bootstrap";
class OthersProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "" },
            userProfile: {},
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) this.setState({ redirect: "/home" });
        this.setState({ currentUser: currentUser, userReady: true }, () => {this.getUserDetail()});
    }

    getUserDetail = () => {
        UserService.getProfileDetail(this.props.router.params.userID).then(
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

    othersProfile = () => {

        return (<header className="jumbotron" style={{display:"flex", flexDirection:"column"}}>
            
                <Image src={this.state.userProfile.images || "https://ssl.gstatic.com/accounts/ui/avatar_2x.png"} className="profile-img"/>
            <h3 style={{textAlign:"center"}}> 
                <strong >{this.state.userProfile.username}</strong> Profile
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
        
        
        if (this.props.router.params?.userID === this.state.currentUser.id) {
            
            return <Navigate to="/profile" />
        }



        return (
            <div className="container">
                {(this.state.userReady) ?
                    <div>
                        {this.othersProfile()}
                        <Content pageType="profile" profile_userID={this.props.router.params?.userID} />
                    </div>
                    : null}
            </div>
        );
    }
}
export default withRouter(OthersProfile);
