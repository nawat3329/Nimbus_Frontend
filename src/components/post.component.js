import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { Link, } from "react-router-dom";
import { withRouter } from '../common/with-router';
import { toast } from 'react-toastify';
import { Navigate } from "react-router-dom";
import UserService from "../services/user.service";
import PostResponse from "../common/postresponse";


class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: "",
            found: true,
            
        };
    }

    componentDidMount() {

        this.fetchContent();
    }

    fetchContent = () => {
        console.log(this.props.router.params?.postID);
        UserService.getpostdetail(this.props.router.params?.postID).then(
            (response) => {
                console.log(response.data);
                this.insertResponse(response.data);
                
            },
            (error) => {
                console.log(error);
                toast.error("post not found")
                this.setState({found: false})

            }
        );
    }



    insertResponse = (response) => {
        console.log(response)
        this.setState({post: <PostResponse response={response} />});

    }




    render() {
        if (!this.state.found) {
            return <Navigate to="/home" />
        }
        return (
            <div className="container">
				<header className="jumbotron">
                {this.state.post}
				</header>
			</div>
        );
    }
}

export default withRouter(Post);
