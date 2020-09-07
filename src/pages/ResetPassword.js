import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { Form } from "react-bootstrap";
import SubmitButton from "../components/SubmitButton";
import API_URL from "../api";

const ResetPassword = () => {
    const { token: urlToken } = useParams();
    const [isRequestValid, setIsRequestValid] = useState(false);
    const [validateError, setValidateError] = useState("");
    const [validationLoading, setvalidationLoading] = useState(true);
    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        token: urlToken,
    });
    const [resetLoading, setResetLoading] = useState(false);
    const [resetDataErrors, setResetDataErrors] = useState({});
    const [isResetSuccess, setIsResetSuccess] = useState(false);
    const [resetError, setResetError] = useState("");
    useEffect(() => {
        setvalidationLoading(true);
        fetch(`${API_URL}/users/verifyPasswordResetLink`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ urlToken }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.statusCode === 200) {
                    setIsRequestValid(true);
                    setState({ ...state, email: data.message.email });
                } else if (data.statusCode === 400) {
                    setValidateError(data.message?.passwordResetLinkValidate);
                } else {
                    throw new Error();
                }
                setvalidationLoading(false);
            })
            .catch((error) => {
                setValidateError("Something went wrong. Please try again");
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInputChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleResetSubmit = (e) => {
        console.log(urlToken);
        e.preventDefault();
        setResetLoading(true);
        setResetDataErrors({});
        setResetError("");
        fetch(`${API_URL}/users/updatePassword`, {
            method: "PUT",
            credentials: "include",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(state),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    setIsResetSuccess(true);
                } else if (data.statusCode === 400) {
                    if (data.message.errors) {
                        setResetDataErrors(data.message.errors);
                    } else if (data.message.forgotPasswordUpdate) {
                        setResetError(data.message.forgotPasswordUpdate);
                    }
                } else {
                    throw new Error();
                }
                setResetLoading(false);
            })
            .catch((error) => {
                setResetError("Something went wrong. Please try again.");
            });
    };
    return (
        <div style={{ width: "30%", margin: "auto" }}>
            {validationLoading ? (
                <p>
                    <Loader size="sm" variant="primary" text="Verifying reset password request" />
                </p>
            ) : isRequestValid ? (
                isResetSuccess ? (
                    <p>
                        Password has been changed successfully. go to{" "}
                        <Link to="/user/login">login</Link> page
                    </p>
                ) : (
                    <div>
                        <Form onSubmit={handleResetSubmit}>
                            <h1>Password Reset</h1>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control
                                    type="text"
                                    name="email"
                                    disabled
                                    value={state.email}
                                    placeholder="Enter email"
                                    onChange={handleInputChange}
                                />
                                <Form.Text className="text-danger">
                                    {resetDataErrors.email}
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={state.password}
                                    placeholder="Password"
                                    onChange={handleInputChange}
                                />
                                <Form.Text className="text-danger">
                                    {resetDataErrors.password}
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicConfirmPassword">
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={state.confirmPassword}
                                    placeholder="Password"
                                    onChange={handleInputChange}
                                />
                                <Form.Text className="text-danger">
                                    {resetDataErrors.confirmPassword}
                                </Form.Text>
                            </Form.Group>
                            <SubmitButton isLoading={resetLoading} buttonText="Reset" block />
                        </Form>

                        <Form.Text className="text-danger">{resetError}</Form.Text>
                    </div>
                )
            ) : (
                <div>
                    {`Error validating request - Link could be invalid. Please try to reset again |
                    ${validateError}`}
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
