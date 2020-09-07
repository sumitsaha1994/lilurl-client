import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthRoute from "./components/AuthRoute";
import Signup from "./pages/Signup";
import ActivateAccount from "./pages/ActivateAccount";
import AccountActivation from "./pages/AccountActivation";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditProfile from "./pages/EditProfile";
import NavBar from "./components/NavBar";
import UrlNavigation from "./pages/UrlNavigation";
import LinksDirectory from "./pages/LinksDirectory";
import Page404 from "./pages/Page404";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/user/dashboard" />
                    </Route>
                    <Route path="/user" component={AppRoute} />
                    <Route path="/pageNotFound" component={Page404} />
                    <Route path="/:urlToken" component={UrlNavigation} />
                </Switch>
            </Router>
        </div>
    );
}

const AppRoute = () => {
    const [user, setUser] = useState({});
    return (
        <>
            <NavBar user={user} />
            <Switch>
                <Route path="/user/login" component={Login} />
                <AuthRoute
                    path="/user/dashboard"
                    component={Dashboard}
                    setUser={setUser}
                    user={user}
                />
                <Route path="/user/signup" component={Signup} />
                <AuthRoute
                    path="/user/activateAccount"
                    component={ActivateAccount}
                    setUser={setUser}
                    user={user}
                />
                <Route path="/user/accountActivation/:token" component={AccountActivation} />
                <Route path="/user/forgotPassword" component={ForgotPassword} />
                <Route path="/user/resetPassword/:token" component={ResetPassword} />
                <AuthRoute
                    path="/user/editProfile"
                    component={EditProfile}
                    setUser={setUser}
                    user={user}
                />
                <AuthRoute
                    path="/user/linksDirectory"
                    component={LinksDirectory}
                    setUser={setUser}
                    user={user}
                />
            </Switch>
        </>
    );
};

export default App;
