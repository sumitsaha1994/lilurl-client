import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const AccountActivation = () => {
    const { token: urlToken } = useParams();
    const history = useHistory();
    const [message, setMessage] = useState("");
    useEffect(() => {
        //console.log(urlToken);
        fetch("/users/verifyEmailActivation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ urlToken }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.statusCode === 200) {
                    console.log(data.message);
                    setMessage("Your account is active now. You will be redirected to login page");
                    setTimeout(() => {
                        history.push("/user/login");
                    }, 3000);
                } else if (data.statusCode === 400) {
                    if (data.message.accountActivation === "") setMessage("login");
                } else {
                    throw new Error();
                }
            })
            .catch((error) => {
                setMessage("Something went wrong. Please try again");
            });
    }, []);

    return (
        <Container>
            {message === "login" ? (
                <p>
                    Your account activation link is invalid. Please try to{" "}
                    <Link to="/user/login">login</Link> and activate again.
                </p>
            ) : (
                <p>{message}</p>
            )}
        </Container>
    );
};

export default AccountActivation;
