import React, { Component } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';



import UserService from "../services/user.service";

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			content: "",
			textInput: "",
			visibilityInput: "Public",
			visibilityView: "Public",
			page: 1
		};
	}

	componentDidMount() {
		this.fetchHomeContent();
	}

	fetchHomeContent = () => {
		UserService.getHomeContent().then(
			(response) => {
				console.log(response);
				const rows = [];
				for (let i = 0; i < response.data.length; i++) {
					rows.push(
						<div key={response.data[i]?._id} className="card">
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

	publishPost = () => {
		UserService.publishPost(this.state.textInput, this.state.visibilityInput).then(
			(response) => {
				console.log(response);
				this.setState({ textInput: ""});
				this.fetchHomeContent();
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

	publishPostMenu = () => {
		return (
			// < div class="input-group mb-3" >
			// 	<input type="text" class="form-control" placeholder="Write something!" aria-describedby="basic-addon2"
			// 		onChangeText={(text) => this.setState({ textInput: text })}>
			// 	</input>
			// 	<div class="input-group-append">
			// 		<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Visibility</button>
			// 		<div class="dropdown-menu" onChange={(e) => this.setState({ visibilityInput: e.target.value })}>
			// 			<a class="dropdown-item" href="/#" >Public</a>
			// 			<a class="dropdown-item" href="/#" >Follow</a>
			// 			<a class="dropdown-item" href="/#" >Private</a>
			// 		</div>
			// 		<button class="btn btn-outline-secondary" type="button"
			// 			onClick={this.publishPost}
			// 		>Publish</button>
			// 	</div>
			// </div>
			<InputGroup className="mb-3">
				<Form.Control placeholder="Write Something!" value={this.state.textInput} onChange={(event) => this.setState({ textInput: event.target.value })}/>

				<DropdownButton
					onSelect={(e) => 
						this.setState({ visibilityInput: e })}
					variant="outline-secondary"
					title={this.state.visibilityInput}
					align="end"
					>
					<Dropdown.Item eventKey="Public" href="#">Public</Dropdown.Item>
					<Dropdown.Item eventKey="Follow" href="#">Follower</Dropdown.Item>
					<Dropdown.Item eventKey="Private" href="#">Private</Dropdown.Item>
				</DropdownButton>
				<Button variant="outline-secondary" onClick={this.publishPost} >Publish</Button>
			</InputGroup>
		)
	}

	pageButton = () => {
		return (
			<div class="d-flex justify-content-between">
				<Button />
				<Button />
			</div>
		)
	}

	render() {
		return (
			<div className="container">
				<header className="jumbotron">
					<this.publishPostMenu />
					<h3>{this.state.content}</h3>
					{/* <this.pageButton /> */}
				</header>
			</div>
		);
	}
}
