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
			page: 1,
			totalPage: 1
		};
	}

	componentDidMount() {
		this.fetchHomeContent();
		UserService.getTotalPageHome().then(
			(response) => {
				this.setState({
					totalPage: response.data.totalPage
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
		)
	}

	fetchHomeContent = () => {
		console.log(this.state.totalPage);
		UserService.getHomeContent(this.state.page).then(
			(response) => {
				console.log(this.state.page);
				console.log(response);
				const rows = [];
				for (let i = 0; i < response.data.length; i++) {
					rows.push(
						<div key={response.data[i]?._id} className="card">
							<h5 className="card-header">{response.data[i]?.username}</h5>
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
	
	changePage = (move) => {
		this.setState((prevState) => ({ 
			page: prevState.page + move}),
			() => this.fetchHomeContent());
	}

	publishPostMenu = () => {
		return (
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
			<div class="d-flex justify-content-around">
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
				<header className="jumbotron">
					<this.publishPostMenu />
					<h3>{this.state.content}</h3>
					<this.pageButton /> 
				</header>
			</div>
		);
	}
}
