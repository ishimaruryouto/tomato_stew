'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

type CameraClientProps = {
	open: boolean; // カメラUIを表示するかどうか（親から制御）
	onClose: () => void;
	onCapture: (dataUrl: string) => void;
};

export default function CameraClient({ open, onClose, onCapture }: CameraClientProps) {
	const webcamRef = useRef<Webcam>(null);

	// ① 内カメ/外カメの状態
	const [isFront, setIsFront] = useState(false);

	// ② カメラの設定（状態に応じて切り替え）
	const videoConstraints = {
		facingMode: isFront ? "user" : "environment",
	};

	// ③ 切り替えボタンの処理
	const toggleCamera = () => {
		setIsFront(prev => !prev);
	};

	const handleTakePhoto = useCallback(() => {
		if (!webcamRef.current) return;
		const dataUrl = webcamRef.current.getScreenshot(); // "data:image/jpeg;base64,..."
		if (dataUrl) {
			onCapture(dataUrl);
			// 撮影後に閉じるならここで onClose() を呼んでも良い
			// onClose();
		}
	}, [onCapture]);

	if (!open) {
		// 親がopen=falseのときは何も描画しない
		return null;
	}



	return (
		<div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<section className="w-full h-full mx-auto bg-[#FEFFF5] rounded-lg flex flex-col">
				<div className="flex flex-1 flex-col justify-start items-end mr-6 mt-6">
					<button
						onClick={onClose}
						className="w-9 h-9 flex flex-col justify-center items-center rounded-full text-lg border-4 border-[#FFEA95]"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M0.334325 0.348901C0.548458 0.134648 0.838845 0.0142878 1.14163 0.0142878C1.44441 0.0142878 1.7348 0.134648 1.94893 0.348901L7.99286 6.39804L14.0368 0.348901C14.1421 0.239746 14.2681 0.152681 14.4074 0.092785C14.5468 0.032889 14.6966 0.0013618 14.8482 4.31509e-05C14.9998 -0.0012755 15.1502 0.0276405 15.2905 0.0851044C15.4308 0.142568 15.5583 0.227429 15.6656 0.334735C15.7728 0.442041 15.8576 0.569643 15.915 0.710096C15.9724 0.850549 16.0013 1.00104 16 1.15279C15.9986 1.30454 15.9671 1.4545 15.9073 1.59393C15.8475 1.73337 15.7605 1.85948 15.6514 1.9649L9.60747 8.01404L15.6514 14.0632C15.8594 14.2787 15.9745 14.5674 15.9719 14.8671C15.9693 15.1667 15.8492 15.4534 15.6375 15.6653C15.4258 15.8772 15.1394 15.9974 14.84 16C14.5406 16.0026 14.2522 15.8874 14.0368 15.6792L7.99286 9.63004L1.94893 15.6792C1.73357 15.8874 1.44513 16.0026 1.14574 16C0.846342 15.9974 0.559947 15.8772 0.348234 15.6653C0.136522 15.4534 0.0164322 15.1667 0.0138305 14.8671C0.0112289 14.5674 0.126324 14.2787 0.334325 14.0632L6.37825 8.01404L0.334325 1.9649C0.120257 1.75058 0 1.45995 0 1.1569C0 0.853856 0.120257 0.563218 0.334325 0.348901Z" fill="#333333" />
						</svg>
					</button>
				</div>
				<div className="w-73 h-98.5 mx-auto mb-10 border-5 border-[#FFCC01] rounded-3xl overflow-hidden bg-black shadow-[inset_0_0_20px_0_rgba(34,34,34,0.20)]">
					<Webcam
						ref={webcamRef}
						audio={false}
						screenshotFormat="image/jpeg"
						videoConstraints={{ facingMode: 'environment' }}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				</div>

				<div className="flex items-center justify-center">
					{/* 中くらいの丸 */}
					<div className="w-[110px] h-[110px] rounded-full bg-white shadow-[0_6px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
						{/* 内側のボタン（肉球） */}
						<button
							onClick={handleTakePhoto}
							className="w-[80px] h-[80px] rounded-full bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)] flex items-center justify-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="65"
								height="65"
								viewBox="0 0 65 65"
								fill="none"
							>
								<path d="M11.9416 21.2563C11.3927 21.4692 7.43335 24.7093 10.7486 30.2584C11.0483 30.7692 14.2234 35.7306 18.2084 33.1007C18.2084 33.1007 22.6913 29.5899 19.0546 23.8191C18.7601 23.344 16.202 19.6175 11.9416 21.2563Z" fill="#FFEA95" />
								<path d="M52.6487 22.0258C52.1249 21.7443 47.1008 20.8522 45.0408 26.9853C44.8494 27.5491 43.1542 33.1909 47.7465 34.5001C47.7465 34.5001 53.333 35.6119 55.3417 29.0939C55.5035 28.5569 56.6666 24.1908 52.6487 22.0258Z" fill="#FFEA95" />
								<path d="M23.4719 9.73435C23.4719 9.73435 18.9656 11.474 19.4006 17.4151C19.4006 17.4151 20.3205 23.5649 24.1968 24.335C24.1968 24.335 29.6361 26.2536 30.4402 19.4762C30.5148 18.8427 30.5899 14.1524 27.8201 11.2506C27.8201 11.2506 26.2006 8.98069 23.4861 9.73507L23.4719 9.73435Z" fill="#FFEA95" />
								<path d="M41.5287 9.97063C41.5287 9.97063 36.6969 9.75383 34.7266 15.3746C34.7266 15.3746 33.1124 21.3746 36.3537 23.6348C36.3537 23.6348 40.5653 27.5655 44.0216 21.6803C44.3468 21.1303 46.2907 16.8676 44.9106 13.0876C44.9106 13.0876 44.3339 10.3607 41.5361 9.96393L41.5287 9.97063Z" fill="#FFEA95" />
								<path d="M38.7942 30.7965C38.4898 30.2358 35.2643 23.7567 28.4515 27.0007C28.4515 27.0007 26.3945 27.6327 23.5332 32.5357C23.5332 32.5357 20.2482 36.2985 19.7455 36.5775C19.7455 36.5775 15.2299 40.4549 15.4236 44.5924C15.4236 44.5924 15.3645 53.4326 24.9793 51.2016C24.9793 51.2016 31.2518 49.5373 34.6299 50.6362C34.6299 50.6362 39.5485 51.9336 39.6735 51.9824C39.7984 52.0313 45.8673 53.125 47.6591 46.6951C47.6591 46.6951 48.7786 42.0719 44.0478 37.4918C44.0478 37.4918 39.1521 31.4164 38.8083 30.7972L38.7942 30.7965Z" fill="#FFEA95" />
							</svg>
						</button>
					</div>
				</div>
				{/* 内カメと外カメの切り替えボタン */}
				<button onClick={toggleCamera}
					className="w-10 h-12 flex justify-center items-center border-2 border-[#FFCC01] rounded-xl ml-auto mr-12 mb-7"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
						<path d="M15.034 14.9569C13.863 16.1241 12.3727 16.9185 10.751 17.24C9.12919 17.5614 7.44856 17.3956 5.92091 16.7633C4.39327 16.131 3.087 15.0606 2.16678 13.6871C1.24656 12.3135 0.753589 10.6982 0.75 9.04492" stroke="black" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
						<path d="M14.3601 19.2503L15.1921 15.8783C15.2304 15.7314 15.2385 15.5782 15.2159 15.428C15.1933 15.2778 15.1406 15.1338 15.0607 15.0046C14.9809 14.8754 14.8757 14.7638 14.7515 14.6764C14.6273 14.589 14.4866 14.5278 14.3381 14.4963L10.9661 13.6533" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M2.98608 5.04343C4.157 3.87591 5.64739 3.08122 7.26933 2.75956C8.89126 2.43791 10.5721 2.60369 12.1 3.236C13.6278 3.86832 14.9343 4.93886 15.8545 6.31264C16.7748 7.68641 17.2677 9.30191 17.2711 10.9554" stroke="black" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
						<path d="M3.66005 0.75L2.82805 4.122C2.78989 4.26901 2.78192 4.42223 2.80462 4.57241C2.82732 4.72258 2.88022 4.8666 2.96013 4.99576C3.04004 5.12493 3.1453 5.23655 3.26955 5.32391C3.3938 5.41126 3.53446 5.47252 3.68305 5.504L7.05405 6.347" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
				{/* 下の黄色背景 */}
				<div className="w-full h-[127px] bg-[#FFE866] shrink-0"></div>
			</section>
		</div>
	);
}
