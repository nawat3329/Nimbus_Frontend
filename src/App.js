import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import Follow from "./components/follow.component";
import OthersProfile from "./components/others-profile.component";
import Post from "./components/post.component";
import Search from "./components/search.component";
import EditProfile from "./components/editprofile.component";
import { Image } from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      profilepicture: null
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    const profilepicture = AuthService.getProfilePicture();

    if (user) {
      this.setState({
        currentUser: user,
        profilepicture: profilepicture
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="view">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Nimbus
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {currentUser && (
              <li className="nav-item">
                <Link to={"/following"} className="nav-link">
                  Following
                </Link>
              </li>
            )}
            <li>
              <Search />
            </li>
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item navbar">
                <Link to={"/profile"} className="nav-link navbar" style={{padding:0}}>
                  <Image src={this.state.profilepicture || "https://ssl.gstatic.com/accounts/ui/avatar_2x.png"}  className="profile-img-small"/>
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item navbar" >
                <a href="/login" className="nav-link navbar" onClick={this.logOut}  >
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3" >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userID" element={<OthersProfile />} />
            <Route path="/following" element={<Follow />} />
            <Route path="/post/:postID" element={<Post />} />
            <Route path="/settings" element={<EditProfile />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
