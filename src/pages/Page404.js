import React from "react";

const Page404 = () => {
    return (
        <div className="container" style={{ textAlign: "center" }}>
            <h1>Page not found</h1>
            <img src={process.env.PUBLIC_URL + "/pagenotfound.gif"} alt="Page not found" />
        </div>
    );
};

export default Page404;
