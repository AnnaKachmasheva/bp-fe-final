import React from "react";
import logo from '../../assets/small-logo.png';
import styles from './AuthHeader.module.scss';
import {useNavigate} from "react-router-dom";


const AuthHeader = () => {

    const navigate = useNavigate()

    return (
        <div className={'logo'}>
            <img className={styles.logo}
                 src={logo}
                 alt={'logo'}
                 onClick={() => {
                     navigate(`/`)
                 }}/>
        </div>
    )

};

export default AuthHeader;