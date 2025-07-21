import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const Hero = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => stopScanning();
  }, [scanning]);

const startScanning = () => {
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    alert("Your browser does not support camera access.");
    return;
  }

  if (!videoRef.current) {
    console.warn("Video element not ready.");
    return;
  }

  codeReader.current
    .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
      if (result) {
        setResult(result.getText());
        setScanning(false);
      }

      if (err && !(err.name === 'NotFoundException')) {
        console.error(err);
      }
    })
    .catch((err) => {
      console.error("Failed to access camera:", err);
    });
};


  const stopScanning = () => {
    codeReader.current.reset();
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    if (tracks) {
      tracks.forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleClick = () => {
    setResult(null);
    setScanning(true);
  };

  return (
    <div className='text-white'>
      <div className='max-w-[1200px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>

        <h1 className='text-[#00df9a] md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
          Barcode-Driven Inventory.
        </h1>

        <div className='mt-6'>
          <button
            onClick={handleClick}
            className='bg-[#00df9a] text-black px-6 py-2 rounded font-bold hover:bg-[#00c481] transition'
          >
            Start Scanning
          </button>
        </div>

        {scanning && (
          <div className='mt-6 flex justify-center'>
            <video
              ref={videoRef}
              width='300'
              height='200'
              style={{ border: '2px solid #00df9a' }}
            />
          </div>
        )}

        {result && (
          <div className='mt-6 text-xl'>
            <h3 className='font-bold'>Scanned Result:</h3>
            <p className='text-[#00df9a]'>{result}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Hero;
