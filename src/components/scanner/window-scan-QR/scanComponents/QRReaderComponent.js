import React from "react";
import {QrReader} from "react-qr-reader";
import styles from "./ScannerComponent.module.scss";


const QRReaderComponent = (props) => {

    return (
        <div>
            <QrReader
                className={styles.qrReader}
                constraints={{ facingMode: 'environment' }}
                videoStyle={{ height: '100%' }}
                onResult={(result, error) => {
                    if (!!result) {
                        props.handleData(result?.text);
                    }
                    if (!!error) {
                        // console.info(error);
                    }
                }}
            />
        </div>
    );

}

export default QRReaderComponent;