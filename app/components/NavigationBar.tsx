// app/components/NavigationBar.tsx
'use client';
import { FaPerson } from 'react-icons/fa6';
import { FaCamera } from 'react-icons/fa6';
import { IoPerson } from 'react-icons/io5';

type NavigationBarProps = {
	onBack?: () => void;
	onCamera?: () => void;
	onProfile?: () => void;
	isCameraDisabled?: boolean;
};

export default function NavigationBar({
	onBack,
	onCamera,
	onProfile,
	isCameraDisabled,
}: NavigationBarProps) {
	return (
		<nav className="pointer-events-auto">
			<div className="w-[272px] h-14 flex items-center justify-evenly rounded-full bg-black/85 py-3 shadow-xl">
				{/* 現在地に戻る */}
				<button
					type="button"
					onClick={onBack}
					className="w-7.5 h-7.5 text-2xl bg-yellow-300 rounded-full .text-main-color flex items-center justify-center"
				>
					<FaPerson />
				</button>

				{/* カメラ */}
				<button
					type="button"
					onClick={isCameraDisabled ? undefined : onCamera}
					disabled={isCameraDisabled}
					className={`flex h-7.5 w-7.5 items-center justify-center rounded-full text-2xl shadow-md ${
						isCameraDisabled ? 'bg-gray-500 text-gray-300' : 'bg-yellow-400 text-black'
					}`}
				>
					<div>
						<FaCamera />
					</div>
				</button>

				{/* マイページ */}
				<button
					type="button"
					onClick={onProfile}
					className="w-7.5 h-7.5 text-2xl bg-yellow-300 rounded-full .text-main-color flex items-center justify-center"
				>
					<IoPerson />
				</button>
			</div>
		</nav>
	);
}
