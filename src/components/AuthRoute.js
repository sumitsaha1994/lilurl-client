import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";

const AuthRoute = ({ component: Component, setUser, user, ...rest }) => {
    const [isAuthorized, setAuthorized] = useState(false);
    const [isLoading, setLoading] = useState(true);
    // const [user, setUser] = useState({});
    useEffect(() => {
        setLoading(true);
        fetch("/users/getUser")
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    setAuthorized(true);
                    setUser(data.message.user);
                } else {
                    setAuthorized(false);
                    setUser({});
                }
                setLoading(false);
            })
            .catch(console.error);
        // return () => {
        console.log("auth called");
        // };
    }, [Component, setUser]);

    return !isLoading ? (
        isAuthorized ? (
            <Route
                {...rest}
                render={(props) => <Component {...props} setUser={setUser} user={user} />}
            />
        ) : (
            <Redirect to="/user/login" />
        )
    ) : (
        <p>Loading...</p>
    );
};

export default AuthRoute;
