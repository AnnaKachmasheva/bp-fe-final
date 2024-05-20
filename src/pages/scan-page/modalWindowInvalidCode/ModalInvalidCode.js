import React from "react";
import ModalWindow from "../../../components/modal/ModalWindow";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";


export const ModalInvalidCode = (props) => {
    if (!props.show)
        return null;

    const handleRescan = async () => {
        props.onClose(true)
        props.rescan()
    }

    function getContent() {
        return (
            <div className={'modal-window-body'}>

                <span>The data received when decoding the code is invalid</span>

                <p>
                    {props.data}
                </p>

                <div className={'buttons'}>
                    <Button type={ButtonType[3].type}
                            size={ButtonSize[1].size}
                            onClick={handleRescan}
                            label={'Cancel'}/>

                    <Button type={ButtonType[0].type}
                            size={ButtonSize[1].size}
                            onClick={handleRescan}
                            label={'Rescan'}/>
                </div>
            </div>
        )
    }

    return (
        <ModalWindow show={props.show}
                     title={"Invalid QR code"}
                     content={getContent()}/>
    )
}
