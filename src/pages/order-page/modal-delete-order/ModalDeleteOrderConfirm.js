import React from "react";
import ModalWindow from "../../../components/modal/ModalWindow";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import {userApi} from "../../../services/api";


export const ModalDeleteOrderConfirm = (props) => {
    if (!props.show)
        return null;

    const handleDeleteOrder = async () => {
        try {
            const orderId = props.orderId;
            await userApi.deleteOrder(orderId);
            window.location.reload();
        } catch (error) {
        }
    }

    function getContent() {
        return (
            <div className={'modal-window-body'}>

                <p>Are you sure you want to delete the order?</p>

                <div className={'buttons'}>
                    <Button type={ButtonType[1].type}
                            size={ButtonSize[1].size}
                            onClick={props.onClose}
                            label={'Cancel'}/>

                    <Button type={ButtonType[4].type}
                            size={ButtonSize[1].size}
                            onClick={handleDeleteOrder}
                            label={'Delete order'}/>
                </div>
            </div>
        )
    }

    return (
        <ModalWindow show={props.show}
                     title={"Delete order"}
                     content={getContent()}/>
    )
}
