import React, { Component } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';


import UserService from "../services/user.service";
import Content from "../common/content";

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.child = React.createRef();
		this.state = {
			textInput: "",
			visibilityInput: "Public",
			visibilityView: "Public",
		};
	}

	publishPost = () => {
		UserService.publishPost(this.state.textInput, this.state.visibilityInput).then(
			(response) => {
				console.log(response);
				this.setState({ textInput: ""});
				this.child.current.fetchContent();
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


	render() {
		return (
			<div className="container">
				<header className="jumbotron">
					<this.publishPostMenu />
					<Content ref={this.child} visibilityView={this.state.visibilityView} pageType="home"/>
				</header>
			</div>
		);
	}
}
