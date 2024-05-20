import React, {useEffect} from "react";
import styles from './ScannerComponent.module.scss';
import {useZxing} from "react-zxing";

const ZxingComponent = (props) => {

    const { ref } = useZxing({
        onDecodeResult(result) {
            props.handleData(result.getText());
        },
    });

    useEffect(() => {
        // Access the video element directly and play it
        const videoElement = ref.current;

        if (videoElement && videoElement.paused) {
            videoElement.play().catch((error) => {
                // console.error("Error playing video:", error);
            });
        }

        // Cleanup: Pause the video when the component is unmounted
        return () => {
            if (videoElement) {
                videoElement.pause();
            }
        };
    }, [ref]);

    return (
        <div className={styles.cameraWrapper}>
            <video ref={ref}
                   className={styles.cameraContainer}
            />
        </div>
    );

}

export default ZxingComponent;