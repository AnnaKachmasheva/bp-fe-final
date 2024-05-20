import React, {useEffect, useState} from "react";
import styles from './ProfilePage.module.scss';
import {BsPencil, BsTrash} from "react-icons/bs";
import {MdPassword} from "react-icons/md";
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";
import {userApi} from "../../services/api";
import {showValue} from "../../utils/Common";
import {removeToken, userRole} from "../../services/auth";
import {useNavigate} from 'react-router-dom';
import {ModalEditProfile} from "./modal-edit-user/ModalEditProfile";
import {ModalEditPassword} from "./modal-edit-password/ModalEditPassword";
import {ModalDeleteProfileConfirm} from "./modal-delete-user/ModalDeleteProfileConfirm";

function ProfilePage() {

    const navigate = useNavigate();

    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
    const [user, setUser] = useState([]);

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [errorChangePassword, setErrorChangePassword] = useState(null);

    useEffect(() => {
        const handleGetCurrentUser = async () => {
            try {
                const response = await userApi.getCurrentUser()
                setUser(response.data)
            } catch (error) {
                removeToken();
                navigate('/app/logout');
            }
        }
        handleGetCurrentUser().then(r => []);
    }, [])

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleRepeatPassword = () => {
        setShowRepeatPassword(!showRepeatPassword);
    };

    const handleToggleOldPassword = () => {
        setShowOldPassword(!showOldPassword);
    };


    return (
        <div className={'content'}>
            <ModalDeleteProfileConfirm onClose={() => setShowConfirmDeleteModal(false)}
                                       show={showConfirmDeleteModal}
                                       user={user}/>

            <ModalEditPassword onClose={() => setShowChangePasswordModal(false)}
                               user={user}
                               show={showChangePasswordModal}
                               showPassword={showPassword}
                               showOldPassword={showOldPassword}
                               showRepeatPassword={showRepeatPassword}
                               onTogglePassword={handleTogglePassword}
                               onToggleRepeatPassword={handleToggleRepeatPassword}
                               onToggleOldPassword={handleToggleOldPassword}
                               errorChangePassword={errorChangePassword}
                               setErrorChangePassword={(error) => setErrorChangePassword(error)}/>

            <ModalEditProfile onClose={() => setShowUpdateUserModal(false)}
                              show={showUpdateUserModal}
                              user={user}
            />

            <div className={styles.userProfile}>

                <div className={styles.userInfo}>
                    <div className={styles.infoColumn}>
                        <p>User role: <span>{showValue(userRole())}</span></p>
                        <p>First name: <span>{showValue(user.firstName)}</span></p>
                        <p>Last name: <span>{showValue(user.lastName)}</span></p>
                        <p>Email: <span>{showValue(user.email)}</span></p>
                    </div>


                    <div className={'buttons '.concat(styles.buttons)}>

                        <Button label={'Change password'}
                                type={ButtonType[3].type}
                                size={ButtonSize[1].size}
                                onClick={() => setShowChangePasswordModal(true)}
                                icon={<MdPassword/>}/>

                        <Button label={'Edit'}
                                type={ButtonType[2].type}
                                size={ButtonSize[1].size}
                                onClick={() => setShowUpdateUserModal(true)}
                                icon={<BsPencil/>}/>

                    </div>
                </div>

                <div className={styles.deleteButton}>
                    <Button label={'Delete account'}
                            type={ButtonType[4].type}
                            size={ButtonSize[0].size}
                            onClick={() => setShowConfirmDeleteModal(true)}
                            icon={<BsTrash/>}
                            isIconStart={true}/>
                </div>
            </div>

        </div>
    )
}


export default ProfilePage