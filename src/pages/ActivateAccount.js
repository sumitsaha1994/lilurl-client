import React, { useState } from "react";

import SubmitButton from "../components/SubmitButton";
import AppToast from "../components/AppToast";
import { useHistory } from "react-router-dom";

const ActivateAccount = (props) => {
    const history = useHistory();
    const [emailSent, setEmailSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toastState, setToastState] = useState({
        title: "Activate account",
        message: "",
        show: false,
        status: "",
    });
    const handleActivate = () => {
        setIsLoading(true);
        fetch("/users/sendActivationEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    setEmailSent(true);
                } else if (data.statusCode === 400) {
                    if (data.message.accountActivationEmail === "user is already activated") {
                        setToastState({
                            ...toastState,
                            message: "Your Account is already activated",
                            show: true,
                            status: "error",
                        });
                    } else if (data.message.accountActivationEmail === "not a valid user") {
                        setToastState({
                            ...toastState,
                            message: "Your user account is not valid",
                            show: true,
                            status: "error",
                        });
                    }
                } else if (data.statusCode === 401) {
                    history.push("/user/login");
                } else {
                    throw new Error();
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setToastState({
                    ...toastState,
                    message: "Something went wrong. Please try again.",
                    show: true,
                    status: "error",
                });
            });
    };

    return (
        <div style={{ width: "30%", margin: "auto", marginTop: "20px" }}>
            <h4> Account Activation</h4>
            <p>Welcome {props.user.userId}</p>
            <p>
                <small>Your account is not active. Please activate your account</small>
            </p>
            {emailSent ? (
                <p>
                    Account activation link has been sent to you email id. Please follow the link to
                    to activate your account
                </p>
            ) : (
                <SubmitButton
                    isLoading={isLoading}
                    buttonText="Activate"
                    block
                    onClick={handleActivate}
                />
            )}
            <AppToast toast={{ toastState, setToastState }} />
        </div>
    );
};

export default ActivateAccount;
