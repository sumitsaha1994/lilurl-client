import React, { useState } from "react";
import { Form } from "react-bootstrap";
import SubmitButton from "../components/SubmitButton";
import API_URL from "../api";

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [dataErrors, setDataErrors] = useState({});
    const [error, setError] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setDataErrors({});
        setError("");
        fetch(`${API_URL}/users/sendForgotPasswordEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    setEmailSent(true);
                } else {
                    if (data.message.errors) {
                        setDataErrors(data.message?.errors);
                    } else if (data.message.passwordResetEmail) {
                        setError(data.message.passwordResetEmail);
                    } else {
                        setError("Something went wrong.");
                    }
                }
                setIsLoading(false);
            })
            .catch((error) => setError("Something went wrong."));
    };

    return (
        <div style={{ width: "20rem", margin: "auto" }}>
            <h2>Forgot password</h2>
            {!emailSent ? (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control
                            type="text"
                            name="email"
                            value={email}
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Text className="text-danger">{dataErrors.email}</Form.Text>
                    </Form.Group>

                    <SubmitButton isLoading={isLoading} buttonText="Reset Password" block />
                    <Form.Text className="text-danger">{error}</Form.Text>
                </Form>
            ) : (
                <p>Password reset link has been sent to your Email.</p>
            )}
        </div>
    );
};

export default ForgotPassword;
