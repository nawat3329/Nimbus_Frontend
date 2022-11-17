import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { Link, } from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

export default function PostResponse(props) {
    const response = props.response;
    const [isLike, setIsLike] = useState(response.islike);
    const [isLogin, setIsLogin] = useState(false);
    const [count, setCount] = useState(response.like?.length);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        currentUser ? setIsLogin(true) : setIsLogin(false);
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


    return (
        <div key={response._id} className="card">
            <Link to={"/profile/" + response?.author} style={{ fontSize: 20, color: "black", textDecoration: 'none' }} className="card-header" >
                {response?.username}
            </Link>
            <Link to={"/post/" + response._id} style={{ color: "black", textDecoration: 'none' }} className="card-body">
                <h6 className="card-title">{response?.text}</h6>
                <p className="card-text">
                    <Image src={response.post_images} fluid />
                </p>
            </Link>
            {isLogin ?
                <div className="card-footer">
                    {!isLike ? <Button variant="outline-primary" size="sm" onClick={() => like()} > {"Like (" + count + ")"}  </Button> 
                    : <Button variant="outline-primary" size="sm" onClick={() => unlike()}> {"Unlike (" + count + ")"} </Button>}
                </div>
                : null}
        </div>
    )
}