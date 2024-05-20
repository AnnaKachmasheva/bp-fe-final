import React from "react";
import ModalWindow from "../../../components/modal/ModalWindow";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import {QrReader} from "react-qr-reader";
import styles from "../../scan-page/ScanPage.module.scss";
import {decodeData} from "../../../utils/Common";


export const ModalScanCode = (props) => {

    if (!props.show)
        return null;

    const stopScan = () => {
        props.scanedCode('')
        props.onClose(true);
    }

    const handleScan = (code) => {
        props.scanedCode(code);
    }

    const handleRescan = () => {
        props.rescan();
    }

    const isValid = () => {
        if (props.product.id === decodeData(props.code)) {
            props.addProductToScanned();
            stopScan();
        }
        return false;
    }

    function getContent() {
        return (
            <div className={'modal-window-body'}>

                {props.code ?
                    <div>
                        {isValid() ?
                            null :
                            <div>
                                <p className={styles.title}>Product
                                    <span className={styles.productName}> {props.product.name}</span>
                                    has another QR code
                                </p>
                                <Button type={ButtonType[2].type}
                                        size={ButtonSize[1].size}
                                        onClick={handleRescan}
                                        label={'Rescan'}/>
                            </div>}
                    </div>
                    :

                    <QrReader
                        className={styles.qrReader}
                        constraints={{facingMode: 'environment'}}
                        videoStyle={{height: '100%'}}
                        onResult={(result, error) => {
                            if (!!result) {
                                handleScan(result?.text);
                            }
                            if (!!error) {
                                console.info(error);
                            }
                        }}
                    />
                }
                <div className={styles.Button}>
                    <Button type={ButtonType[1].type}
                            size={ButtonSize[1].size}
                            onClick={stopScan}
                            label={'Cancel'}/>
                </div>
            </div>
        )
    }

    return (
        <ModalWindow show={props.show}
                     title={props.code ? "Scan result" : "Scan code"}
                     content={getContent()}/>
    )
}
