import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import API_URL from "../api";

const Signup = () => {
    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleInputChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${API_URL}/users/signup`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(state),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.statusCode === 200) {
                    console.log(data.message.login);
                    setSignupSuccess(true);
                } else if (data.statusCode === 400) {
                    setErrors(data.message);
                } else {
                    throw new Error();
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setErrors({ signup: "Something went wrong. Please try again" });
            });
    };

    return (
        <>
            {signupSuccess ? (
                <Container>
                    <h2>Congratulations, You have successfully signed up on Lilurl.</h2>
                    <p>
                        Go to <Link to="/user/login">login</Link> page
                    </p>
                </Container>
            ) : (
                <div>
                    <Form onSubmit={handleSubmit} style={{ width: "30%", margin: "auto" }}>
                        <h1>Sign up</h1>
                        <Form.Text className="text-danger">{errors.signup}</Form.Text>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                type="text"
                                name="email"
                                placeholder="Enter email"
                                onChange={handleInputChange}
                            />
                            <Form.Text className="text-danger">{errors.email}</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                type="pasword"
                                name="password"
                                placeholder="Enter password"
                                onChange={handleInputChange}
                            />
                            <Form.Text className="text-danger">{errors.password}</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicConfirmPassword">
                            <Form.Control
                                type="pasword"
                                name="confirmPassword"
                                placeholder="Re enter password"
                                onChange={handleInputChange}
                            />
                            <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>
                        </Form.Group>
                        <SubmitButton isLoading={isLoading} buttonText="Sign up" block />
                    </Form>
                </div>
            )}
        </>
    );
};

export default Signup;
