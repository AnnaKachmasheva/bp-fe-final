import React from "react";


const JsQRComponent = (props) => {
    //
    // const videoRef = useRef(null);
    // const canvasRef = useRef(null);
    //
    // useEffect(() => {
    //     const initCamera = async () => {
    //         try {
    //             // Request access to the webcam
    //             // Attach the stream to the video element
    //             videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}});
    //
    //             // Wait for the "loadedmetadata" event before playing
    //             videoRef.current.addEventListener('loadedmetadata', () => {
    //                 videoRef.current.play();
    //             });
    //
    //         } catch (err) {
    //             console.error("Error accessing the webcam", err);
    //         }
    //     };
    //
    //     initCamera().then(r => {});
    //
    //     // Set up a loop to continuously scan for QR codes
    //     const scanningLoop = setInterval(() => {
    //         if (videoRef.current && canvasRef.current) {
    //             const context = canvasRef.current.getContext('2d');
    //             context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    //             const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    //             const code = jsQR(imageData.data, imageData.width, imageData.height);
    //
    //             if (code) {
    //                 props.handleData(code.data);
    //                 clearInterval(scanningLoop);
    //             }
    //         }
    //     }, 100);
    //
    //     return () => {
    //         clearInterval(scanningLoop);
    //
    //         // Stop the video stream when the component unmounts
    //         const tracks = videoRef.current?.srcObject?.getTracks();
    //         if (tracks) {
    //             tracks.forEach(track => track.stop());
    //         }
    //     };
    // }, []);
    //

    return (
        <div>
            {/*<video*/}
            {/*    className={styles.cameraContainer}*/}
            {/*    ref={videoRef}*/}
            {/*    style={{width: '100%'}}*/}
            {/*    autoPlay*/}
            {/*    playsInline*/}
            {/*/>*/}
            {/*<canvas ref={canvasRef}*/}
            {/*        style={{display: 'none'}}/>*/}

        </div>
    );

}

export default JsQRComponent;