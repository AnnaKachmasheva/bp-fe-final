import React, {useEffect, useRef, useState} from "react";
import {ModalScanQRCode} from "./window-scan-QR/ModalScanQRCode";
import {ModalQRCode} from "./window-show-QR/ModalQRCode";
import {QRScanLibraries} from "../../utils/Constants";


function ScanComponent() {

    const scanMethodOptions = [
        {value: 'html5-qrcode', label: 'html5-qrcode'},

        {value: 'react-qr-reader', label: 'react-qr-reader'},
        {value: 'react-zxing', label: 'react-zxing'},
        {value: 'quagga', label: 'quagga'},
        {value: 'jsqr', label: 'jsqr'}
    ];

    const [showModalScanQr, setShowModalScanQr] = useState(false);
    const [showModalQRCode, setShowModalQRCode] = useState(false);

    const [data, setData] = useState(null);
    const [scanMethod, setScanMethod] = useState(scanMethodOptions[0].value);


    const handleChange = (e) => {
        setScanMethod(e.target.value);
    };

    const handleData = data => {
        setData(data);
    }

    const handleClickScanBtn = () => {
        setData(null);
        setShowModalScanQr(true);
    }

    const modalRef = useRef(null);
    const videosRef = useRef([]);

    useEffect(() => {
        if ([showModalScanQr]) {
            // Find all video elements within the modal when it opens
            const videosInModal = modalRef.current.querySelectorAll('video');

            // Save references to all videos
            videosRef.current = Array.from(videosInModal).map((video) => ({ ref: video }));
        } else {
            // Pause and reset all videos when the modal is closed
            videosRef.current.forEach(({ ref }) => {
                if (ref) {
                    ref.stop();
                    ref.currentTime = 0;
                }
            });
        }
    }, [showModalScanQr]);

    return (
        <div className={'contentContainer'}>
            <ModalScanQRCode onClose={() => setShowModalScanQr(false)}
                             show={showModalScanQr}
                             data={data}
                             handleData={handleData}
                             scanMethod={scanMethod}/>

            <ModalQRCode onClose={() => setShowModalQRCode(false)}
                         show={showModalQRCode}
                         data={data}
                         rescanData={() => setData(null)}
            />

            {data !== null ?
                <div>
                    <p>data: {data}</p>
                    <button type={'submit'}
                            className={'btn btn-outline-success'}
                            onClick={() => setShowModalScanQr(true)}>
                        Show code
                    </button>
                </div>
                : null
            }

            <div className={'content'}>
                <p>Select scan method:</p>
                <select onChange={handleChange}>>
                    {QRScanLibraries.map((library, index) =>
                        <option value={library.name}>
                            {library.name} - Version {library.version}
                        </option>)}
                </select>

                <button type={'submit'}
                        className={'btn btn-outline-success'}
                        onClick={handleClickScanBtn}>
                    Scan
                </button>

            </div>

        </div>
    )
}

export default ScanComponent