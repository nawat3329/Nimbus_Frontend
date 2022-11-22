import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { withRouter } from '../common/with-router';
import { toast } from 'react-toastify';
import { Navigate } from "react-router-dom";
import UserService from "../services/user.service";
import PostResponse from "../common/postresponse";
import AuthService from "../services/auth.service";
import { Image } from "react-bootstrap";


class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: "",
            found: true,
            comment: [],
            commentInput: "",
            userID: "",
            redirect: null
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            this.setState({ redirect: "/home" });
        }
        else {
            this.setState({ userID: currentUser.id })
            this.fetchContent();
            this.fetchComment();
        }
    }

    fetchContent = () => {
        
        UserService.getpostdetail(this.props.router.params?.postID).then(
            (response) => {
                
                this.insertResponse(response.data);
            },
            (error) => {
                
                toast.error("post not found")
                this.setState({ found: false })

            }
        );
    }

    fetchComment = () => {
        UserService.getPostComment(this.props.router.params?.postID).then(
            (response) => {
                
                this.setState({ comment: response.data });
            },
            (error) => {
                
            }
        )
    }


    insertResponse = (response) => {
        
        this.setState({ post: <PostResponse response={response} /> });
    }

    addComment = () => {
        
        UserService.addcomment(this.props.router.params?.postID, this.state.commentInput).then(
            (response) => {
                
                this.setState({ commentInput: "" });
                this.fetchComment();
            },
            (error) => {
                
            }
        )
    }

    insertComment = () => {
        const commentArray = this.state.comment;
        var rows = [];
        for (let i = commentArray.length - 1; i >= 0; i--) {
            rows.push(
                <div key={commentArray[i]._id} className="card">
                    <h5 className="card-header">
                        <Image src={commentArray[i].images || "https://ssl.gstatic.com/accounts/ui/avatar_2x.png"} className="profile-img-small" />
                        {commentArray[i].username}
                    </h5>
                    <div className="card-body">
                        <h5 className="card-text">{commentArray[i].usercomment}</h5>
                    </div>
                    <div className="p-2">
                        {commentArray[i].usercommentid === this.state.userID ?
                            <Button variant="outline-danger" size="sm" onClick={() => this.deleteComment(commentArray[i]._id)}>Delete</Button> : null}
                    </div>
                </div>
            );
        }
        return rows;
    }


    deleteComment = (commentID) => {
        UserService.deletecomment(this.props.router.params?.postID, commentID).then(
            (response) => {
                
                this.fetchComment();
            },
            (error) => {
                
            }
        )
    }




    render() {
        if (!this.state.found) {
            return <Navigate to="/home" />
        }
        if (this.state.redirect) {
            toast.error("You need to login to view that page")
            return <Navigate to={this.state.redirect} />
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
