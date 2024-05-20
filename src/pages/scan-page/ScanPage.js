import React, {useState} from 'react';
import {QrReader} from 'react-qr-reader';
import styles from './ScanPage.module.scss';
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";
import {useNavigate} from "react-router-dom";
import {decodeData} from "../../utils/Common";
import {userApi} from "../../services/api";

const ScanPage = () => {

    let navigate = useNavigate();

    const [scannedResult, setScannedResult] = useState("");
    const [isNotFoundProduct, setIsNotFoundProduct] = useState(false);


    const handleScan = data => {
        const codeData = decodeData(data);
        setScannedResult(codeData);
        fetchProduct(codeData).then();
    }

    const fetchProduct = async (id) => {
        try {
            const response = await userApi.getProductById(id);
            if (response && response.error) {
                setIsNotFoundProduct(true);
            } else {
                goToProductPage(response.data);
            }
        } catch (error) {
            setIsNotFoundProduct(true);
        }
    };

    const goToProductPage = (product) => {
        const id = product.id;
        navigate(`/app/storage/product/${id}`, {state: {product: product}});
    };

    const handleRescan = () => {
        setScannedResult("");
    }

    const stopScan = () => {
        navigate(-1);
    }

    return (
        <div className={styles.scanContainer}>

            {scannedResult !== "" ?
                <div/>
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

            {(!isNotFoundProduct || scannedResult === "") ?
                <div/> :
                <div>
                    <p className={styles.title}>
                        Product with this QR code not found.
                    </p>
                    <Button type={ButtonType[2].type}
                            size={ButtonSize[1].size}
                            onClick={handleRescan}
                            label={'Rescan'}/>
                </div>
            }

            <div className={styles.cancelBtn}>
                <Button type={ButtonType[1].type}
                        size={ButtonSize[1].size}
                        onClick={stopScan}
                        label={'Cancel'}/>
            </div>


        </div>
    );
};

export default ScanPage;