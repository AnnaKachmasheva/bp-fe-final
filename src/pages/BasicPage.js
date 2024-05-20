import Sidebar from "../components/sidebar/Sidebar";
import Nav from "../components/nav/Nav";
import React from "react";
import {getUserRole} from "../services/auth";

function BasicPage(props) {


    if (!props.isAuth) {
        return (
            <div className={'main'}>
                {props.page}
            </div>
        )
    }


    if (getUserRole() === 'USER') {
        return (
            <div className={'main'}>
                {props.showSideBar ? <Sidebar/> : null}
                {props.page}
            </div>
        )
    }

    return (
        <div className={'main'}>
            {props.showSideBar ? <Sidebar/> : null}
            <Nav title={props.title}/>
            {props.page}
        </div>
    )

}

export default BasicPage