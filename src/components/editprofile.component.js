import React, { Component } from "react";
import AuthService from "../services/auth.service";
import { toast } from 'react-toastify';
import { withRouter } from '../common/with-router';
import UserService from "../services/user.service";
import Button from 'react-bootstrap/Button';
import { Image } from "react-bootstrap";
class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userReady: false,
            currentUser: { username: "" },
            userProfile: {},
            selectedImage: null,
            currentUserProfile: AuthService.getProfilePicture()
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        this.setState({ currentUser: currentUser, userReady: true }, () => { this.getUserDetail() });
    }

    getUserDetail = () => {
        UserService.getSelfProfileContent().then(
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

    changeProfilePicture = () => {
        if (!this.state.selectedImage) {
            toast.error("Please insert profile image");
            return;
        }
        UserService.changeProfilePicture(this.state.selectedImage).then(
            (response) => {
                console.log(response);
                AuthService.setProfilePicture(response.data.images);
                window.location.href = "/profile";
            },
            (error) => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString(),
                });
                console.log(error)
            }
        )
    }


    UploadAndDisplayImage = () => {
        return (
            <div>
                {this.state.selectedImage && (
                    <div>
                        <img alt="not found" width={"100px"} src={URL.createObjectURL(this.state.selectedImage)} className="profile-img" />
                        <br />
                        <button onClick={() => this.setState({ selectedImage: null })}>Remove</button>
                    </div>
                )}
                <br />

                <br />
                <input
                    type="file"
                    name="myImage"
                    onChange={(event) => {
                        console.log(event.target.files[0]);
                        this.setState({ selectedImage: event.target.files[0] });
                    }}
                />
            </div>
        );
    };

    render() {



        return (
            <div className="container">
                {(this.state.userReady) ?
                    <div>
                        <div>
                            <header className="jumbotron">
                                <h3>
                                    <strong>{this.state.currentUser.username}</strong> Profile
                                </h3>
                                <h6> Current Profile Image</h6>
                                <Image src={this.state.currentUserProfile || "https://ssl.gstatic.com/accounts/ui/avatar_2x.png"} className="profile-img" />
                                <h6> Change Profile Image</h6>
                                <this.UploadAndDisplayImage />
                                <br />
                                <Button variant="outline-primary" onClick={this.changeProfilePicture} >Change Profile Picture</Button>
                            </header>

                        </div>

                    </div>
                    : null}
            </div>
        );
    }
}
export default withRouter(Profile);
