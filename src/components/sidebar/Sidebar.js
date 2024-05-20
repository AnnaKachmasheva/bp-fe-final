import React, {Component, useState} from "react";
import {BsListUl, BsQrCodeScan, BsTags} from "react-icons/bs";
import {AiOutlineUser} from "react-icons/ai";
import {PiUsers} from "react-icons/pi";
import {RxDashboard, RxHamburgerMenu} from "react-icons/rx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import styles from './Sidebar.module.scss';
import logo from '../../assets/logo_sidebar.png';
import {PageTitles} from "../../utils/Constants";
import {IoExitOutline, IoHomeOutline} from "react-icons/io5";
import {isAdmin, isUser} from "../../services/auth";
import {FaListCheck} from "react-icons/fa6";
import {RiCloseLargeFill} from "react-icons/ri";


const Sidebar = (props) => {

    let navigate = useNavigate();

    const location = useLocation();
    const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);

    const sidebarAdminRows = [
        {
            linkText: PageTitles.SEARCH,
            link: "/search"
        },
        {
            linkText: PageTitles.DASHBOARD,
            link: "/dashboard"
        },
        {
            linkText: PageTitles.ORDERS,
            link: "/orders"
        },
        {
            linkText: PageTitles.STORAGE,
            link: "/storage"
        },
        {
            linkText: PageTitles.USERS,
            link: "/users"
        },
        {
            linkText: PageTitles.PROFILE,
            link: "/profile"
        },
        {
            linkText: PageTitles.LOGOUT,
            link: "/logout"
        },
    ];

    const sidebarUserRows = [
        {
            linkText: PageTitles.SCAN,
            link: "/scan"
        },
        {
            linkText: PageTitles.ORDERS,
            link: "/orders"
        },
        {
            linkText: PageTitles.PROFILE,
            link: "/profile"
        },
        {
            linkText: PageTitles.LOGOUT,
            link: "/logout"
        },
    ];


    function handleClickLogo() {
        if (isUser()) {
            navigate("/app/orders")
        }
        if (isAdmin()) {
            navigate("/app/dashboard")
        }
    }

    function handleClickBurger() {
        setBurgerMenuOpen(false)
    }

    return (
        <div className={styles.sidebarContainer
            .concat(' sidebar')}>
            <div className={styles.logoContainer}>
                <img src={logo}
                     onClick={handleClickLogo}
                     alt={'logo'}/>
            </div>

            {isBurgerMenuOpen ?
                <div className={styles.burgerButton}>
                    <RiCloseLargeFill size={34}
                                      className={styles.iconBurger}
                                      onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}/>
                </div>
                :
                <div className={styles.burgerButton}>
                    <RxHamburgerMenu size={34}
                                     className={styles.iconBurger}
                                     onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}/>
                </div>
            }

            {
                isBurgerMenuOpen ? (
                        <div className={styles.burgerMenu}>

                            {isUser() ?
                                sidebarUserRows.map(({
                                                         linkText,
                                                         link,
                                                         onTop
                                                     }) => (
                                    <SidebarRow
                                        linkText={linkText}
                                        link={link}
                                        key={link}
                                        onTop={onTop}
                                        location={location.pathname}
                                        handleClick={() => handleClickBurger()}
                                    />
                                ))
                                :
                                sidebarAdminRows.map(({
                                                          linkText,
                                                          link,
                                                          onTop
                                                      }) => (
                                    <SidebarRow
                                        linkText={linkText}
                                        key={link}
                                        link={link}
                                        onTop={onTop}
                                        location={location.pathname}
                                        handleClick={() => handleClickBurger()}
                                    />
                                ))
                            };


                        </div>
                    )
                    :
                    (
                        <div className={styles.fullSidebar}>
                            {isUser() ?
                                sidebarUserRows.map(({
                                                         linkText,
                                                         link,
                                                         onTop
                                                     }, index) => (
                                    <SidebarRow
                                        key={index}
                                        linkText={linkText}
                                        link={link}
                                        onTop={onTop}
                                        location={location.pathname}
                                        handleClick={() => handleClickBurger()}
                                    />
                                ))
                                :
                                sidebarAdminRows.map(({
                                                          linkText,
                                                          link,
                                                          onTop
                                                      }, index) => (
                                    <SidebarRow
                                        key={index}
                                        linkText={linkText}
                                        link={link}
                                        onTop={onTop}
                                        location={location.pathname}
                                        handleClick={() => handleClickBurger()}
                                    />
                                ))
                            }
                        </div>
                    )
            }
        </div>
    )
        ;
};

export default Sidebar;

const iconSizeSidebar = 28;

class SidebarRow extends Component {

    renderIcon = () => {
        // eslint-disable-next-line default-case
        switch (this.props.linkText) {
            case PageTitles.DASHBOARD :
                return <RxDashboard className={styles.sidebarIcon}
                                    size={iconSizeSidebar}/>;
            case PageTitles.STORAGE :
                return <BsListUl className={styles.sidebarIcon}
                                 size={iconSizeSidebar}/>;
            case PageTitles.SEARCH :
                return <BsQrCodeScan className={styles.sidebarIcon}
                                     size={iconSizeSidebar}/>;
            case PageTitles.TAGS:
                return <BsTags className={styles.sidebarIcon}
                               size={iconSizeSidebar}/>;
            case PageTitles.USERS :
                return <PiUsers className={styles.sidebarIcon}
                                size={iconSizeSidebar}/>;
            case PageTitles.PROFILE :
                return <AiOutlineUser className={styles.sidebarIcon}
                                      size={iconSizeSidebar}/>;
            case PageTitles.LOGOUT :
                return <IoExitOutline className={styles.sidebarIcon}
                                      size={iconSizeSidebar}/>;
            case PageTitles.ORDERS :
                return <FaListCheck className={styles.sidebarIcon}
                                    size={iconSizeSidebar}/>;
            case PageTitles.HOME :
                return <IoHomeOutline className={styles.sidebarIcon}
                                      size={iconSizeSidebar}/>;
        }
    }

    render() {
        return (
            <Link to={'/app' + this.props.link}
                  className={styles.sidebarItem + ' ' +
                      (this.props.location === ('/app' + this.props.link) ?
                          styles.selectedItem :
                          styles.notSelectedItem)}
                  onClick={() => this.props.handleClick()}>

                {this.renderIcon(this.props.linkText)}
                <p>{this.props.linkText}</p>
            </Link>
        )
    }
}