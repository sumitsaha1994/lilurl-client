import React from "react";
import { Toast } from "react-bootstrap";

const AppToast = ({ toast }) => {
    return (
        <Toast
            style={{
                position: "absolute",
                left: 20,
                bottom: 20,
                backgroundColor:
                    toast.toastState.status === "success" ? "rgb(40, 167, 69)" : "#dc3545",
                color: "#fff",
            }}
            show={toast.toastState.show}
            onClose={() =>
                toast.setToastState((state) => ({
                    ...state,
                    title: "",
                    msg: "",
                    show: false,
                }))
            }
            delay={3000}
            autohide
        >
            <Toast.Header>
                <strong className="mr-auto">{toast.toastState.title}</strong>
            </Toast.Header>
            <Toast.Body>{toast.toastState.message}</Toast.Body>
        </Toast>
    );
};

export default React.memo(AppToast);
