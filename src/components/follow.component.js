import React, { Component } from "react";

import Content from "../common/content";
import PostMenu from "../common/postmenu";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from 'react-toastify';

export default class Follow extends Component {
	constructor(props) {
		super(props);
		this.child = React.createRef();
	}

	render() {
        if (!AuthService.getCurrentUser()) {
            toast.error("You need to login to view that page")
            return <Navigate to={"/home"} />
        }
		return (
			<div className="container">
				<header className="jumbotron">
					<PostMenu pass={this.child} />
					<Content ref={this.child} visibilityView="Follow" pageType="home" />
				</header>
			</div>
		);
	}
}
