import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ size, variant, text }) => {
    return (
        <div style={{ textAlign: "center" }}>
            <Spinner
                as="span"
                animation="border"
                role="status"
                variant={variant}
                aria-hidden="true"
                size={size}
            >
                <span className="sr-only">Loader</span>
            </Spinner>{" "}
            {text ? text : "Loading..."}
        </div>
    );
};

export default Loader;
