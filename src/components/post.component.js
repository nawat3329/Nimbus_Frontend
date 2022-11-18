import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link, } from "react-router-dom";
import { withRouter } from '../common/with-router';
import { toast } from 'react-toastify';
import { Navigate } from "react-router-dom";
import UserService from "../services/user.service";
import PostResponse from "../common/postresponse";
import AuthService from "../services/auth.service";


class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: "",
            found: true,
            comment: [],
            commentInput: "",
            userID: "",
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        this.setState({userID: currentUser.id})
        this.fetchContent();
        this.fetchComment();
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
                this.setState({ found: false })

            }
        );
    }

    fetchComment = () => {
        UserService.getPostComment(this.props.router.params?.postID).then(
            (response) => {
                console.log(response.data);
                this.setState({ comment: response.data }, () => console.log(this.state.comment));
            },
            (error) => {
                console.log(error);
            }
        )
    }


    insertResponse = (response) => {
        console.log(response)
        this.setState({ post: <PostResponse response={response} /> });
    }

    addComment = () => {
        console.log(this.state.commentInput);
        UserService.addcomment(this.props.router.params?.postID, this.state.commentInput).then(
            (response) => {
                console.log(response.data);
                this.setState({ commentInput: "" });
                this.fetchComment();
            },
            (error) => {
                console.log(error);
            }
        )
    }

    insertComment = () => {
        const commentArray = this.state.comment;
        var rows = [];
        for (let i = commentArray.length-1; i>=0; i--) {
			rows.push(
				<div key={commentArray._id} className="card">
                    <h5 className="card-header">{commentArray[i].username}</h5>
                    <div className="card-body">
                        <h5 className="card-text">{commentArray[i].usercomment}</h5>
                    </div>
                    <div className="p-2" key={"delete"+commentArray._id}>
                            {commentArray[i].usercommentid === this.state.userID ?
                                <Button variant="outline-danger" size="sm" onClick={() => this.deleteComment(commentArray[i]._id)}>Delete</Button> : null}
                    </div>
                </div>
			);
		}
        return rows;
    }


    deleteComment = (commentID) => {
        UserService.deletecomment(this.props.router.params?.postID,commentID).then(
            (response) => {
                console.log(response.data);
                this.fetchComment();
            },
            (error) => {
                console.log(error);
            }
        )
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
                <h4>Comment</h4>
                <header className="jumbotron">
                    <InputGroup className="mb-3">
                        <Form.Control placeholder="Comment Something!" value={this.state.commentInput} onChange={(event) => this.setState({ commentInput: event.target.value })} />
                        <Button variant="outline-secondary" onClick={this.addComment} >Comment</Button>
                    </InputGroup>
                </header>
                <this.insertComment />
            </div>

        );
    }
}

export default withRouter(Post);
