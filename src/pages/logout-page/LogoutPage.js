import React, {useEffect} from "react"
import {isAuthenticated, removeToken, removeUser} from "../../services/auth";
import {Navigate} from "react-router-dom";


function LogoutPage() {

    useEffect(() => {
        if (isAuthenticated() === true) {
            removeToken();
        }
    }, []);

    return <Navigate replace to="/hello"/>;
}

export default LogoutPage;