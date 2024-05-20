import React from "react";
import styles from './Nav.module.scss';
import {FaArrowLeftLong} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";

const Nav = (props) => {

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };


    return (
        <div>
            <div className={styles.navBarContainer.concat(' nav')}>
                <FaArrowLeftLong className={styles.backIcon}
                                 size={22}
                                 onClick={handleBackClick}/>
                <span>{props.title}</span>
            </div>

        </div>
    );
};

export default Nav;