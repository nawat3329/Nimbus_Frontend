import React, { Component } from "react";

import UserService from "../services/user.service";

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			content: "",
		};
	}

	componentDidMount() {
		UserService.getHomeContent().then(
			(response) => {
				console.log(response);
				const rows = [];
				for (let i = 0; i < response.data.length; i++) {
					rows.push(
							<div key = {response.data[i]?._id} className="card">
								<h5 className="card-header">{response.data[i]?.author}</h5>
								<div className="card-body">
									<h5 className="card-title">{response.data[i]?.text}</h5>
									<p className="card-text">
										picture here
									</p>
								</div>
							</div>
					);
				}
				this.setState({
					content: rows,
				});
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
		return (
			<div className="container">
				<header className="jumbotron">
					<h3>{this.state.content}</h3>
				</header>
			</div>
		);
	}
}
