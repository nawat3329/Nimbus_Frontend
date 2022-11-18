import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import UserService from "../services/user.service";


export default class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
        };
    }
    searchusername = () => {
        UserService.searchUser(this.state.username).then(
            (response) => {
                console.log(response.data)
                window.location.href = "/profile/" + response.data._id;
            },
            (error) => {
                console.log(error);
            }
        );
    }


    render() {
        
        return (
            <div className="container">
                <Form className="d-flex">
                <Form.Control 
                    type="search"
                    placeholder="Username"
                    className="me-2"
                    aria-label="Search"
                    value={this.state.username} 
                    onChange={(event) => this.setState({ username: event.target.value })}
                />
                <Button variant="outline-success" onClick={this.searchusername}>Search</Button>
                </Form>
            </div>

        );
    }
}

