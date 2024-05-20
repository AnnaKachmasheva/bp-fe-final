import React, {useEffect} from "react";
import {Html5QrcodeScanner} from "html5-qrcode";
import styles from "./ScannerComponent.module.scss";

const qrcodeRegionId = "html5qr-code-full-region";

const createConfig = () => {
    let config = {};

    config.fps = 10;
    config.qrbox = 250;

    return config;
};

const Html5QrCodeComponent = (props) => {

    useEffect(() => {
        // when component mounts
        const config = createConfig();
        // Suceess callback
        if (!(props.handleData)) {
            props.handleData("")
            // throw "qrCodeSuccessCallback is required callback.";
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, false);

        const container = document.getElementById(qrcodeRegionId);
        if (html5QrcodeScanner && container?.innerHTML === "") {
            html5QrcodeScanner.render(props.handleData, null);
        }
        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                // console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <div id={qrcodeRegionId}
             className={styles.cameraContainer}/>
    );
};


export default Html5QrCodeComponent;