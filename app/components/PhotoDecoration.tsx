'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import WriteComment from './WriteComment';

export type Stamp = {
	id: string;
	src: string;
	x: number; // 0..1
	y: number; // 0..1
	scale: number; // 1.0 基準
	rotation: number; // rad
};

type Props = {
	src: string;
	onRetake: () => void;
	onClose?: () => void;
	onComplete?: () => void;
	locationName?: string;
	locationId: string;
};

const STAMP_SOURCES = Array.from({ length: 12 }, (_, i) => `/img/stamp${i + 1}.png`);

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const clamp01 = (v: number) => clamp(v, 0, 1);

const MIN_SCALE = 0.3;
const MAX_SCALE = 3.0;
const SCALE_STEP = 0.1;
const ROT_STEP = Math.PI / 12; // 15deg

export default function PhotoDecoration({
	src,
	onRetake,
	onClose,
	onComplete,
	locationName,
	locationId,
}: Props) {
	const [isWritingComment, setIsWritingComment] = useState(false);

	const [selectedStampSrc, setSelectedStampSrc] = useState<string | null>(null);
	const [stamps, setStamps] = useState<Stamp[]>([]);

	// ★ 追加：編集対象（選択中スタンプ）
	const [activeStampId, setActiveStampId] = useState<string | null>(null);

	// ★ 追加：写真枠のDOM参照（座標計算に使う）
	const photoRef = useRef<HTMLDivElement | null>(null);

	// ★ 追加：ドラッグ中の情報
	const dragRef = useRef<{
		id: string;
		pointerId: number;
	} | null>(null);

	const activeStamp = stamps.find((s) => s.id === activeStampId) ?? null;

	const updateStamp = (id: string, patch: Partial<Stamp>) => {
		setStamps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
	};

	const removeStamp = (id: string) => {
		setStamps((prev) => prev.filter((s) => s.id !== id));
		setActiveStampId((cur) => (cur === id ? null : cur));
	};

	const getRelativePos = (clientX: number, clientY: number) => {
		const rect = photoRef.current?.getBoundingClientRect();
		if (!rect) return null;

		const x = clamp01((clientX - rect.left) / rect.width);
		const y = clamp01((clientY - rect.top) / rect.height);
		return { x, y };
	};

	const handlePlaceStamp = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!selectedStampSrc) {
			setActiveStampId(null);
			return;
		}

		const pos = getRelativePos(e.clientX, e.clientY);
		if (!pos) return;

		const id = crypto.randomUUID();
		setStamps((prev) => [
			...prev,
			{
				id,
				src: selectedStampSrc,
				x: pos.x,
				y: pos.y,
				scale: 1,
				rotation: 0,
			},
		]);

		setActiveStampId(id);
	};

	const handleStampPointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
		e.stopPropagation();
		setActiveStampId(id);

		dragRef.current = { id, pointerId: e.pointerId };
		(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
	};

	const handleStampPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const drag = dragRef.current;
		if (!drag) return;

		const pos = getRelativePos(e.clientX, e.clientY);
		if (!pos) return;

		updateStamp(drag.id, { x: pos.x, y: pos.y });
	};

	const handleStampPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		const drag = dragRef.current;
		if (!drag) return;
		if (drag.pointerId !== e.pointerId) return;

		dragRef.current = null;
		try {
			(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
		} catch {
			// 取れなくても致命的ではない
		}
	};

	if (isWritingComment) {
		return (
			<WriteComment
				src={src}
				stamps={stamps}
				onRetake={onRetake}
				onClose={() => setIsWritingComment(false)}
				onComplete={onComplete}
				locationName={locationName}
				locationId={locationId}
			/>
		);
	}

	return (
		<div className="w-screen h-full">
			<div className="relative px-6">
				<Image
					src="/img/footprints_yellow.png"
					alt="猫の足跡"
					width={70}
					height={70}
					className="absolute top-6 right-5"
				/>
				<Image
					src="/img/footprints_yellow.png"
					alt="猫の足跡"
					width={70}
					height={70}
					className="absolute top-13 right-25"
				/>
			</div>

			<div className="absolute right-6 top-6">
				{onClose && (
					<button type="button" onClick={onRetake}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							{' '}
							<path
								d="M0.417906 0.436126C0.685572 0.16831 1.04856 0.0178597 1.42704 0.0178597C1.80551 0.0178597 2.1685 0.16831 2.43616 0.436126L9.99108 7.99755L17.546 0.436126C17.6777 0.299683 17.8352 0.190851 18.0093 0.115981C18.1834 0.0411112 18.3707 0.00170225 18.5603 5.39386e-05C18.7498 -0.00159437 18.9377 0.0345506 19.1131 0.10638C19.2886 0.17821 19.4479 0.284286 19.5819 0.418419C19.716 0.552551 19.8219 0.712054 19.8937 0.88762C19.9655 1.06319 20.0016 1.2513 19.9999 1.44098C19.9983 1.63067 19.9589 1.81813 19.8841 1.99242C19.8093 2.16671 19.7006 2.32434 19.5643 2.45613L12.0093 10.0176L19.5643 17.579C19.8243 17.8484 19.9681 18.2093 19.9649 18.5838C19.9616 18.9584 19.8115 19.3167 19.5469 19.5816C19.2822 19.8464 18.9242 19.9967 18.55 19.9999C18.1757 20.0032 17.8152 19.8592 17.546 19.599L9.99108 12.0376L2.43616 19.599C2.16697 19.8592 1.80642 20.0032 1.43217 19.9999C1.05793 19.9967 0.699933 19.8464 0.435293 19.5816C0.170652 19.3167 0.0205402 18.9584 0.0172881 18.5838C0.0140361 18.2093 0.157905 17.8484 0.417906 17.579L7.97282 10.0176L0.417906 2.45613C0.150321 2.18823 0 1.82493 0 1.44613C0 1.06732 0.150321 0.704023 0.417906 0.436126Z"
								fill="#333333"
							/>{' '}
						</svg>
					</button>
				)}
			</div>

			<div className="px-6">
				<div className="w-64.5 h-102.5 bg-main-color drop-shadow-card rounded-b-md mt-31 mx-auto">
					<div
						ref={photoRef}
						className="w-56 h-74 overflow-hidden bg-white relative top-6.5 left-4.5"
						onPointerDown={handlePlaceStamp}
						onPointerMove={handleStampPointerMove}
						onPointerUp={handleStampPointerUp}
						onPointerCancel={handleStampPointerUp}
					>
						<div className="absolute inset-0">
							<Image src={src} alt="decorated" fill className="object-cover" unoptimized />
						</div>

						{stamps.map((s) => {
							const isActive = s.id === activeStampId;
							return (
								<div
									key={s.id}
									className={`absolute ${isActive ? 'z-20' : 'z-10'}`}
									style={{
										left: `${s.x * 100}%`,
										top: `${s.y * 100}%`,
										transform: `translate(-50%, -50%) rotate(${s.rotation}rad) scale(${s.scale})`,
										touchAction: 'none', // ★ 重要：モバイルでドラッグがスクロールに取られない
									}}
									onPointerDown={(e) => handleStampPointerDown(e, s.id)}
								>
									<div className={isActive ? 'ring-2 ring-black rounded-md' : ''}>
										<Image src={s.src} alt="stamp" width={80} height={80} />
									</div>
								</div>
							);
						})}

						{activeStamp && (
							<div
								className="absolute bottom-2 left-2 z-30 flex gap-2 rounded-md bg-white/80 p-1"
								onPointerDown={(e) => e.stopPropagation()}
							>
								<button
									type="button"
									className="px-2 py-1 rounded bg-white"
									onClick={() =>
										updateStamp(activeStamp.id, {
											scale: clamp(activeStamp.scale - SCALE_STEP, MIN_SCALE, MAX_SCALE),
										})
									}
								>
									−
								</button>

								<button
									type="button"
									className="px-2 py-1 rounded bg-white"
									onClick={() =>
										updateStamp(activeStamp.id, {
											scale: clamp(activeStamp.scale + SCALE_STEP, MIN_SCALE, MAX_SCALE),
										})
									}
								>
									＋
								</button>

								<button
									type="button"
									className="px-2 py-1 rounded bg-white"
									onClick={() =>
										updateStamp(activeStamp.id, { rotation: activeStamp.rotation - ROT_STEP })
									}
								>
									⟲
								</button>

								<button
									type="button"
									className="px-2 py-1 rounded bg-white"
									onClick={() =>
										updateStamp(activeStamp.id, { rotation: activeStamp.rotation + ROT_STEP })
									}
								>
									⟳
								</button>

								<button
									type="button"
									className="px-2 py-1 rounded bg-white"
									onClick={() => removeStamp(activeStamp.id)}
								>
									🗑
								</button>
							</div>
						)}

						<div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_8px_0_rgba(34,34,34,0.30)]" />
					</div>
				</div>
			</div>

			<button
				className="block mx-auto mt-5 flex justify-center items-center w-50 h-12 rounded-full bg-accent-color text-base font-medium text-main-color drop-shadow-button"
				onClick={() => setIsWritingComment(true)}
			>
				コメントを書く
			</button>

			<div className="w-screen h-12 bg-accent-color mt-6"></div>

			<div className="mt-4 px-10">
				<div className="grid grid-cols-4 px-2">
					{STAMP_SOURCES.map((stampSrc) => (
						<button
							key={stampSrc}
							type="button"
							onClick={() => setSelectedStampSrc(stampSrc)}
							className={`w-full rounded-md bg-white/60 flex items-center justify-center py-2 ${
								selectedStampSrc === stampSrc ? 'ring-2 ring-black' : ''
							}`}
						>
							<Image src={stampSrc} alt="stamp" width={56} height={56} className="h-12 w-auto" />
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
