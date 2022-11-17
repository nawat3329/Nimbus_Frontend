import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import {  Link,} from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostResponse from "./postresponse";
export default class Content extends Component {
	constructor(props) {
		super(props);

		this.state = {
			content: "",
			page: 1,
			totalPage: 1,
			userID: null
		};
	}

	componentDidMount() {
		const currentUser = AuthService.getCurrentUser();
		console.log(currentUser);
		currentUser ? this.setState({userID: currentUser.id}, () => {this.fetchContent()}) : this.fetchContent();
	}

	fetchContent = () => {
		console.log(this.props.pageType)
		console.log(this.state.totalPage);
		if (this.props.pageType === "home") {
			if (this.props.visibilityView === "Public") {
				UserService.getHomeContent(this.state.page, this.state.userID).then(
					(response) => {
						this.setState({
							totalPage: response.data.totalPage
						})
						this.insertResponse(response.data.postRes)
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
			else if (this.props.visibilityView === "Follow") {
				UserService.getHomeFollowContent(this.state.page).then(
					(response) => {
						this.setState({
							totalPage: response.data.totalPage
						})
						this.insertResponse(response.data.postRes)
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
		}
		else if (this.props.pageType === "profile") {
			if (this.props.profile_userID) {
				UserService.getProfileContent(this.state.page, this.props.profile_userID).then(
					(response) => {
						console.log(response);
						this.setState({
							totalPage: response.data.totalPage
						})
						this.insertResponse(response.data.postRes)
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
			else {
				UserService.getSelfProfileContent(this.state.page).then(
					(response) => {
						console.log(response);
						this.setState({
							totalPage: response.data.totalPage
						})
						this.insertResponse(response.data.postRes)
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
		}
	}

	insertResponse = (response) => {
		console.log(this.state.page);
		console.log(response);
		const rows = [];
		for (let i = 0; i < response.length; i++) {
			rows.push(
				<PostResponse key={response[i]._id} response={response[i]} fetchContent={this.fetchContent} />
			);
		}
		console.log(rows)
		this.setState({
			content: rows,
		});
	}

	changePage = (move) => {
		this.setState((prevState) => ({
			page: prevState.page + move
		}),
			() => this.fetchContent());
	}

	pageButton = () => {
		return (
			<div className="d-flex justify-content-around">
				<Button
					disabled={this.state.page <= 1}
					onClick={() => this.changePage(-1)}
				>
					Previous Page </Button>
				<Button
					disabled={this.state.page >= this.state.totalPage}
					onClick={() => this.changePage(1)}
				>Next Page</Button>
			</div>
		)
	}

	render() {
		return (
			<div className="container">
				{this.state.content}
				<this.pageButton />
			</div>
		);
	}
}
