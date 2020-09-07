import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import API_URL from "../api";

const Login = () => {
    const [state, setState] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const history = useHistory();
    const handlesubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        fetch(`${API_URL}/users/login`, {
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
                    history.push("/user/dashboard");
                } else if (data.statusCode === 400) {
                    setErrors(data.message);
                } else {
                    throw new Error("Something went wrong. Please try again");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setErrors({ login: "Something went wrong. Please try again" });
            });
    };

    return (
        <div style={{ width: "20rem", margin: "auto" }}>
            <h1>Login</h1>
            <Form.Text className="text-danger">{errors.login}</Form.Text>
            <Form onSubmit={handlesubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Control
                        type="text"
                        name="email"
                        value={state.email}
                        placeholder="Enter email"
                        onChange={(e) =>
                            setState({
                                ...state,
                                [e.target.name]: e.target.value,
                            })
                        }
                    />
                    <Form.Text className="text-danger">{errors.email}</Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Control
                        type="password"
                        name="password"
                        value={state.password}
                        placeholder="Password"
                        onChange={(e) =>
                            setState({
                                ...state,
                                [e.target.name]: e.target.value,
                            })
                        }
                    />
                    <Form.Text className="text-danger">{errors.password}</Form.Text>
                </Form.Group>
                <SubmitButton isLoading={isLoading} buttonText="Login" block />
                <Form.Text>
                    Do not have an account? Sign up <Link to="/user/signup">here</Link>
                </Form.Text>
                <Form.Text>
                    <Link to="/user/forgotPassword">Forgot password</Link>
                </Form.Text>
            </Form>
        </div>
    );
};

export default Login;
