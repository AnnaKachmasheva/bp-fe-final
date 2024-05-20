import React from "react";
import ModalWindow from "../../../components/modal/ModalWindow";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import {userApi} from "../../../services/api";


export const ModalDeleteProductConfirm = (props) => {
    if (!props.show)
        return null;

    const handleDeleteProduct = async () => {

        try {
            const productId = props.product.id;
            await userApi.deleteProduct(productId);
            props.onClose(true)
            window.location.reload();
        } catch (error) {
        }
    }

    function getContent() {
        return (
            <div className={'modal-window-body'}>

                <p>Are you sure you want to delete this product?</p>

                <div className={'buttons'}>
                    <Button type={ButtonType[3].type}
                            size={ButtonSize[1].size}
                            onClick={props.onClose}
                            label={'Cancel'}/>

                    <Button type={ButtonType[0].type}
                            size={ButtonSize[1].size}
                            onClick={handleDeleteProduct}
                            label={'Delete'}/>
                </div>
            </div>
        )
    }

    return (
        <ModalWindow show={props.show}
                     title={"Delete product"}
                     content={getContent()}/>
    )
}
