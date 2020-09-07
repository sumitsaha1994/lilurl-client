import React from "react";
import { Button } from "react-bootstrap";
import Loader from "./Loader";

const SubmitButton = ({ isLoading, buttonText, ...rest }) => {
    return (
        <Button
            variant={isLoading ? "secondary" : "primary"}
            type="submit"
            disabled={isLoading}
            {...rest}
        >
            {isLoading ? <Loader size="sm" variant="dark" text="Loading..." /> : <>{buttonText}</>}
        </Button>
    );
};

export default SubmitButton;
