// app/components/LocationDetail.tsx
'use client';

import Image from 'next/image';

type LocationDetailProps = {
	onClose: () => void;
	locationId?: string | null;
	nameJa?: string | null;
	nameEn?: string | null;
	onStartCapture?: () => void;
};

const DEST_IMAGE_MAP: Record<string, string> = {
	nakazakicho: '/img/nakazakicho.webp',
	tukamoto: '/img/tukamoto.webp',
	umeda: '/img/umeda_hankyu.webp',
	fureaipark: '/img/fureai_park.webp',
};

export default function LocationDetail({
	onClose,
	locationId,
	nameJa,
	nameEn,
	onStartCapture,
}: LocationDetailProps) {
	const mainImageSrc =
		locationId && DEST_IMAGE_MAP[locationId] ? DEST_IMAGE_MAP[locationId] : '/img/nakazakicho.webp';

	return (
		<div className="flex min-h-screen w-full flex-col items-center bg-main-color px-6 pt-6">
			<div className="relative w-full overflow-hidden rounded-[20px] mt-4 drop-shadow-map">
				{/* メイン画像 */}
				<div className="relative h-88.5 w-full">
					<Image
						src={mainImageSrc}
						alt={nameJa ?? 'Location'}
						width={400}
						height={288}
						className="h-full w-full object-cover"
					/>
					<button
						type="button"
						onClick={onClose}
						className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-main-color text-3xl text-main-color leading-8"
						aria-label="閉じる"
					>
						×
					</button>

					{/* サムネイルスタック */}
					{/* <div className="absolute bottom-6 right-4 flex flex-col gap-2">
						<div className="h-12 w-8 overflow-hidden rounded-md shadow-md">
							<Image
								src="/img/umeda_hankyu.webp"
								alt="thumb1"
								width={80}
								height={120}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="h-12 w-8 overflow-hidden rounded-md shadow-md">
							<Image
								src="/img/umeda_thumb2.webp"
								alt="thumb2"
								width={80}
								height={120}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="relative h-12 w-8 overflow-hidden rounded-md shadow-md">
							<Image
								src="/img/umeda_thumb3.webp"
								alt="thumb3"
								width={80}
								height={120}
								className="h-full w-full object-cover"
							/>
							<div className="absolute bottom-1 right-1 rounded-full bg-main-color px-1.5 py-0.5 text-[10px] font-semibold leading-none text-black">
								+20
							</div>
						</div>
					</div> */}
				</div>

				{/* 場所名フッター */}
				<div className="h-21 bg-black px-4 py-3 text-white">
					<p className="text-2xl font-regular text-main-color-wh">{nameJa}</p>
					<p className="text-base text-white/70">{nameEn}</p>
				</div>
			</div>

			{/* 投稿終了まで */}
			<div className="mt-10.5 w-full pl-4">
				<h2 className="inline-block text-2xl font-medium tracking-tighter bg-[linear-gradient(transparent_80%,#ffcc01_20%)]">
					投稿終了まで
				</h2>
				<p className="mt-2 text-base text-gray-700">〇月〇日〇時〇分</p>
			</div>

			{/* 概要 */}
			<div className="mt-8 w-full pl-4">
				<h3 className="text-base font-medium tracking-tighter">概要</h3>
				<p className="mt-3 text-sm tracking-tighter text-gray-700">
					にゃんっとキュートな瞬間を撮っちゃおう！ <br />
					チェキみたいな写真で、特別な思い出を残せるよ。
					<br />
					あなたの笑顔も、猫たちと一緒に“パチリ”。
				</p>
			</div>

			{/* ボタン */}
			<button
				type="button"
				className="mt-14 w-50 h-12 rounded-full bg-accent-color text-base font-medium text-main-color drop-shadow-button hover:brightness-105 active:translate-y-[1px]"
				onClick={() => {
					// LocationDetail を閉じて、カメラ UI を開く
					onStartCapture?.();
				}}
			>
				撮影する
			</button>
		</div>
	);
}
