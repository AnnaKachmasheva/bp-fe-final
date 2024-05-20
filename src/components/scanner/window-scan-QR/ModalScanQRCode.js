import React, {useEffect, useState} from "react";
import styles from './ModalScanQRCode.module.scss';
import {AiOutlineClose} from "react-icons/ai";
import Html5QrCodeComponent from "./scanComponents/Html5QrCodeComponent";
import {QRScanLibraries} from "../../../utils/Constants";
import QrScannerComponent from "./scanComponents/QrScannerComponent";
import ZxingComponent from "./scanComponents/ZxingComponent";
import ReactQRReaderComponent from "./scanComponents/QRReaderComponent";
import JsQRComponent from "./scanComponents/JsQRComponent";

export const ModalScanQRCode = (props) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {

            setLoading(false);
        };

        loadData();
    }, []);

    if (!props.show)
        return null;

    if (!props.show) return null;
    const handleData = data => {
        props.handleData(data);
    }

    const renderContent = () => {

        if (loading) {
            return <p>Please wait...</p>;
        }

        switch (props.scanMethod.name) {

            case QRScanLibraries[0].name:
                return <Html5QrCodeComponent handleData={handleData}/>
            case QRScanLibraries[1].name:
                return <QrScannerComponent handleData={handleData}
                                           fps={10}
                                           qrbox={300}
                                           disableFlip={false}/>
            case QRScanLibraries[2].name:
                return <ZxingComponent handleData={handleData}/>
            case QRScanLibraries[3].name:
                return <ReactQRReaderComponent handleData={handleData}/>
            case QRScanLibraries[4].name:
                return <JsQRComponent handleData={handleData}/>

            default:
                return null;
        }
    }

    return (
        <div className={'modal'}
             onClick={props.onClose}>

            <div className={styles.contentFullScreen}
                 onClick={(e) => e.stopPropagation()}>

                <AiOutlineClose
                    className={styles.icon}
                    onClick={props.onClose}
                    size={40}
                />

                <div className={styles.scanContainer}>

                    {renderContent()}

                    <p className={styles.selectedLibrary}>
                        Selected library: <span>{props.scanMethod.name} {props.scanMethod.version}</span>
                    </p>

                    {props.data == null ?
                        null :
                        <p className={styles.resultData}>
                            Data: <span>{props.data}
                        </span></p>
                    }

                    {props.error == null ?
                        null :
                        <p className={styles.error}>Error: <span>{props.error}</span></p>
                    }


                </div>

            </div>
        </div>
    )
}
