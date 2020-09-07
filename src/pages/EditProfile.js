import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import SubmitButton from "../components/SubmitButton";
import Loader from "../components/Loader";
import AppToast from "../components/AppToast";
import { useHistory } from "react-router-dom";
import API_URL from "../api";

function EditProfile(props) {
    const history = useHistory();
    const [state, setState] = useState({ firstName: "", lastName: "" });
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isDataLoading, setDataLoading] = useState(true);
    const [toastState, setToastState] = useState({
        title: "",
        message: "",
        show: false,
        status: "",
    });
    const styles = {
        container: {
            width: "20rem",
            margin: "20px auto",
            textAlign: "left",
        },
    };
    const handleInputChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };
    const handleUrlSubmit = (e) => {
        e.preventDefault();
        setIsSubmitLoading(false);
        setErrors({});
        fetch(`${API_URL}/users/updateProfileDetails`, {
            method: "PUT",
            credentials: "include",

            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(state),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    props.setUser((s) => {
                        return { ...s, firstName: state.firstName, lastName: state.lastName };
                    });
                    setToastState({
                        ...toastState,
                        title: "Profile update",
                        message: "Details have been updated successfully",
                        show: true,
                        status: "success",
                    });
                } else if (data.statusCode === 401) {
                    history.push("/user/login");
                } else if (data.statusCode === 400) {
                    if (data.message.errors) {
                        setErrors(data.message.errors);
                    } else if (data.message.updateProfile) {
                        setToastState({
                            ...toastState,
                            title: "Profile update",
                            message: data.message.updateProfile,
                            show: true,
                            status: "error",
                        });
                    } else {
                        throw new Error("something went wrong");
                    }
                } else {
                    throw new Error();
                }
                setIsSubmitLoading(false);
            })
            .catch((err) => {
                setToastState({
                    ...toastState,
                    title: "Profile update",
                    message: "Something went wrong. Please try again.",
                    show: true,
                    status: "error",
                });
            });
    };

    useEffect(() => {
        setDataLoading(true);
        fetch(`${API_URL}/users/getUser`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    console.log(data.message.user);
                    const user = data.message.user;
                    setState({
                        ...state,
                        firstName: user.firstName ? user.firstName : "",
                        lastName: user.lastName ? user.lastName : "",
                    });
                    props.setUser((s) => {
                        return { ...s, firstName: user.firstName, lastName: user.lastName };
                    });
                }
                setDataLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {isDataLoading ? (
                <Loader size="sm" />
            ) : (
                <>
                    <Form onSubmit={handleUrlSubmit} style={styles.container}>
                        <h2>Update profile info</h2>

                        <Form.Group controlId="first-name" style={{ width: "100%" }}>
                            <Form.Label>First name</Form.Label>

                            <Form.Control
                                type="text"
                                name="firstName"
                                value={state.firstName}
                                placeholder="Enter first name"
                                onChange={handleInputChange}
                            />
                            <Form.Text className="text-danger">{errors.firstName}</Form.Text>
                        </Form.Group>

                        <Form.Group controlId="last-name" style={{ width: "100%" }}>
                            <Form.Label>Last name</Form.Label>

                            <Form.Control
                                type="text"
                                name="lastName"
                                value={state.lastName}
                                placeholder="Enter last name"
                                onChange={handleInputChange}
                            />
                            <Form.Text className="text-danger">{errors.lastName}</Form.Text>
                        </Form.Group>

                        <SubmitButton isLoading={isSubmitLoading} buttonText="update" />
                    </Form>
                    <AppToast toast={{ toastState, setToastState }} />
                </>
            )}
        </div>
    );
}

export default EditProfile;
