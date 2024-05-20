import BasicPage from "../pages/BasicPage";
import LoginPage from "../pages/login-page/LoginPage";
import {PageTitles} from "../utils/Constants";
import RegistrationPage from "../pages/registartion-page/RegistrationPage";
import React from "react";
import ResetPasswordPage from "../pages/reset-password/ResetPasswordPage";
import HelloPage from "../pages/hello-page/HelloPage";

export const publicRoutes = [
    {
        path: "/login",
        main: () => <BasicPage page={<LoginPage/>}
                               title={PageTitles.LOGIN}
                               isAuth={false}/>
    },
    {
        path: "/registration",
        main: () => <BasicPage page={<RegistrationPage/>}
                               title={PageTitles.REGISTRATION}
                               isAuth={false}/>
    },
    {
        path: "/reset-password",
        main: () => <BasicPage page={<ResetPasswordPage/>}
                               title={PageTitles.RESET_PASSWORD}
                               isAuth={false}/>
    },
    {
        path: "/hello",
        main: () => <BasicPage page={<HelloPage/>}
                               title={PageTitles.HOME}
                               isAuth={false}/>
    }

];
