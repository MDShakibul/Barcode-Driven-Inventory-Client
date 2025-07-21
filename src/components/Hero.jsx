/* eslint-disable no-unused-vars */
import { BrowserMultiFormatReader } from '@zxing/library';
import { useEffect, useRef, useState } from 'react';

const Hero = () => {
	const [scanning, setScanning] = useState(false);
	const [result, setResult] = useState(null);
	const [product, setProduct] = useState(null);
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
			alert('Your browser does not support camera access.');
			return;
		}

		if (!videoRef.current) {
			console.warn('Video element not ready.');
			return;
		}

		codeReader.current
			.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
				if (result) {
					const scannedText = result.getText();
					setResult(scannedText);
					setScanning(false);
					fetchProductDetails(scannedText);
				}

				if (err && !(err.name === 'NotFoundException')) {
					console.error(err);
				}
			})
			.catch((err) => {
				console.error('Failed to access camera:', err);
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



	const fetchProductDetails = async (code) => {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/products/product-details/${code}`
			);

			if (!res.ok) {
				throw new Error(`Fetch failed with status: ${res.status}`);
			}

			const json = await res.json();
			const product = json?.data;
			setProduct(product);

			// Second: PATCH to another API using the received product
			if (product) {
				const patchRes = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/products/add-product`,
					{
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(product),
					}
				);

				if (!patchRes.ok) {
					throw new Error(`PATCH failed with status: ${patchRes.status}`);
				}

				console.log('Product saved successfully.');
			}
		} catch (error) {
			console.error('API fetch failed:', error);
		}
	};

	return (
		<div className="text-white">
			<div className="max-w-[1200px] mt-[-96px] w-full h-[700px] mx-auto text-center flex flex-col justify-center">
				<h1 className="text-[#00df9a] md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
					Barcode-Driven Inventory.
				</h1>

				<div className="mt-6">
					<button
						onClick={() => {
							if (scanning) {
								setScanning(false);
							} else {
								handleClick();
							}
						}}
						className="bg-[#00df9a] text-white px-6 py-2 rounded font-bold hover:bg-[#00c481] transition cursor-pointer"
					>
						{scanning ? 'Stop Scanning' : 'Start Scanning'}
					</button>
				</div>

				{scanning && (
					<div className="mt-6 flex justify-center">
						<video
							ref={videoRef}
							width="300"
							height="200"
							style={{ border: '2px solid #00df9a' }}
						/>
					</div>
				)}

				{product && (
					<div className="mt-6 text-xl">
						<p className="text-[#00df9a]">{product?.description}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Hero;
