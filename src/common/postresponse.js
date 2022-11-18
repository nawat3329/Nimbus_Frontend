import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { Link, } from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export default function PostResponse(props) {
    const response = props.response;
    const [isLike, setIsLike] = useState(response.islike);
    const [isLogin, setIsLogin] = useState(false);
    const [count, setCount] = useState(response.like?.length);
    const [userID, setUserID] = useState("");
    const [text, setText] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [visibility, setVisibility] = useState("");

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setIsLogin(true);
            setUserID(currentUser.id);
            setText(response.text);
            setVisibility(response.visibility);
        }
    }, []);

    function like() {
        UserService.like(response._id).then(
            (response) => {
                console.log(response);
                setIsLike(true);
                setCount(count + 1);
            },
            (error) => {
                console.log(error);

            }
        );
    }

    function unlike() {
        UserService.unlike(response._id).then(
            (response) => {
                console.log(response)
                setIsLike(false);
                setCount(count - 1);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    function deletePost() {
        UserService.deletepost(response._id).then(
            (response) => {
                console.log(response);
                window.location.reload();
                toast.success("post deleted");
            },
            (error) => {
                console.log(error);
            }
        );
    }

    function editPost() {
        UserService.editpost(response._id, text, visibility).then(
            (response) => {
                console.log(response);
                window.location.reload();
                toast.success("post deleted");
            },
            (error) => {
                console.log(error);
            }
        );
    }

    return (
        <div key={response._id} className="card">
            <Link to={"/profile/" + response?.author} style={{ fontSize: 20, color: "black", textDecoration: 'none' }} className="card-header" >
                {response?.username}
            </Link>

            {editMode ?
                <InputGroup className="mb-3">
                    <Form.Control value={text} onChange={(event) => setText(event.target.value)} />
                    <DropdownButton
                        onSelect={(e) =>
                            setVisibility(e)}
                        variant="outline-secondary"
                        title={visibility}
                        align="end"
                    >
                        <Dropdown.Item eventKey="Public" href="#">Public</Dropdown.Item>
                        <Dropdown.Item eventKey="Follow" href="#">Follower</Dropdown.Item>
                        <Dropdown.Item eventKey="Private" href="#">Private</Dropdown.Item>
                    </DropdownButton>
                    <Button variant="outline-secondary" onClick={() => editPost()} >Edit</Button>
                </InputGroup>
                :
                <Link to={"/post/" + response._id} style={{ color: "black", textDecoration: 'none' }} className="card-body">
                    <h6 className="card-title">{response?.text}</h6>
                    <p className="card-text">
                        <Image src={response.post_images} fluid />
                    </p>
                </Link>
            }
            {isLogin ?
                <div className="card-footer">
                    <div className="d-flex flex-row">
                        <div className="p-2">
                            {!isLike ? <Button variant="outline-primary" size="sm" onClick={() => like()} > {"Like (" + count + ")"}  </Button>
                                : <Button variant="outline-primary" size="sm" onClick={() => unlike()}> {"Unlike (" + count + ")"} </Button>}
                        </div>
                        <div className="p-2">
                            <Button href={"post/"+ response._id} variant="secondary" size="sm">
                                Comment ({response.comment?.length})
                            </Button>
                        </div>
                        <div className="p-2">
                            {response.author === userID ?
                                <Button variant="outline-info" size="sm" onClick={() => setEditMode(prevMode => !prevMode)}>Edit</Button> : null}
                        </div>

                    </div>
                </div>
                : null}
        </div>
    )
}