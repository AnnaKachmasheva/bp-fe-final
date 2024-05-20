import React from "react";
import ModalWindow from "../../modal/ModalWindow";
import QRCode from "qrcode.react";
import styles from "./ModalQRCode.module.scss";
import Button, {ButtonSize, ButtonType} from "../../button/Button";
import {useNavigate} from "react-router-dom";


export const ModalQRCode = (props) => {
    if (!props.show)
        return null;

    const qrCodeSize = 230;

    function handlePrintCode() {
        //todo
    }

    function getContent() {
        return (
            <div className={'modal-window-body '.concat(styles.container)}>
                <div>
                    <QRCode value={props.data}
                            size={qrCodeSize}
                            className={'code'}
                    />

                    <div className={'buttons'}>

                        <Button type={ButtonType[3].type}
                                size={ButtonSize[1].size}
                                onClick={props.onClose}
                                label={'Cancel'}/>

                        <Button type={ButtonType[2].type}
                                size={ButtonSize[1].size}
                                onClick={() => handlePrintCode()}
                                label={'Print code'}/>

                        <Button type={ButtonType[0].type}
                                size={ButtonSize[1].size}
                                onClick={props.showVariant}
                                label={'Show variant'}/>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ModalWindow show={props.show}
                     content={getContent()}/>
    )

}