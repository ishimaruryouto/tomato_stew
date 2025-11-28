'use client';

import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

type CameraClientProps = {
	open: boolean; // カメラUIを表示するかどうか（親から制御）
	onClose: () => void;
	onCapture: (dataUrl: string) => void;
};

export default function CameraClient({ open, onClose, onCapture }: CameraClientProps) {
	const webcamRef = useRef<Webcam>(null);

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
			<section className="w-full h-full mx-auto bg-white rounded-lg shadow pt-50 flex flex-col gap-4">
				<div className="w-73 h-98.5 mx-auto border-none rounded-3xl overflow-hidden bg-black shadow-[inset_0_0_20px_0_rgba(34,34,34,0.20)]">
					<Webcam
						ref={webcamRef}
						audio={false}
						screenshotFormat="image/jpeg"
						videoConstraints={{ facingMode: 'environment' }}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				</div>

				<div className="flex gap-2 justify-center">
					<button
						onClick={handleTakePhoto}
						className="px-4 py-2 rounded bg-green-600 text-white text-lg hover:bg-green-700"
					>
						撮影
					</button>
					<button
						onClick={onClose}
						className="px-4 py-2 rounded bg-red-600 text-white text-lg hover:bg-red-700"
					>
						閉じる
					</button>
				</div>
			</section>
		</div>
	);
}
