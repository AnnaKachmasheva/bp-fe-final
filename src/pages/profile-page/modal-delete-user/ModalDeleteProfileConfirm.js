import React from "react";
import ModalWindow from "../../../components/modal/ModalWindow";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import {userApi} from "../../../services/api";
import {removeToken} from "../../../services/auth";


export const ModalDeleteProfileConfirm = (props) => {
    if (!props.show)
        return null;

    const handleDeleteAccount = async () => {
        try {
            const userId = props.user.id;
            await userApi.deleteUser(userId);

            removeToken();
        } catch (error) {
        }
    }

    function getContent() {
        return (
            <div className={'modal-window-body'}>

                <p>Are you sure you want to delete the account?</p>

                <div className={'buttons'}>
                    <Button type={ButtonType[1].type}
                            size={ButtonSize[1].size}
                            onClick={props.onClose}
                            label={'Cancel'}/>

                    <Button type={ButtonType[4].type}
                            size={ButtonSize[1].size}
                            onClick={handleDeleteAccount}
                            label={'Delete account'}/>
                </div>
            </div>
        )
    }

    return (
        <ModalWindow show={props.show}
                     title={"Delete profile"}
                     content={getContent()}/>
    )
}
